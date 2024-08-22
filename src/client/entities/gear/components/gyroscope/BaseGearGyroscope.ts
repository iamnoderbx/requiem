import { States } from "client/entities/player/ClientPlayerStates";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics, GearStatisticType } from "../../classes/ClientGearStatistics";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import BaseGearHandles from "../handles/BaseGearHandles";
import { ClientGearTinkers } from "../../classes/ClientGearTinkers";

export default class BaseGearGyroscope extends ClientGearComponent {
    private gyro : BodyGyro | undefined;

    constructor(statistics : ClientGearStatistics, tinkers : ClientGearTinkers) {
        // Call the super constructor
        super(statistics, tinkers);
    
        // Add a gyroscope speed of 10
        this.statistics.addStatistic(GearStatisticType.GYRO_SPEED, 350);     // Default Speed (350)
        this.statistics.addStatistic(GearStatisticType.GYRO_POWER, 10000);  // Default Power (10000)

        // Modify the weight of the Gyroscope
        this.statistics.addStatistic(GearStatisticType.WEIGHT, 5);
    };

    private create() {
        // Create a new body gyro
        this.gyro = new Instance("BodyGyro")
        this.gyro.MaxTorque = new Vector3(math.huge, math.huge, math.huge);

        // Return the gyro
        return this.gyro;
    }

    private clean() {
        // Destroy the gyro
        if(this.gyro) this.gyro.Destroy();
        this.gyro = undefined;

        // Get the client character
        const { character, humanoid, root } = this.getCharacterComponents();
        if(!character || !humanoid || !root) return;
        
        // Reset the auto rotate
        if(!humanoid.AutoRotate) humanoid.AutoRotate = true;
        if(humanoid.PlatformStand) humanoid.PlatformStand = false;
    }
    
    // Updated is called every frame that a grapple is active
    public updated(grapples : BaseGearGrapples) {
        if(States.isCategoryBusy(States.Types.MOUNTS)) return this.clean();

        // Get the gyro speed & power
        const gyroSpeed = this.statistics.getStatistic(GearStatisticType.GYRO_SPEED);
        const gyroPower = this.statistics.getStatistic(GearStatisticType.GYRO_POWER);

        // Create the gyro if it doesn't exist
        if(!this.gyro) this.gyro = this.create();

        // Set the gyro speed & power
        this.gyro.D = gyroSpeed;
        this.gyro.P = gyroPower;

        // Get the client character
        const { character, humanoid, root } = this.getCharacterComponents();
        if(!character || !humanoid || !root) return;

        // Get the pivot center
        const center = grapples.getPivotCenter();
        if(!center) return;

        // Reset the auto rotate
        if(humanoid.AutoRotate) humanoid.AutoRotate = false;
        if(!humanoid.PlatformStand) humanoid.PlatformStand = true;

        if(!this.gyro.Parent) this.gyro.Parent = character.PrimaryPart;

        // Set the gyro cframe
        this.gyro.CFrame = new CFrame(character.PrimaryPart!.Position, center);
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList) {
        const grapples = this.getComponent<BaseGearGrapples>(components, GearComponents.GRAPPLES)
        const handles = this.getComponent<BaseGearHandles>(components, GearComponents.HANDLES)

        handles.addGrappleMiddleware((isGrappling : boolean) => isGrappling ? this.updated(grapples) : this.clean())
    }
}