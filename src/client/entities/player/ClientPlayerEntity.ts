import { NetworkBubble } from "client/network/ClientBubbles";
import { Entities } from "shared/EntitySignatures";
import { Listeners } from "shared/utilities/decorators/EntityListensFor";
import { BaseEntity } from "../BaseEntity";
import { UtilitySharedSelectors } from "selectors/UtilitySharedSelectors";
import { Players } from "@rbxts/services";
import { BaseHumanoidEntity } from "../humanoid/BaseHumanoidEntity";
import { BaseCharacterEntity } from "../humanoid/BaseCharacterEntity";
import { ClientMovementController } from "./movement/BaseClientMovement";
import { EnchantmentSharedSelectors } from "selectors/EnchantmentSharedSelectors";
import { Memory } from "shared/utilities/memory.utilities";
import { Enchantment } from "shared/types/EnchantmentTypes";
import { Bloodline } from "shared/types/Bloodline";
import { BloodlineSharedSelectors } from "selectors/BloodlineSharedSelectors";
import { Permission } from "shared/utilities/decorators/CommandDecorators";
import { CommandSharedSelectors } from "selectors/PermissionSharedSelectors";
import { Animals } from "shared/Animals";
import { HorseSharedSelectors } from "selectors/HorseSharedSelectors";
import ClientHorseService from "./services/ClientHorseService";
import ClientKeybindService from "./services/ClientKeybindService";
import { Keybinds } from "shared/Keybindings";
import { KeybindSharedSelectors } from "selectors/KeybindSharedSelectors";
import { TreasurySharedSelectors } from "selectors/TreasurySharedSelectors";
import { Treasury } from "shared/types/Treasury";
import { BranchData, BranchSharedSelectors } from "selectors/BranchSharedSelectors";
import { BranchMemberData, BranchMemberSelectors } from "selectors/BranchMemberSelector";
import { LocationInformation, LocationSharedSelectors } from "selectors/LocationSharedSelectors";
import { Plots } from "shared/Plots";
import { PlotSharedSelectors } from "selectors/PlotSharedSelectors";
import ClientPlotService from "./services/Plot/ClientPlotService";
import { UtilityArraySharedSelectors } from "selectors/UtilityArraySharedSelectors";

export const ClientMovementConstructor = new ClientMovementController();
export const ClientEnchantmentSubscription : unique symbol = {} as never
export const ClientTreasurySubscription : unique symbol = {} as never
export const ClientBloodlineSubscription : unique symbol = {} as never
export const ClientHorseSubscription : unique symbol = {} as never
export const ClientKeybindSubscription : unique symbol = {} as never
export const ClientBranchSubscription : unique symbol = {} as never
export const ClientBranchMemberSubscription : unique symbol = {} as never
export const ClientLocationSubscription : unique symbol = {} as never
export const ClientPlotSubscription : unique symbol = {} as never
export const ClientBlueprintsSubscription : unique symbol = {} as never

export const KeybindSubscription : Memory.Subscription<Keybinds.Map> = Memory.subscription(ClientKeybindSubscription)
export const HorseSubscription : Memory.Subscription<Animals.Horse[]> = Memory.subscription(ClientHorseSubscription)
export const EnchantmentSubscription : Memory.Subscription<Enchantment.Type[]> = Memory.subscription(ClientEnchantmentSubscription)
export const BloodlineSubscription : Memory.Subscription<Bloodline.Bloodline> = Memory.subscription(ClientBloodlineSubscription)
export const TreasurySubscription : Memory.Subscription<Treasury.Treasury[]> = Memory.subscription(ClientTreasurySubscription)
export const BranchSubscription : Memory.Subscription<BranchData[]> = Memory.subscription(ClientBranchSubscription)
export const BranchMemberSubscription : Memory.Subscription<BranchMemberData> = Memory.subscription(ClientBranchMemberSubscription)
export const LocationSubscription : Memory.Subscription<LocationInformation> = Memory.subscription(ClientLocationSubscription)
export const PlotsSubscription : Memory.Subscription<{id : number, owner : number}> = Memory.subscription(ClientPlotSubscription)
export const BlueprintsSubscription : Memory.Subscription<number[]> = Memory.subscription(ClientBlueprintsSubscription)


// Register the entity to listen for the EntityPopulation with
// signature of Client
@ Listeners.EntityReplicatedWith(Entities.Players.CLIENT)
export class ClientPlayerEntity extends BaseEntity {
    // Immutable properties of the client entity
    private readonly immutable: { username: string; userId: number };
    private permission: Permission;

    private humanoid! : BaseHumanoidEntity;
    private character! : BaseCharacterEntity;

    // Services for the player entity
    private keybinds : ClientKeybindService;
    private horses : ClientHorseService;
    private plots : ClientPlotService;

    private onCharacterResolved : (value: BaseCharacterEntity | Promise<BaseCharacterEntity>) => void = () => {}
    public onCharacterCreated : Promise<BaseCharacterEntity> = new Promise((resolve) => {
        this.onCharacterResolved = resolve;
    })

    constructor(data : NetworkBubble.RawEntityDataType) {
        super(data, () => this.initialize())

        // Get the username and userId from the buffer
        // These are immutable and will not change.
        const username  = UtilitySharedSelectors.getString(this.getBufferFromIndex(0))
        const userId    = UtilitySharedSelectors.getNumber(this.getBufferFromIndex(1))

        // Get the enchantments from the buffer
        const enchantments = EnchantmentSharedSelectors.getEnchantments(this.getBufferFromIndex(3))
        EnchantmentSubscription.set(enchantments)

        // Set the permission level of the player
        this.permission = CommandSharedSelectors.getPermissionLevel(this.getBufferFromIndex(4))

        // Update the subscription listener for enchantments
        this.getBufferListeners().subscribe(3, (buffer : buffer) => {
            EnchantmentSubscription.set(EnchantmentSharedSelectors.getEnchantments(buffer))
        })

        // Create the services.
        this.keybinds = new ClientKeybindService(this);
        this.horses = new ClientHorseService(this);
        this.plots = new ClientPlotService(this);

        // Await the buffer creation and create the subscriptions
        this.awaitBufferCreation(5).then(() => this.createBufferSynchronizers(5, KeybindSharedSelectors.getKeybinds, KeybindSubscription).hook((map) => {
            this.keybinds.update(map)
        }))

        this.awaitBufferCreation(6).then(() => this.createBufferSynchronizers(6, HorseSharedSelectors.getHorses, HorseSubscription))
        this.awaitBufferCreation(7).then(() => this.createBufferSynchronizers(7, TreasurySharedSelectors.getTreasuries, TreasurySubscription))
        this.awaitBufferCreation(8).then(() => this.createBufferSynchronizers(8, BranchSharedSelectors.getBranches, BranchSubscription))
        this.awaitBufferCreation(9).then(() => this.createBufferSynchronizers(9, BranchMemberSelectors.getMember, BranchMemberSubscription))
        this.awaitBufferCreation(10).then(() => this.createBufferSynchronizers(10, LocationSharedSelectors.getLocations, LocationSubscription))
        this.awaitBufferCreation(11).then(() => this.createBufferSynchronizers(11, PlotSharedSelectors.getPlots, PlotsSubscription))
        this.awaitBufferCreation(12).then(() => this.createBufferSynchronizers(12, UtilityArraySharedSelectors.getArray, BlueprintsSubscription))

        // Create a map of the components
        // and initialize the entity
        this.immutable = this.createImmutableMap({ username, userId });
    }

    /**
     * Returns the keybind service of the client
     * 
     * @returns { ClientKeybindService } The keybind service of the player.
     * 
     * @author NodeSupport
     */
    public getKeybindService() : ClientKeybindService {
        return this.keybinds
    }

    public getPlotService() : ClientPlotService {
        return this.plots
    }

    /**
     * This function gets the horse service of the player.
     * 
     * @returns { ClientHorseService } The horse service of the player.
     * 
     * @author NodeSupport
     */
    public getHorseService() : ClientHorseService {
        return this.horses
    }

    /**
     * This function gets the permission level of the player.
     * 
     * @returns {Permission} The permission level of the player.
     * 
     * @author NodeSupport
     */
    public getPermissionLevel() : Permission {
        // Return the permission level of the player
        return this.permission;
    }

    /**
     * This function sets the character entity of the player.
     * 
     * @param {BaseCharacterEntity} character - The character entity to set.
     * 
     * @author NodeSupport
     */
    public setEntityCharacter(character : BaseCharacterEntity) {
        // Set the character entity of the player
        this.character = character;

        // Resolve the character entity
        this.onCharacterResolved(character)
    }

    /**
     * This function gets the character entity of the player.
     * 
     * @returns {BaseCharacterEntity} The character entity of the player.
     * 
     * @author NodeSupport
     */
    public getEntityCharacter() {
        // Return the character entity of the player
        return this.character;
    }

    /**
     * This function sets the humanoid entity of the player.
     * 
     * @param {BaseHumanoidEntity} humanoid - The humanoid entity to set.
     * 
     * @author NodeSupport
     */
    public setEntityHumanoid(humanoid : BaseHumanoidEntity) {
        // Set the humanoid entity of the player
        this.humanoid = humanoid;
    }

    /**
     * This function gets the humanoid entity of the player.
     * 
     * @returns {BaseHumanoidEntity} The humanoid entity of the player.
     * 
     * @author NodeSupport
     */
    public getEntityHumanoid() {
        // Return the humanoid entity of the player
        return this.humanoid;
    }

    /**
     * This function gets the character model of the player.
     * 
     * @returns {Model | undefined} The character model of the player, or undefined if the player is not found.
     * 
     * @author NodeSupport
     */
    public getCharacterModel() {
        // Return the character model of the player
        return Players.LocalPlayer.Character
    }

    /**
     * This function initializes the player entity.
     * 
     * @author NodeSupport
     */
    private initialize() {
        // Ignite all of the clients movements
        ClientMovementController.ignite();

        // Initialize the horse listeners
        this.horses.initialize();

        // Initialize the plot listeners
        this.plots.initialize();
    }
}