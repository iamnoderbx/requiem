import { BaseEntity } from "client/entities/BaseEntity";
import { BaseClientMovement, ClientMovementController } from "./BaseClientMovement";
import { UserInputService } from "@rbxts/services";
import animations, { Actions, Animations } from "shared/animations/animations";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { Hitbox } from "shared/utilities/hitbox.utilities";
import ClientSlideMovement from "./ClientSlideMovement";

export namespace ClientJumpMovement {
    export let isSprinting : boolean = false;

    export const JUMP_COOLDOWN : number = 1;

    export class Movement extends BaseClientMovement {
        private cooldown : number = 0;
    
        private async jump() {
            const client = await BaseEntity.resolveClientEntity();
            if(!client) return

            const humanoid = client.getEntityHumanoid();
            if(!humanoid) return;

            if(ClientSlideMovement.isSliding.get("sliding")) {
                const movement = (ClientMovementController.movements.ClientSlideMovement) as ClientSlideMovement.Movement;
                movement.jump()

                this.cooldown = tick();
                return
            }

            const jumppower = humanoid.getStatistics()?.get('jumppower')
            if(!jumppower || jumppower.value < 45) return;

            const model = client.getCharacterModel();
            const root = model?.FindFirstChild("HumanoidRootPart") as Part;
            const humanoidInstance = model?.FindFirstChild("Humanoid") as Humanoid;

            if(!root || !humanoidInstance || humanoidInstance.GetState() === Enum.HumanoidStateType.Freefall) return;
            if(!Hitbox.Ground(root.Position, [ root.Parent! ])) return;
            
            const animator = humanoid.getEntityAnimator()
            if(!animator) return;

            animator.play(animations[Actions.MOVEMENT].JUMP, 0.1)
            jumppower.adjust("cooldown", 0, {Mode: StatisticModes.SET, Priority: 2, Lifetime: JUMP_COOLDOWN})

            this.cooldown = tick();
        }
        
        public initialize() {
            UserInputService.JumpRequest.Connect(async () => {
                if(tick() - this.cooldown < JUMP_COOLDOWN) {
                    return
                }

                this.jump()
            })
        }
    }
}

export default ClientJumpMovement;