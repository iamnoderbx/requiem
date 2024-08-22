import { ComponentWrapper } from "server/components/ComponentDataWrapper"
import { BaseEntity, InitializationStatus } from "../BaseEntity"
import { CollectionService, Players } from "@rbxts/services"
import { EntityIsLocalized, EntityListensFor } from "shared/utilities/decorators/EntityListensFor"
import CharacterEntity, { BaseCharacterEntity, EquipmentAction } from "./BaseCharacterEntity"
import { Entities } from "shared/EntitySignatures"
import { UtilityStringComponent } from "server/components/Utilities/UtilityStringComponent"
import { UtilityNumberComponent } from "server/components/Utilities/UtilityNumberCompontent"
import { BasePlayerData } from "./BasePlayerData"
import { EntityPlayerPublicComponent } from "server/components/Entity/EntityPlayerPublicComponent"
import { NetworkBubble } from "server/network/NetworkBubble"
import { Teams } from "shared/types/Teams"
import { EntityEnchantmentsComponent } from "server/components/Enchantments/EntityEnchantmentsComponent"
import { Controller, __igniteControllers, getController } from "shared/utilities/decorators/ServiceControllers"
import { EnchantmentUtilities } from "shared/Enchantments"
import AdminServiceRunner from "server/services/administration/AdminServiceRunner"
import { EntityPermissionComponent } from "server/components/Commands/CommandPlayerLevelComponent"
import { PlayerActions } from "shared/utilities/network/Events"
import { EntityHorseComponent } from "server/components/Entity/EntityHorseComponent"
import PlayerHorseService from "./services/PlayerHorseService"
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"
import { Keybinds } from "shared/Keybindings"
import { EntityKeybindsComponent } from "server/components/Entity/EntityKeybindsComponent"
import PlayerStableService from "./services/PlayerStableService"
import PlayerBloodlineService from "./services/groups/PlayerBloodlineService"
import PlayerTreasuryService from "./services/treasuries/PlayerTreasuryService"
import PlayerBranchService from "./services/groups/PlayerBranchService"
import PlayerReputationService from "./services/reputation/PlayerReputationsService"
import PlayerPlotService from "./services/plots/PlayerPlotService"
import PlayerStoreService from "./services/stores/PlayerStoreService"
// Create a globalized container for the public
// player information, will be used to display players on the leaderboard.
const leaderboard = new NetworkBubble.Container<EntityPlayerPublicComponent.Component>()
    .setReplicationType(NetworkBubble.ReplicationType.PUBLIC)
    .setReplicationIdentifier("leaderboard")
    

// This is a client entity, it listens for the PlayerAdded event
// and is localized to the client- only replicate to the instance passed
@EntityListensFor(Players.PlayerAdded)
@EntityIsLocalized(Entities.Players.CLIENT)
export class BasePlayerEntity extends BaseEntity {
    // Character entity associated with this player entity
    private character!: BaseCharacterEntity

    // The player data associated with this player entity
    private data: BasePlayerData

    // The player server services.
    private horses : PlayerHorseService
    private stable : PlayerStableService
    private bloodline : PlayerBloodlineService
    private treasuries : PlayerTreasuryService
    private branch : PlayerBranchService
    private reputations : PlayerReputationService
    private plots : PlayerPlotService
    private stores : PlayerStoreService

    /**
     * Constructs a new BasePlayerEntity. Injects the player instance into the constructor from
     * the PlayerAdded event. Initializes the player with a name and id component.
     * 
     * @param instance - The player instance, note this is injected from the event
     * 
     * @author NodeSupport
     */
    constructor(private instance: Player) {
        // Create a new utility string component for the player name
        const name = new UtilityStringComponent.Component({
            value: instance.Name
        })

        // Create a new utility number component for the player id
        const id = new UtilityNumberComponent.Component({
            value: instance.UserId
        })

        // Update the players permission level.
        const admin = getController(AdminServiceRunner)

        // Create a new exposed component for the player
        const exposed = new EntityPlayerPublicComponent.Component({
            team: Teams.SCOUTING_LEGION, userid: instance.UserId, permissions: admin.getPermissionLevel(instance),
        })

        // Add the exposed component to the container
        leaderboard.add(exposed)

        // Add the administrator permission component to the player
        const permissions = new EntityPermissionComponent.Component(admin.getPermissionLevel(instance));

        // Create a new enchantment component for the player
        const enchantments = new EntityEnchantmentsComponent.Component([
            EnchantmentUtilities.getEnchantmentFromName("Adamant")!,
            EnchantmentUtilities.getEnchantmentFromName("Adrenaline")!,
            EnchantmentUtilities.getEnchantmentFromName("Bottomless Pit")!,
            EnchantmentUtilities.getEnchantmentFromName("Consumer")!,
            EnchantmentUtilities.getEnchantmentFromName("Finesse")!,
            EnchantmentUtilities.getEnchantmentFromName("Heartseeker")!,
        ])

        // Call the super constructor with the health component and a callback
        super(Entities.Players.CLIENT, new ComponentWrapper.Entity([name, id, exposed, enchantments, permissions]),
            (promise) => promise.then(() => this.initialize()))

        // Create the player services
        this.horses = new PlayerHorseService(this)
        this.stable = new PlayerStableService(this)
        this.bloodline = new PlayerBloodlineService(this);
        this.treasuries = new PlayerTreasuryService(this);
        this.branch = new PlayerBranchService(this);
        this.reputations = new PlayerReputationService(this);
        this.plots = new PlayerPlotService(this);
        this.stores = new PlayerStoreService(this);

        // The initialization will occur during the next cycle, create the
        // player data object prior to that.
        this.data = new BasePlayerData(instance.UserId)
        this.data.ignite().catch(() => instance.Kick("Failed to ignite player data"))
    }
    
    /**
     * Notifies the player with a message.
     * 
     * @param message The message to send
     * @param isError Is the message an error
     * 
     * @returns void
     * 
     * @author NodeSupport
     */
    private notify(message : string, isError : boolean, isInfo: boolean) {
        const admin = getController(AdminServiceRunner)

        const wrapper = BufferWrapper()
        const buffer = wrapper.serialize([message, isError, isInfo])

        admin.getNotifier().send(this.instance, buffer)
    }

    /**
     * Sends a success message to the player.
     * 
     * @param message The message to send
     * 
     * @author NodeSupport
     */
    public info(message: string) {
        this.notify(message, false, true)
    }

    /**
     * Sends a success message to the player.
     * 
     * @param message The message to send
     * 
     * @author NodeSupport
     */
    public success(message: string) {
        this.notify(message, false, false)
    }

    /**
     * Sends a error message to the player.
     * 
     * @param message The message to send
     * 
     * @author NodeSupport
     */
    public error(message: string) {
        this.notify(message, true, false)
    }

    public getBranchService() {
        return this.branch
    }

    public getTreasuryService() {
        return this.treasuries
    }

    public getHorseService() {
        return this.horses
    }

    public getReputationService() {
        return this.reputations
    }

    public getPlotService() {
        return this.plots
    }

    public getStoreService() {
        return this.stores
    }

    /**
     * Gets the player instance associated with this player entity.
     * 
     * @returns The player instance associated with this player entity.
     * 
     * @author NodeSupport
     */
    public getInstance() {
        return this.instance
    }

    /**
     * Gets the players username.
     * 
     * @returns The players username.
     * 
     * @author NodeSupport
     */
    public getName() {
        return this.instance.Name
    }

    /**
     * Gets the id associated with this player entity.
     * 
     * @returns The user id associated with this player entity.
     * 
     * @author NodeSupport
     */
    public getUserId() {
        return this.instance.UserId
    }

    /**
     * Gets the player data associated with this player entity.
     * 
     * @returns The player data associated with this player entity
     * 
     * @author NodeSupport
    */
    public getData() {
        return this.data
    }

    /**
     * Initializes the player entity, adds the character model to the entity, 
     * and sets the entity pointer.
     * 
     * @author NodeSupport
     */
    public async initialize() {
        // Initialize the players bloodline states
        this.data.promise && this.data.promise.then(async () => {
            // Get the players keybind data
            const keybinds = Keybinds.Deserialize(this.data.getData()!.keybinds);
            const keybindComponent = new EntityKeybindsComponent.Component(keybinds);

            // Add the keybind component to the player entity index 4
            this.addComponent(keybindComponent)

            // Get the players horse data
            const horses = this.data.getData()!.horses;
            const component = new EntityHorseComponent.Component(horses);

            // Add the horse component to the player entity index 5
            this.addComponent(component)

            // Initialize the horse service
            this.horses.initialize(component);
            this.stable.initialize();

            // Initialize the treasury service
            await this.treasuries.initialize();
            await this.branch.initialize();
            await this.reputations.initialize();
            await this.plots.initialize();

            this.stores.initialize();
        })

        this.onEntityDestroyed(() => this.data.getProfile()?.Release())

        this.network.listen(PlayerActions.Respawn, () => {
            this.getCharacter().respawn();
        })

        // Initialize the character models.
        this.instance.CharacterAdded.Connect(async (character: Model) => {
            this.character = new CharacterEntity(character)

            // Ensure the players data does exist, if not wait for it to ignite
            if (!this.data.isIgnited()) await this.data.promise;

            // Wait for the character to initialize
            if (this.character.status === InitializationStatus.UNINITIALIZED)
                return this.character.isInitialized.then(() => {
                    this.character.equipment(EquipmentAction.ADD, this.data.getData()!)
                })

            // Add the players equipment (based on data)
            this.character.equipment(EquipmentAction.ADD, this.data.getData()!)
        })

        // This is an instance therefor add attributes
        this.instance.SetAttribute("id", this.network.getEntityPointer())
        CollectionService.AddTag(this.instance, "entity")
    }

    /**
     * Gets the character associated with this player entity.
     * 
     * @returns The character associated with this player entity.
     * 
     * @author NodeSupport
     */
    public getCharacter(): BaseCharacterEntity {
        return this.character
    }
}

/**
 * A basic controller to handle player disconnecting & entity cleanup.
 */

@Controller()
export class EntityPlayerController {
    public initialize() {
        Players.PlayerRemoving.Connect((player) => {
            const entity = BaseEntity.resolveEntityFromInstance(player)
            entity?.destroy()
        })
    }
}