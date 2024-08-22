import { Physics } from "shared/utilities/physics.utilitites";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics, GearStatisticType } from "../../classes/ClientGearStatistics";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import BaseGearHandles from "../handles/BaseGearHandles";
import { Input } from "client/utilities/BaseInputUtilities";
import { UserInputService } from "@rbxts/services";
import BaseGearWinches from "../winches/BaseGearWinches";
import { Number } from "shared/utilities/number.utilities";
import { NetworkEntity } from "client/network/NetworkEntity";
import { Vector } from "shared/utilities/vector3.utilities";

export enum GearEjectorDirection {
    FORWARD = "FORWARD",
    BACKWARD = "BACKWARD",
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export default class BaseGearEjector extends ClientGearComponent {
    // Create a new input to determine the gas ejecting direction
    private input : Input = new Input();
    private winches! : BaseGearWinches

    // Create a new body gyro
    private bodyVelocity : BodyVelocity = new Instance("BodyVelocity")

    private __onGasEjectorBoostChanged : BindableEvent = new Instance("BindableEvent")
    public onGasEjectorBoostChanged : RBXScriptSignal = this.__onGasEjectorBoostChanged.Event

    private __onEjectorDirectionChanged : BindableEvent = new Instance("BindableEvent")
    public onEjectorDirectionChanged : RBXScriptSignal = this.__onEjectorDirectionChanged.Event

    private speed : Number.Ease = new Number.Ease(0);
    private gas : Number.Ease = new Number.Ease(0);
    private power : Number.Ease = new Number.Ease(0);
    private direction : Vector.Ease = new Vector.Ease(new Vector3(0, 0, 0));
    private force : Vector.Ease = new Vector.Ease(new Vector3());

    private updatedTimestamp : number = 0;
    private __direction : Vector3 = new Vector3(0, 0, 0);

    private isGasBoostingValue : boolean = false;

    constructor(statistics : ClientGearStatistics) {
        super(statistics);

        // Add a the vertical & horizontal speeds
        this.statistics.addStatistic(GearStatisticType.VERTICAL_SPEED, 10);
        this.statistics.addStatistic(GearStatisticType.HORIZONTAL_SPEED, 70);

        // Set the reel speed
        this.statistics.addStatistic(GearStatisticType.GRAPPLE_SPEED, 1.5);

        // Set the speed multiplier
        this.statistics.addStatistic(GearStatisticType.SPEED_MULTIPLIER, 2);
        this.statistics.addStatistic(GearStatisticType.GAS_MULTIPLIER, 2);
        
        // Set the momentum multiplier
        this.statistics.addStatistic(GearStatisticType.MOMENTUM_MULTIPLIER, 1.25);

        // Modify the weight of the ejector
        this.statistics.addStatistic(GearStatisticType.WEIGHT, 5);

        this.force.Connect(() => {
            this.bodyVelocity.MaxForce = this.force.Get();

            if(this.force.Get().Magnitude < 2) {
                this.bodyVelocity.Parent = undefined;
                Physics.RestoreClientPhysics()
            }
        })
    };

    private create() {
        const { character, humanoid, root } = this.getCharacterComponents();
        if(!character || !humanoid || !root) return;

        // Create a new body gyro
        this.bodyVelocity.MaxForce = this.force.Get();
        this.bodyVelocity.P = 1000;

        //this.force.Disconnect()
        this.force.EaseTo(new Vector3(150, 150, 150), new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));

        // Remove the clients physics
        Physics.RemoveClientPhysics();

        return this.bodyVelocity;
    }
    
    private clean() {
        if(!this.bodyVelocity) return;

        // Clear the input contexts
        this.input.clearInputContexts();
        this.onEjectorDisabled()

        this.updatedTimestamp = 0;
    }

    public isGasBoosting() {
        const isGasBoosting = UserInputService.IsKeyDown(Enum.KeyCode.Space)
        const isBoosting = isGasBoosting && !this.winches.isSlacking() && this.bodyVelocity !== undefined

        if(isBoosting !== this.isGasBoostingValue) {
            this.isGasBoostingValue = isBoosting;
            this.__onGasEjectorBoostChanged.Fire(isBoosting)
        }

        return isBoosting;        
    }

    private onEjectorEnabled() {
        const horizontalGearSpeed = this.statistics.getStatistic(GearStatisticType.HORIZONTAL_SPEED);
        const speedMultiplier = this.statistics.getStatistic(GearStatisticType.SPEED_MULTIPLIER);
        const momentumMultiplier = this.statistics.getStatistic(GearStatisticType.MOMENTUM_MULTIPLIER);

        if(this.power.GetGoal() !== momentumMultiplier) {
            this.power.EaseTo(momentumMultiplier, new TweenInfo(15, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
        }

        if(this.speed.GetGoal() === horizontalGearSpeed * speedMultiplier) return;
        this.speed.EaseTo(horizontalGearSpeed * speedMultiplier, new TweenInfo(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
    }

    private onEjectorDisabled() {
        this.power.EaseTo(0, new TweenInfo(2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
        
        this.force.EaseTo(new Vector3(0, 0, 0), new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
        this.direction.EaseTo(new Vector3(0, 0, 0), new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));

        if(this.speed.GetGoal() === 0) return;
        this.speed.EaseTo(0, new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
    }

    // Updated is called every frame that a grapple is active
    public updated(grapples : BaseGearGrapples) {
        const dt = os.clock() - (this.updatedTimestamp || os.clock());

        const { character, humanoid, root } = this.getCharacterComponents();
        if(!character || !humanoid || !root) return;

        // Create the velocity
        if(!this.bodyVelocity || !this.bodyVelocity.Parent) {
            this.create()
        }

        if(!this.bodyVelocity) return;

        const center = grapples.getPivotCenter();
		if (!center) return;

        // Update the gas ejector
        this.isGasBoosting();
        this.onEjectorEnabled();

        // Set the velocity parent
		if (!this.bodyVelocity.Parent) this.bodyVelocity.Parent = character.PrimaryPart;

        let directionVector = this.getDirectionalVector();

        // Set the direction
        if(this.__direction !== directionVector) {
            this.__direction = directionVector;
            this.direction.EaseTo(directionVector, new TweenInfo(0.2, Enum.EasingStyle.Linear));
        }

        const offset = root.CFrame.mul(new CFrame(this.direction.Get())).Position;

        let directionUnit = (offset.sub(root.Position)).Unit;
        if(directionUnit.Magnitude === 0 || directionUnit !== directionUnit) directionUnit = new Vector3(0, 0, 0);

        const speed = this.speed.Get();
        const gas = this.gas.Get();
        const power = this.power.Get();

        const directionalSpeed = directionUnit.mul((this.direction.Get().Magnitude))
        const direction = ((center.sub(root.Position)).Unit).add(directionalSpeed);
        
        const goal = direction.mul((speed * (1 + (gas))) * (1 + power));
        this.bodyVelocity.Velocity = this.bodyVelocity.Velocity.Lerp(goal, dt * 30);

        this.updatedTimestamp = os.clock();
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList, network : NetworkEntity) {
        // Get the grapples component
        const grapples  = this.getComponent<BaseGearGrapples>(components, GearComponents.GRAPPLES)
        const handles   = this.getComponent<BaseGearHandles>(components, GearComponents.HANDLES)
        const winches   = this.getComponent<BaseGearWinches>(components, GearComponents.WINCHES)

        // Set the winches
        this.winches = winches

        // Add a middleware to the grapple
        handles.addGrappleMiddleware((isGrappling : boolean) => isGrappling ? this.updated(grapples) : this.clean())

        // Listen for the gas ejector boost changed
        this.onGasEjectorBoostChanged.Connect((isBoosting : boolean) => {
            const gasMultiplier = this.statistics.getStatistic(GearStatisticType.GAS_MULTIPLIER);

            if(isBoosting) {
                this.gas.EaseTo(gasMultiplier, new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
            } else {
                this.gas.EaseTo(0, new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out));
            }
        })
    }
}