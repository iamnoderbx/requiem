import { NetworkBubble } from "client/network/ClientBubbles";
import { Entities } from "shared/EntitySignatures";
import { Listeners } from "shared/utilities/decorators/EntityListensFor";
import { BaseEntity } from "../BaseEntity";
import { UtilitySharedSelectors } from "selectors/UtilitySharedSelectors";
import { Players, RunService, TweenService, Workspace } from "@rbxts/services";
import animations, { Animations } from "shared/animations/animations";

import { ClientPlayerEntity } from "../player/ClientPlayerEntity";
import { AnimateableCharacter } from "shared/utilities/animations.utilities";
import { BaseEntityAnimator } from "./BaseEntityAnimator";
import { BaseStatistic, Statistics } from "shared/statistics";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { ClientMovementController } from "../player/movement/BaseClientMovement";
// Register the entity to listen for the EntityPopulation with
// signature of Client
@ Listeners.EntityReplicatedWith(Entities.Entities.HUMANOID)
export class BaseHumanoidEntity extends BaseEntity {
    private animator : BaseEntityAnimator | undefined;
    private isNetworkOwner : boolean = false;

    // Create the statistics for the humanoid entity
    private statistics : Statistics<Map<string, BaseStatistic>> | undefined;

    // Is the entity in the flash step state.
    private isNPC : boolean = false;

    /**
     * Constructor for the BaseClientHumanoidEntity class.
     * 
     * It checks if the player owns the entity, creates the animator, and listens for the entity's animation state to change.
     * 
     * @param {NetworkBubble.RawEntityDataType} data - The raw entity data.
     * 
     * @author NodeSupport
     */
    constructor(data : NetworkBubble.RawEntityDataType) {
        super(data, () => this.initialize())

        // Check if the player owns the entity
        const ownership = UtilitySharedSelectors.getNumber(this.getBufferFromIndex(0))
        if(ownership !== Players.LocalPlayer.UserId && ownership !== 0) return;

        this.isNPC = ownership === 0;

        // Set the network owner
        this.isNetworkOwner = true;

        // Create the statistics
        this.statistics = new Statistics();

        // Get the player
        const player = Players.LocalPlayer;
        
        // Set the humanoid entity
        !this.isNPC && BaseEntity.resolveEntityFromInstance<ClientPlayerEntity>(player).then((client) => {
            if(client) client.setEntityHumanoid(this);
        })
    
        // Create the animator
        this.animator = new BaseEntityAnimator();

        // Listen for the entities animation state to change
        this.getBufferListeners().subscribe(1, (buffer) => {
            const animation = UtilitySharedSelectors.getNumber(buffer)
            this.animate(0, animations[animation as Animations]);
        });
    }

    /**
     * This function gets the statistics of the humanoid entity.
     * 
     * @returns {Statistics<Map<string, BaseStatistic>> | undefined} The statistics of the humanoid entity, or undefined if they are not set.
     * 
     * @author NodeSupport
     */
    public getStatistics() : Statistics<Map<string, BaseStatistic>> | undefined {
        // Return the statistics of the humanoid entity
        return this.statistics;
    }

    /**
     * This function gets the humanoid instance of the entity.
     * 
     * @returns {Humanoid | undefined} The humanoid instance of the entity, or undefined if the entity instance is not found.
     * 
     * @author NodeSupport
     */
    public async getEntityHumanoidInstance() {
        // Resolve the entity instance
        const model = await BaseEntity.awaitResolveEntityInstance<Model>(this);
        // If the entity instance is not found, return undefined
        if(!model) return;

        // Return the humanoid instance of the entity
        return model.WaitForChild("Humanoid") as Humanoid;
    }

    /**
     * This function gets the humanoid root part of the entity.
     * 
     * @returns {BasePart | undefined} The humanoid root part of the entity, or undefined if the entity instance is not found.
     * 
     * @author NodeSupport
     */
    public async getEntityHumanoidRootPart(): Promise<BasePart | undefined> {
        // Resolve the entity instance
        const model = await BaseEntity.awaitResolveEntityInstance<Model>(this);
        // If the entity instance is not found, return undefined
        if(!model) return;

        // Return the humanoid root part of the entity
        return model.WaitForChild("HumanoidRootPart") as BasePart;
    }

    /**
     * This function gets the animator of the humanoid entity.
     * 
     * @returns {BaseEntityAnimator  | undefined} The animator of the humanoid entity, or undefined if it is not set.
     * 
     * @author NodeSupport
     */
    public getEntityAnimator(): BaseEntityAnimator  | undefined {
        // Return the animator of the humanoid entity
        return this.animator;
    }

    /**
     * This function animates the entity.
     * 
     * It gets the client and character, checks if the animator is available, binds the animator to the character,
     * sets the animation package, and ignites the animator.
     * 
     * @param {Animations} animations - The animations to be used.
     * 
     * @throws Will throw an error if the client, character, or animator are not found.
     * 
     * @author NodeSupport
     */
    private async animate(def : Animations, priority?: Partial<typeof animations[Animations.DEFAULT]>) {
        if(!this.isNetworkOwner) return;
        
        const player = Players.LocalPlayer;
        const client = await BaseEntity.resolveEntityFromInstance<ClientPlayerEntity>(player);
    
        // Check if the client is available
        if(!client) throw "Client not found";

        // Get the character
        const character = await BaseEntity.awaitResolveEntityInstance<Model>(this);
        if(!character) throw "Character not found";

        // Check if the animator is available
        if(!this.animator) throw "Animator not found"

        // Bind the animator to the character
        this.animator.set(character as AnimateableCharacter).then(() => {
            if(!this.animator) throw("Animator not found")

            // Set the animation package
            this.animator.setAnimationPackage({default: def, priority : priority || {}});
            this.animator.ignite();
        }).catch((e) => warn(e))
    }

    /**
     * This function creates statistics for the humanoid entity.
     * 
     * It checks if the statistics are set, creates the walkspeed statistic, connects the functionalities of the statistic,
     * and adjusts the statistic to the default value.
     * 
     * @returns {Promise<void>} A promise that resolves when the statistics are created and adjusted, or rejects if the statistics are not set.
     * 
     * @throws Will throw an error if the statistics are not set.
     * 
     * @author NodeSupport
     */
    private async createStatistics(): Promise<void> {
        // Check if the statistics are set
        if(!this.statistics) return;

        // Create the walkspeed statistic
        this.statistics.create("walkspeed").then(async (statistic) => {
            // Connect the functionalities of the statistic
            await statistic.connect(async (value, tween) => {
                // Get the humanoid instance of the entity
                const humanoid = await this.getEntityHumanoidInstance();
                // Check if the humanoid instance is available
                if(!humanoid) return;

                // Create a tween for the humanoid's walkspeed and play it
                TweenService.Create(humanoid, tween || new TweenInfo(0.05), {
                    WalkSpeed: value
                }).Play()
            })

            // Adjust the walkspeed statistic to the default value
            statistic.adjust("default", ClientMovementController.WalkSpeed, {Mode: StatisticModes.SET, Priority: 1})
        }).catch((e) => warn(e))

        // Create a field of view statistic
        this.statistics.create("fov").then(async (statistic) => {
            // Connect the functionalities of the statistic
            await statistic.connect(async (value, tween) => {
                // Create a tween for the cameras's field of view and play it
                TweenService.Create(Workspace.CurrentCamera!, tween || new TweenInfo(0.05), {
                    FieldOfView: value
                }).Play()
            })

            // Adjust the field of view statistic to the default value
            statistic.adjust("default", 70, {Mode: StatisticModes.SET, Priority: 1})
        }).catch((e) => warn(e))

        // Create a jump power statistic
        this.statistics.create("jumppower").then(async (statistic) => {
            // Connect the functionalities of the statistic
            await statistic.connect(async (value, tween) => {
                // Get the humanoid instance of the entity
                const humanoid = await this.getEntityHumanoidInstance();
                // Check if the humanoid instance is available
                if(!humanoid) return;

                // Create a tween for the cameras's field of view and play it
                TweenService.Create(humanoid!, tween || new TweenInfo(0), {
                    JumpPower: value
                }).Play()
            })

            // Adjust the field of view statistic to the default value
            statistic.adjust("default", 50, {Mode: StatisticModes.SET, Priority: 1})
        }).catch((e) => warn(e))
    }

    private async onCharacterAdded(character : Model) {
        const root = character.PrimaryPart
        if(!root) return;

        this.getEntityHumanoidInstance().then((humanoid) => {
            humanoid?.SetStateEnabled(Enum.HumanoidStateType.Dead, false)
            
            humanoid?.HealthChanged.Connect((health) => {
                humanoid.Health = humanoid.MaxHealth
            })
        })
    }

    /**
     * This function initializes the entity.
     * 
     * It prints a message to the console and animates the entity.
     * 
     * @author NodeSupport
     */
    private async initialize() {
        if(!this.isNetworkOwner && !this.isNPC) return;

        // Create the statistics for the humanoid entity
        this.createStatistics()

        const client = await BaseEntity.resolveClientEntity()
        const result = BaseEntity.resolveEntityInstance<Player>(client)

        !this.isNPC && result?.CharacterAdded.Connect((character) => this.onCharacterAdded(character))

        if(result?.Character && !this.isNPC) this.onCharacterAdded(result.Character)
        
        // Create the animations for the humanoid entity
        const animations = UtilitySharedSelectors.getNumber(this.getBufferFromIndex(1))
        this.animate(animations);
    }
}