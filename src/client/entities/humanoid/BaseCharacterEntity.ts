import { NetworkBubble } from "client/network/ClientBubbles";
import { Entities } from "shared/EntitySignatures";
import { Listeners } from "shared/utilities/decorators/EntityListensFor";
import { BaseEntity } from "../BaseEntity";
import { CombatSharedSelectors } from "selectors/CombatSharedSelectors";
import { Memory } from "shared/utilities/memory.utilities";
import { ClientPlayerEntity } from "../player/ClientPlayerEntity";
import { Players, RunService, Workspace } from "@rbxts/services";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { HealthSharedSelectors } from "selectors/HealthSharedSelectors";
import { PlayerDeathScreen } from "client/interfaces/routes/death.route";

export const ClientStunnedSubscription : unique symbol = {} as never
export const ClientBlockingSubscription : unique symbol = {} as never
export const ClientCanBlockSubscription : unique symbol = {} as never
export const ClientIsDeadSubscription : unique symbol = {} as never

// Register the entity to listen for the EntityPopulation with
// signature of Client
@ Listeners.EntityReplicatedWith(Entities.Players.CHARACTER)
export class BaseCharacterEntity extends BaseEntity {
    private isStunned : Memory.Subscription<boolean> = Memory.subscription(ClientStunnedSubscription)
    private canBlock : Memory.Subscription<boolean> = Memory.subscription(ClientCanBlockSubscription)
    private isDead : Memory.Subscription<boolean> = Memory.subscription(ClientIsDeadSubscription)

    private isSeatedEvent = new Instance("BindableEvent");
    public Seated = this.isSeatedEvent.Event;

    /**
     * Constructor for the BaseCharacterEntity class.
     * 
     * It checks if the player owns the entity, creates the animator, and listens for the entity's animation state to change.
     * 
     * @param {NetworkBubble.RawEntityDataType} data - The raw entity data.
     * 
     * @author NodeSupport
     */
    constructor(data : NetworkBubble.RawEntityDataType) {
        super(data, () => {
            this.initialize()
        })

        // Get the player
        const player = Players.LocalPlayer;

        // Set the humanoid entity
        BaseEntity.resolveEntityFromInstance<ClientPlayerEntity>(player).then((client) => {
            if(client) client.setEntityCharacter(this);
        })

        this.getBufferListeners().subscribe(0, (buffer : buffer) => {
            const health = HealthSharedSelectors.getHealth(buffer)

            if(health === 0) this.isDead.set(true);
            else if(this.isDead.get()) this.isDead.set(false);
        })

        // Get the first stunned vlaue for the set.
        const isStunned = CombatSharedSelectors.getEntityStunned(this.getBufferFromIndex(2))
        const canBlock = CombatSharedSelectors.getEntityCanBlock(this.getBufferFromIndex(2))

        this.isStunned.set(isStunned)
        this.canBlock.set(canBlock)

        // Set the stunned value.
        this.getBufferListeners().subscribe(2, (buffer : buffer) => {
            this.isStunned.set(CombatSharedSelectors.getEntityStunned(buffer))
            this.canBlock.set(CombatSharedSelectors.getEntityCanBlock(buffer))
        })
    }

    /**
     * Returns a promise which resolves when the character has moved a certain distance
     * from the character's origin at the time of the function call.
     * 
     * @param goal_distance The distance the character should move.
     * @returns {Promise<RBXScriptSignal | void>}
     * 
     * @author NodeSupport
     */
    public getCharacterMoved(goal_distance : number) : Promise<RBXScriptSignal | void> {
        // Create a new promise
        const promise = new Promise<RBXScriptSignal | void>(async (resolve, reject) => {
            // Resolve the client entity
            const client = await BaseEntity.resolveClientEntity();

            // If the client entity is not resolved, exit the function
            if(!client) return reject("Client entity is not resolved");
            if(!client.getCharacterModel()) return reject("Client entity does not have a character model");

            // Create a new BindableEvent
            const event = new Instance("BindableEvent");

            // Disconnect the function
            const disconnect = (isReject : number) => {
                stepped.Disconnect()                        // Disconnect the RenderStepped event
                isReject === -1 ? reject() : resolve();     // Resolve or reject the promise

                event.Destroy()                             // Destroy the BindableEvent
            }

            // Get the characters origin
            const character = client.getCharacterModel() as Model;
            const origin = character.PrimaryPart?.Position as Vector3;

            // If the character does not have a primary part, reject the promise
            if(!origin) return reject("Character does not have a primary part");

            // Create a new RenderStepped event
            const stepped = RunService.RenderStepped.Connect(() => {
                // If the promise is not started, disconnect the function
                if(promise.getStatus() !== "Started") return disconnect(1)

                // Get the characters root part
                const character = client.getCharacterModel() as Model | undefined
                const root = character?.PrimaryPart as Part | undefined

                // If the character does not have a root part, disconnect the function
                if(!root) return disconnect(-1)

                // Get the distance between the character's root part and the origin
                const distance = (root.Position.sub(origin)).Magnitude
                if(distance < goal_distance) return;

                // If the character has moved the goal distance,
                disconnect(1)
            })

            // Connect the event to the promise
            return event.Event
        })
        
        return promise
    }

    /**
     * This function initializes the entity.
     * 
     * It prints a message to the console and animates the entity.
     * 
     * @author NodeSupport
     */
    private async initialize() {
        // Resolve the client entity
        const client = await BaseEntity.resolveClientEntity();
        // If the client entity is not resolved, exit the function
        if(!client) return;

        Memory.subscribe(ClientIsDeadSubscription, (isDead : boolean) => {
            isDead ? PlayerDeathScreen.show() : PlayerDeathScreen.hide()
        })

        const humanoid = client.getCharacterModel()?.WaitForChild("Humanoid") as Humanoid
        humanoid.Seated.Connect((isSeated : boolean, seat : Seat | VehicleSeat | undefined) => {
            this.isSeatedEvent.Fire(isSeated, seat)
        })

        
        // Track the entities character parent.
        client.getCharacterModel()?.GetPropertyChangedSignal("Parent").Connect(() => {
            const parent = client.getCharacterModel()?.Parent
            const ragdoll = Workspace.FindFirstChild(client.getCharacterModel()?.Name + "_ragdoll")
            
            if(!parent && ragdoll) {
                Workspace.CurrentCamera!.CameraSubject = ragdoll.FindFirstChildWhichIsA("Humanoid")!
            } else if (parent) {
                Workspace.CurrentCamera!.CameraSubject = client.getCharacterModel()!.FindFirstChildWhichIsA("Humanoid")!
            }
        })

        // Subscribe to the ClientStunnedSubscription
        Memory.subscribe(ClientStunnedSubscription, (isStunned : boolean) => {
            // Get the humanoid of the client entity
            const humanoid = client.getEntityHumanoid();

            // Get the statistics of the humanoid
            const statistics = humanoid?.getStatistics();

            // If the statistics are not available, exit the function
            if(!statistics) return;

            // Get the 'walkspeed' statistic
            const stunned = statistics.get("walkspeed");

            // If the client is stunned, adjust the 'walkspeed' statistic
            if(isStunned) stunned?.adjust("stunned", 5, {Mode: StatisticModes.SET, Priority: 25})
            // If the client is not stunned, delete the 'stunned' statistic
            else stunned?.deleteStatistic("stunned", {Mode: StatisticModes.SET, Priority: 25})
        })
    }
}