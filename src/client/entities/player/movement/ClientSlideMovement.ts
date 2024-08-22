import { BaseEntity } from "client/entities/BaseEntity";
import { BaseClientMovement, } from "./BaseClientMovement";
import { Input } from "client/utilities/BaseInputUtilities";
import ClientSprintMovement from "./ClientSprintMovement";
import { Hitbox } from "shared/utilities/hitbox.utilities";
import { Memory } from "shared/utilities/memory.utilities";
import { RunService } from "@rbxts/services";
import animations, { Actions } from "shared/animations/animations";
import { ClientStunnedSubscription } from "client/entities/humanoid/BaseCharacterEntity";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { States } from "../ClientPlayerStates";

export const UpVector = new Vector3(0, 1, 0)

export namespace ClientSlideMovement {
    // Create a memory object with a sliding state
    export let isSliding = Memory.create({sliding : false})
    States.addStateToCategory(States.Types.BUSY, isSliding.subscription("sliding"))

    // Create a class for the movement
    export class Movement extends BaseClientMovement {
        private input : Input = new Input();
        private decay : number = 1;

        private connection : RBXScriptConnection | undefined;
        private animation : AnimationTrack | undefined;

        private velocity : BodyVelocity | undefined;
        private isDownSlope : boolean = false;

        /**
         * This function handles the jump action of the client.
         * 
         * @returns {Promise<void>} 
         * 
         * @author NodeSupport
         */
        public async jump() : Promise<void> {
            // Disconnect any existing connections and set sliding to false
            this.connection?.Disconnect();
            ClientSlideMovement.isSliding.set("sliding", false);

            // Resolve the client entity and get the humanoid and model
            const client = await BaseEntity.resolveClientEntity();
            const clientHumanoid = client?.getEntityHumanoid();
            
            const model = client?.getCharacterModel();
            const humanoid = model?.FindFirstChild("Humanoid") as Humanoid;
            const root = model?.FindFirstChild("HumanoidRootPart") as BasePart;

            const animator = client.getEntityHumanoid().getEntityAnimator();

            // If root or humanoid is not available, return
            if(!root || !humanoid) return;

            // Calculate jump power based on whether the client is on a down slope
            const jumppower = this.isDownSlope ? 1.3 : 0.9;
            const speed = root.AssemblyLinearVelocity.Magnitude;
            const velocity = root.AssemblyLinearVelocity.mul(1.2).add(new Vector3(0, speed * jumppower, 0));

            // If velocity is not available, return
            if(!this.velocity) return;

            // Set AutoRotate to true and stop any existing animations
            humanoid.AutoRotate = true;
            this.animation?.Stop(0.2);

            animator?.play(animations[Actions.MOVEMENT].SLIDE_JUMP, 0.1);

            // Adjust field of view and set velocity
            const fieldofview = clientHumanoid?.getStatistics()?.get('fov');
            fieldofview?.adjust("movement", 20, {Mode: StatisticModes.ADD, Priority: 3, Tween: new TweenInfo(0.4)});
            this.velocity.MaxForce = new Vector3(90000, 90000, 90000);
            this.velocity.Velocity = velocity;

            // Delay the deletion of the velocity and the field of view adjustment
            task.delay(0.2, () => {
                this.velocity?.Destroy();
                task.wait(0.2);
                fieldofview?.deleteStatistic("movement", {Mode: StatisticModes.ADD, Priority: 3, Tween: new TweenInfo(1)});
            });
        }

        /**
         * This function begins the sliding movement of the client.
         * 
         * @returns {Promise<Enum.ContextActionResult>} 
         * 
         * @author NodeSupport
         */
        private async begin() : Promise<Enum.ContextActionResult> {
            const verify = await this.verify();
            if(!verify) return Enum.ContextActionResult.Pass;

            // Set the client to be sliding
            ClientSlideMovement.isSliding.set("sliding", true);

            const client = await BaseEntity.resolveClientEntity();
            if(!client) return Enum.ContextActionResult.Pass;

            const model = client.getCharacterModel();
            const root = model?.FindFirstChild("HumanoidRootPart") as BasePart;
            if(!root) return Enum.ContextActionResult.Pass;

            // Create a new BodyVelocity instance and set its properties
            const velocity = new Instance("BodyVelocity");
            velocity.MaxForce = new Vector3(90000, 0, 90000);
            velocity.Velocity = root.AssemblyLinearVelocity.mul(1.3);
            velocity.Parent = root;

            this.velocity = velocity;

            // Play the slide animation
            const animator = client.getEntityHumanoid().getEntityAnimator();
            this.animation = animator?.play(animations[Actions.MOVEMENT].SLIDE, 0.25);

            const start = tick();

            let isHeightIncreasing = false;
            let lastYHeight = root.Position.Y;

            this.isDownSlope = false;
            this.decay = 1;

            const humanoid = model?.FindFirstChild("Humanoid") as Humanoid;
            humanoid.AutoRotate = false;

            // Connect to the RenderStepped event to update the sliding movement
            this.connection = RunService.RenderStepped.Connect(() => {
                const ground = Hitbox.Ground(root.Position, [ model! ]);
                if(!ground) return this.cancel();

                const angle = ground.Normal.Dot(UpVector);
                if(angle < 0.7) return this.cancel();

                const ray = Hitbox.Ray(root.Position, root.CFrame.LookVector, 3, [ model! ]);
                if(ray && ray.Instance) return this.cancel();

                // Normalize the angle from 0.7 to 1
                const speed = 40;
                const normalized = (1 + (1 - (angle - 0.7) / (1 - 0.7)) / speed);

                if(tick() - start > 0.5) {
                    if(root.Position.Y > lastYHeight) isHeightIncreasing = true;
                    if(root.Position.Y + 2 < lastYHeight) this.isDownSlope = true;

                    if(isHeightIncreasing) this.decay = 0.925;
                    else if(angle > 0.995) this.decay = 0.95;
                    else this.decay = (1.003 * normalized);
                }

                const vel = velocity.Velocity.mul(this.decay);
                velocity.Velocity = new Vector3(math.clamp(vel.X, -100, 100), 0, math.clamp(vel.Z, -100, 100));

                if(velocity.Velocity.Magnitude < 12) this.cancel();
            });

            return Enum.ContextActionResult.Pass;
        }

        /**
         * This function cancels the sliding movement of the client.
         * 
         * @returns {Promise<void>} 
         * 
         * @author NodeSupport
         */
        private async cancel() : Promise<void> {
            // Disconnect any existing connections and set sliding to false
            if(this.connection) this.connection.Disconnect();
            ClientSlideMovement.isSliding.set("sliding", false);

            // Resolve the client entity and get the humanoid and model
            const client = await BaseEntity.resolveClientEntity();
            if(!client) return;

            const model = client.getCharacterModel();
            const humanoid = model?.FindFirstChild("Humanoid") as Humanoid;

            // Set AutoRotate to true and stop any existing animations
            humanoid.AutoRotate = true;
            this.animation?.Stop(0.2);

            // Destroy the velocity
            this.velocity?.Destroy();
        }

        /**
         * This function verifies if the client can start sliding.
         * 
         * @returns {Promise<boolean>} Returns true if the client can start sliding, false otherwise.
         * 
         * @author NodeSupport
         */
        private async verify() : Promise<boolean> {
            // Check if the client is sprinting
            if(!ClientSprintMovement.isSprinting) return false;

            // Resolve the client entity
            const client = await BaseEntity.resolveClientEntity();
            if(!client) return false;

            // Check if the client is busy or in combat
            if(States.isClientBusy()) return false;
            if(States.isCategoryBusy(States.Types.COMBAT)) return false;

            // Get the client's model, root part, and humanoid
            const model = client.getCharacterModel();
            const root = model?.FindFirstChild("HumanoidRootPart") as BasePart;
            const humanoid = model?.FindFirstChild("Humanoid") as Humanoid;

            // Check if there's an obstacle in front of the client
            const ray = Hitbox.Ray(root.Position, root.CFrame.LookVector, 3, [ model! ]);
            if(ray && ray.Instance) return false;

            // Check if the root part and humanoid exist
            if(!root || !humanoid) return false;

            // Check if the client's velocity is above a certain threshold
            const velocity = root.AssemblyLinearVelocity.Magnitude;
            if(velocity < 15) return false;

            // Check if the client is in freefall or if their walk speed is below a certain threshold
            if(humanoid.GetState() === Enum.HumanoidStateType.Freefall) return false;
            if(humanoid.WalkSpeed < 14) return false;

            // Check if the client is on the ground
            const ground = Hitbox.Ground(root.Position, [ model! ]);
            if(!ground) return false;

            // If all checks pass, return true
            return true;
        }

        /**
         * This function handles the slide action of the client.
         * 
         * @param {Enum.UserInputState} state - The state of the user input.
         * 
         * @returns {Promise<Enum.ContextActionResult>} The result of the context action.
         * 
         * @author NodeSupport
         */
        private async slide(state: Enum.UserInputState): Promise<Enum.ContextActionResult> {
            if(state === Enum.UserInputState.Cancel) return Enum.ContextActionResult.Pass;
            
            if(state === Enum.UserInputState.Begin) {
                return this.begin()
            }
            
            return Enum.ContextActionResult.Pass;
        }

        /**
         * This function initializes the client slide movement.
         * 
         * @returns {void} 
         * 
         * @author NodeSupport
         */
        public initialize() : void {
            // Listen for the LeftControl key to be pressed
            // If pressed, call the slide function
            this.input.createInputContext(Enum.KeyCode.LeftControl).connect(
                (state) => this.slide(state))

            // Subscribe to the ClientStunnedSubscription
            // If the client is stunned while sliding, cancel the slide
            Memory.subscribe(ClientStunnedSubscription, () => {
                if(ClientSlideMovement.isSliding.get("sliding")) this.cancel()
            })
        }
    }
}

export default ClientSlideMovement;