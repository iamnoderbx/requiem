import { Physics } from "shared/utilities/physics.utilitites";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics, GearStatisticType } from "../../classes/ClientGearStatistics";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import BaseGearHandles from "../handles/BaseGearHandles";
import { Input } from "client/utilities/BaseInputUtilities";
import { UserInputService } from "@rbxts/services";
import { Math } from "shared/utilities/math.utilities";
import BaseGearWinches from "../winches/BaseGearWinches";
import { States } from "client/entities/player/ClientPlayerStates";
import { Number } from "shared/utilities/number.utilities";
import { NetworkEntity } from "client/network/NetworkEntity";

export enum GearEjectorDirection {
	FORWARD = "FORWARD",
	BACKWARD = "BACKWARD",
	LEFT = "LEFT",
	RIGHT = "RIGHT"
}

export default class BaseGearEjector extends ClientGearComponent {
	// Create a new input to determine the gas ejecting direction
	private input: Input = new Input();
	private winches!: BaseGearWinches

	// Create a new body gyro
	private velocity: BodyVelocity | undefined

	private direction: Vector3 = new Vector3(0, 0, 0);
	private __direction: Vector3 = new Vector3(0, 0, 0);

	private ejectorDirection: GearEjectorDirection = GearEjectorDirection.FORWARD;

	private __onGasEjectorBoostChanged: BindableEvent = new Instance("BindableEvent")
	public onGasEjectorBoostChanged: RBXScriptSignal = this.__onGasEjectorBoostChanged.Event

	private __onEjectorDirectionChanged: BindableEvent = new Instance("BindableEvent")
	public onEjectorDirectionChanged: RBXScriptSignal = this.__onEjectorDirectionChanged.Event

	private speed: number = 0;
	private lerp_easing: Number.Ease | undefined

	private clocked: number = os.clock();

	private force: BodyForce | undefined;
	private isBoosting: boolean = false;

	constructor(statistics: ClientGearStatistics) {
		super(statistics);

		// Add a the vertical & horizontal speeds
		this.statistics.addStatistic(GearStatisticType.VERTICAL_SPEED, 5);
		this.statistics.addStatistic(GearStatisticType.HORIZONTAL_SPEED, 10);

		// Set the reel speed
		this.statistics.addStatistic(GearStatisticType.GRAPPLE_SPEED, 1.5);

		// Set the speed multiplier
		this.statistics.addStatistic(GearStatisticType.SPEED_MULTIPLIER, 3);
		this.statistics.addStatistic(GearStatisticType.GAS_MULTIPLIER, 2);

		// Modify the weight of the ejector
		this.statistics.addStatistic(GearStatisticType.WEIGHT, 5);
	};

	private create() {
		const { character, humanoid, root } = this.getCharacterComponents();
		if (!character || !humanoid || !root) return;

		// Create a new body gyro
		this.velocity = new Instance("BodyVelocity")
		this.velocity.MaxForce = new Vector3(math.huge, math.huge, math.huge);

		//this.velocity.Velocity = root.AssemblyLinearVelocity.mul(0.5);
		this.velocity.Velocity = root.AssemblyLinearVelocity

		// Remove the clients physics
		//Physics.RemoveClientPhysics();

		this.force && this.force.Destroy();
		this.force = undefined;
		this.direction = new Vector3(0, 0, 0);
		this.speed = 0

		return this.velocity;
	}

	private clean() {
		if (!this.velocity) return;

		// Destroy the gyro
		if (this.velocity) this.velocity.Destroy();
		this.velocity = undefined;

		// Clear the input contexts
		this.input.clearInputContexts();
		// Remove the clients physics
		this.direction = new Vector3(0, 0, 0);
	}

	public isGasBoosting() {
		const isGasBoosting = UserInputService.IsKeyDown(Enum.KeyCode.Space)
		return isGasBoosting && !this.winches.isSlacking() && this.velocity !== undefined
	}

	public impulse(vector: Vector3, easing?: Number.Ease) {
		if (!this.velocity) return;

		if (easing) {
			if (this.lerp_easing) this.lerp_easing.Destroy();
			this.lerp_easing = easing;
		}

		this.velocity.Velocity = vector
	}

	// Updated is called every frame that a grapple is active
	public updated(grapples: BaseGearGrapples) {
		const dt = os.clock() - this.clocked;
		this.clocked = os.clock();

		if (States.isCategoryBusy(States.Types.MOUNTS)) return this.clean()

		// Get the gyro speed & power
		const VERTICAL_SPEED = this.statistics.getStatistic(GearStatisticType.VERTICAL_SPEED);
		const HORIZONTAL_SPEED = this.statistics.getStatistic(GearStatisticType.HORIZONTAL_SPEED);

		// Get the grapple speed for forward movement
		const GRAPPLE_SPEED = this.statistics.getStatistic(GearStatisticType.GRAPPLE_SPEED);

		// Get the speed multiplier
		const SPEED_MULTIPLIER = this.statistics.getStatistic(GearStatisticType.SPEED_MULTIPLIER);

		// Check if the player currently is slacking
		const isSlacking = this.winches.isSlacking()
		if (isSlacking) return this.clean()

		// Create the gyro if it doesn't exist
		if (!this.velocity) this.velocity = this.create()
		if (!this.velocity) return;

		const { character, humanoid, root } = this.getCharacterComponents();
		if (!character || !humanoid || !root) return;

		if (humanoid.Sit) return;

		// Check if the player is dashing
		if (States.States.get("dashing")) return;

		// Get the pivot center
		const center = grapples.getPivotCenter();
		if (!center) return;

		// Get the players mass
		const mass = Physics.GetTargetMass(root) || 1

		// Set the velocity parent
		if (!this.velocity.Parent) this.velocity.Parent = character.PrimaryPart;

		// Get the gas multiplier
		const gasMultiplierStat = this.statistics.getStatistic(GearStatisticType.GAS_MULTIPLIER)

		// Check if the player is gas boosting
		const isGasBoosting = this.isGasBoosting();
		const gasBoostMultiplier = isGasBoosting ? gasMultiplierStat : 1

		// Set the gyro speed & power
		this.velocity.P = ((HORIZONTAL_SPEED + VERTICAL_SPEED) * gasBoostMultiplier) * SPEED_MULTIPLIER;

		// Get the directional vector
		let directionVector = this.getDirectionalVector()
		if (isGasBoosting) directionVector = directionVector.mul(2);

		this.direction = directionVector //this.direction.Lerp(directionVector, 0.2);

		let __direction = this.ejectorDirection

		if (directionVector.X >= 1) this.ejectorDirection = GearEjectorDirection.RIGHT;
		else if (directionVector.X <= -1) this.ejectorDirection = GearEjectorDirection.LEFT;
		else this.ejectorDirection = GearEjectorDirection.FORWARD;

		if (__direction !== this.ejectorDirection) this.__onEjectorDirectionChanged.Fire(this.ejectorDirection)

		// Get the directional vector
		let directional = this.direction.add(new Vector3(0, 0, -GRAPPLE_SPEED)) // Add forward

		if (isGasBoosting && root.Position.Y < center.Y) directional = directional.add(new Vector3(0, 0.15, 0))
		else if (!isGasBoosting && root.Position.Y < center.Y) directional = directional.add(new Vector3(0, 0.1, 0))

		if (this.isBoosting !== isGasBoosting) {
			this.isBoosting = isGasBoosting;
			this.__onGasEjectorBoostChanged.Fire(this.isBoosting);
		}

		// Get the offset
		const offset = root.CFrame.mul(new CFrame(directional)).Position;

		// Set the velocity
		const direction = ((offset.sub(root.Position)).Unit)

		// Set the speed
		this.speed = ((HORIZONTAL_SPEED * gasBoostMultiplier) * SPEED_MULTIPLIER)
		this.velocity.Velocity = (direction.mul(this.speed)).mul(mass / 10)
	}

	// Initialization happens after all of the components have
	// been registered, and the statistics have been added
	public initialize(components: GearComponentsList, network: NetworkEntity) {
		// Get the grapples component
		const grapples = this.getComponent<BaseGearGrapples>(components, GearComponents.GRAPPLES)
		const handles = this.getComponent<BaseGearHandles>(components, GearComponents.HANDLES)
		const winches = this.getComponent<BaseGearWinches>(components, GearComponents.WINCHES)

		// Set the winches
		this.winches = winches

		// Add a middleware to the grapple
		handles.addGrappleMiddleware((isGrappling: boolean) => isGrappling ? this.updated(grapples) : this.clean())
	}
}