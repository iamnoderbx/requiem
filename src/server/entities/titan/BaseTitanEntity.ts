import EntityComponentMixin, { ComponentFunctionalities } from "server/components/ComponentMixin";

import { BaseEntity } from "../BaseEntity";
import { Entities } from "shared/EntitySignatures";
import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { BaseHumanoidEntity } from "../humanoid/BaseHumanoidEntity";
import { Titans } from "shared/utilities/titans.utilities";
import { Workspace } from "@rbxts/services";
import { BaseTitanBrain } from "./classes/BaseTitanBrain";
import { BaseTitanPriorities } from "./classes/BaseTitanPriorities";
import { Animations } from "shared/animations/animations";
import { BasePlayerEntity } from "../player/BasePlayerEntity";
import { UtilityNumberComponent } from "server/components/Utilities/UtilityNumberCompontent";
import { BlindTitanAbility } from "./default/BlindTitanAbility";
import { EntityMovementComponent } from "server/components/Entity/EntityMovementComponent";
import { TitanActions } from "shared/utilities/network/Events";
import { NapeTitanAbility } from "./default/NapeTitanAbility";

export class BaseTitanEntity extends BaseEntity implements ComponentFunctionalities {
    // Assigning a humanoid to the base character entity
    private humanoid! : BaseHumanoidEntity
    private instance! : Model;

    // Assigning a scale to the base character entity
    private scale : number = 1;
    private target : BasePlayerEntity | undefined;

    // Assigning grapples to the base character entity
    public static grapples : Record<number, Record<number, number>> = {};

    // Assigning abilities to the base character entity
    private abilities = {
        blind: new BlindTitanAbility(this), // Create a new blind titan ability
        nape: new NapeTitanAbility(this),
    }

    private gyro: BodyGyro | undefined;

    // Constructs a new BaseTitanEntity. Injects the model instance into the constructor.
    constructor() {
        // Create a new utility number component for the player id
        const ownership = new UtilityNumberComponent.Component({
            value: 0,
        })

        const movement = new EntityMovementComponent.Component({
            sprint: 0, walkspeed: 0, humanoid: 0,
        })
        
        super(Entities.Entities.BASE_TITAN, new ComponentWrapper.Entity([ ownership, movement ]),
            (promise) => promise.then(() => this.initialize()));
    }

    private async onBrainFunctionalities() {
        if(!this.target) return
        if(this.isEntityOnCooldown()) return;

        // Get the brain
        const brain = BaseTitanBrain.get(this.getEntityPointer());
        const priority = brain.highest_priority;

        // If the priority is 3, execute the blind ability
        if(priority === 3) return this.abilities.blind.onAbilityExecution(this.target);

        // If the priority is 4, protect the nape.
        if(priority === 5) return this.abilities.nape.onAbilityExecution(this.target);
    }

    private async onBrainPriorityChanged() {
        const brain = BaseTitanBrain.get(this.getEntityPointer());
        const target_id = brain.priority;

        // If the target id is -1, return
        if(target_id === -1) return;

        // Get the target entity
        const target = BaseEntity.resolveEntityFromId<BasePlayerEntity>(target_id);
        if(!target) return;

        // Get the ownership component
        const component = this.getComponent(UtilityNumberComponent);
        const ownership = component.get()

        // If the ownership is not the target id, set the ownership to the target id
        if(ownership !== target.getUserId()) {
            // Set the ownership to the target id
            component.set(target.getUserId())

            // Set the network owner to the target
            this.instance.PrimaryPart?.SetNetworkOwner(target.getInstance())

            // Set the target to the target entity
            this.network.action(TitanActions.NETWORK, target.getUserId())
        }

        this.target = target;
    }

    private async onBrainProcessed() {
        // Get the entity pointer
        const id = this.getEntityPointer();

        const heatmap = BaseTitanPriorities.createTitanHeatmapPriority((root, id) => {
            // Drop the player if the root does not exist
            const primaryPart = this.instance.PrimaryPart;
            if(!primaryPart || !root.Parent) return -1;

            // Assign the priority to 0
            let priority : number = 1;

            // Get the distance between the root and the titan entity
            const distance = root.Position.sub(primaryPart.Position).Magnitude
            
            const grapples = BaseTitanEntity.grapples[this.getEntityPointer()][id]
            if(grapples && grapples > 0) {
                // Get the players entity
                const direction = root.AssemblyLinearVelocity.Unit;

                // Get the head of the titan
                const head = this.instance.FindFirstChild("Head") as Part;
                if(!head) return -1;

                // Remove the YAxis from the titan
                const noYAxis = new Vector3(root.Position.X, head.Position.Y, root.Position.Z);
                const distanceFromHead = head.Position.sub(noYAxis).Magnitude;

                // Get the goal position
                const goalYAxis = root.Position.add(direction.mul(distanceFromHead))
                const goal = new Vector3(goalYAxis.X, head.Position.Y, goalYAxis.Z);

                // Get the distance from the goal
                const distanceFromGoal = goal.sub(head.Position).Magnitude;

                // Get the dot product of the head and root
                const dot = head.CFrame.LookVector.Unit.Dot(root.CFrame.LookVector.Unit);
                const isBehind = dot > 0

                // If the player is behind the titan, add 3 to the priority
                if(isBehind && distanceFromGoal < 50 && distanceFromGoal < 150) {
                    priority += 3
                } else if(distanceFromGoal < 50 && distanceFromGoal < 100) {
                    priority += 1
                }
            };

            // If the player is within the aggression range, add one to the priority;
            if(distance < 300) priority += 1;

            // Return the priority
            return priority;    
        })

        // Get the highest priority from the heatmap
        const { result, priority } = BaseTitanPriorities.getHighestTitanHeatmapPriority(heatmap);

        // Get the brain and result
        const brain = BaseTitanBrain.get(id);
        if(!brain || !result) return;

        if(priority > brain.highest_priority) this.clearEntityCooldowns()

        // If the priority is higher than the current priority, set the new priority
        if(((priority > brain.highest_priority) || (priority < brain.highest_priority && priority !== brain.highest_priority))) {
            brain.highest_priority = priority;
            brain.priority = result.getEntityPointer();

            BaseTitanBrain.invoke(id, "priority")
        }

        // Get the root of the player
        const root = await result.getCharacter().getHumanoidRootPart()
        const distance = root.Position.sub(this.instance.PrimaryPart!.Position).Magnitude

        // Normalize the distance from 30 to 500 to an integer 0 to 1
        const normalized = (distance - 20) / (2500 - 20)
        const rate = math.clamp(2 * normalized, 0, 2)
        
        BaseTitanBrain.throttle(id, rate)
        this.onBrainFunctionalities()
    }

    public spawn(location : CFrame) {
        // Ensure the entity has been initialized
        if(!this.instance) throw "Entity not initialized!"

        // Set the position of the titan entity
        this.instance.PivotTo(location.mul(new CFrame(0, (5 * this.scale) / 2, 0)))
        this.instance.Parent = Workspace;

        // Get the entity pointer
        const id = this.getEntityPointer();

        if(!BaseTitanEntity.grapples[id]) BaseTitanEntity.grapples[id] = {}

        // Create and begin the brain.
        BaseTitanBrain.create(id)
        BaseTitanBrain.connect(id, () => this.onBrainProcessed())

        // Connect the brain to the priority
        BaseTitanBrain.connection(id, "priority", () => this.onBrainPriorityChanged())
    }

    // Initialize the base titan entity
    public initialize() {
        // Create a new model instance for the base titan entity
        const { model, scale } = Titans.Model(Titans.Types.DEFAULT);
        
        // Assign the model and scale to the base titan entity
        this.instance = model;
        this.scale = scale;
        
        // Assigning a humanoid component to the base character entity
        this.humanoid = new BaseHumanoidEntity(this.instance, undefined, Animations.TITAN);
        this.gyro = this.humanoid.createTurnGyro()

        if(this.gyro) this.gyro.D = 50
        if(this.gyro) this.gyro.P = 1000

        // Get the movement component
        const movement = this.getComponent(EntityMovementComponent);
        
        // Set the walkspeed of the entity
        movement.rewrite({
            humanoid: this.humanoid.getEntityPointer(), 
            sprint: 1.3, 

            // Set the walkspeed to 40
            walkspeed: 25
        })
    }
}

// Use declaration merging to tell TypeScript that Entity has a test method
export interface BaseTitanEntity extends ComponentFunctionalities {}
export default EntityComponentMixin(BaseTitanEntity)