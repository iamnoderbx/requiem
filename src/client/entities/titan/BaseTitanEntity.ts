import { NetworkBubble } from "client/network/ClientBubbles";
import { Entities } from "shared/EntitySignatures";
import { Listeners } from "shared/utilities/decorators/EntityListensFor";
import { BaseEntity } from "../BaseEntity";
import { MovementSharedSelectors } from "selectors/MovementSharedSelectors";
import { BaseHumanoidEntity } from "../humanoid/BaseHumanoidEntity";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { TitanActions } from "shared/utilities/network/Events";
import { BaseTitanAbility } from "./classes/BaseTitanAbility";
import { ClientBlindAbility } from "./default/ClientBlindAbility";
import { Players } from "@rbxts/services";
import { UtilitySharedSelectors } from "selectors/UtilitySharedSelectors";
import { ClientTitanBrain } from "./classes/BaseTitanBrain";
import { ClientNapeAbility } from "./default/ClientNapeAbility";

// Register the entity to listen for the EntityPopulation with
// signature of Client
@ Listeners.EntityReplicatedWith(Entities.Entities.BASE_TITAN)
export class BaseTitanEntity extends BaseEntity {
    private brain : number
    private sprinting : boolean = false;

    private abilities : BaseTitanAbility[] = [
        new ClientBlindAbility(this),
        new ClientNapeAbility(this),
    ]

    /**
     * Constructor for the BaseTitanEntity class.
     * 
     * @param {NetworkBubble.RawEntityDataType} data - The raw entity data.
     * 
     * @author NodeSupport
     */
    constructor(data : NetworkBubble.RawEntityDataType) {
        super(data, () => this.initialize())

        // Create a new brain for the titan
        ClientTitanBrain.create(data.id);
        this.brain = data.id;

        const ownership = this.getBufferFromIndex(0)
        const userid = UtilitySharedSelectors.getNumber(ownership);

        this.getBufferListeners().subscribe(1, async (reader) => {
            this.movement(reader)
        })

        this.network.listen(TitanActions.ABILITY, (args : unknown[]) => {
            const index = args[0] as number
            const ability = this.abilities[index]

            ability.onAbilityExecution()
        })

        // Listen for the network event
        this.network.listen(TitanActions.NETWORK, (args : unknown[]) => {
            const user = args[0] as number
            if(user !== Players.LocalPlayer.UserId) return

            this.onNetworkOwnershipRecieved()
        })

        // If the user id is the same as the local player id, call the onNetworkOwnershipRecieved function
        if(userid === Players.LocalPlayer.UserId) this.onNetworkOwnershipRecieved()
    }

    public isNetworkOwner() {
        const ownership = this.getBufferFromIndex(0)
        const userid = UtilitySharedSelectors.getNumber(ownership)
        
        return userid === Players.LocalPlayer.UserId
    }

    private async onNetworkOwnershipRecieved() {
        const titan_humanoid = await this.getHumanoid()
        const titan_root = await titan_humanoid.getEntityHumanoidRootPart()

        const client = await BaseEntity.resolveClientEntity();

        const target = client.getEntityHumanoid();
        const root = await target.getEntityHumanoidRootPart()
        
        const statistics = titan_humanoid.getStatistics()

        ClientTitanBrain.connect(this.brain, async () => {
            const humanoid = await titan_humanoid.getEntityHumanoidInstance()
            root && humanoid?.MoveTo(root.Position)

            const titanRoot = await titan_humanoid.getEntityHumanoidRootPart()
            const gyro = titanRoot?.FindFirstChild("BodyGyro") as BodyGyro

            if(gyro && root && titanRoot) {
                gyro.CFrame = new CFrame(titanRoot.Position, root.Position)
            }

            const distance = root && titan_root && (root.Position.sub(titan_root.Position)).Magnitude
            if(!distance) return
            
            const isInSprintRange = distance < 350
            if(isInSprintRange && !this.sprinting) {
                this.sprinting = true
                statistics?.get("walkspeed")?.adjust("run", 4, {Priority: 3, Mode: StatisticModes.MULT, Tween: new TweenInfo(1)})
            } else if (!isInSprintRange && this.sprinting) {
                this.sprinting = false
                statistics?.get("walkspeed")?.deleteStatistic("run", {Priority: 3, Mode: StatisticModes.MULT, Tween: new TweenInfo(0.5)})
            }
        })
    }

    public async getHumanoid() {
        const reader = this.getBufferFromIndex(1)

        const id = MovementSharedSelectors.getEntityHumanoid(reader)
        const humanoid = await BaseEntity.getEntityFromIdentifier<BaseHumanoidEntity>(id)
        return humanoid
    }

    private async movement(reader : buffer, priority : number = 2) {
        const walkspeed = MovementSharedSelectors.getEntityWalkspeed(reader)
        const id = MovementSharedSelectors.getEntityHumanoid(reader)

        const humanoid = await BaseEntity.getEntityFromIdentifier<BaseHumanoidEntity>(id)
        const statistics = humanoid.getStatistics()
        if(!humanoid || !statistics) return

        humanoid.getEntityAnimator()?.setWalkspeed(walkspeed + 4)
        statistics.get("walkspeed")?.adjust("set", walkspeed, {Priority: priority, Mode: StatisticModes.SET})
    }

    /**
     * This function initializes the entity.
     * 
     * It prints a message to the console and animates the entity.
     * 
     * @author NodeSupport
     */
    private async initialize() {
        print("Initialized BaseTitanEntity")
    }
}