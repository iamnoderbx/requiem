import { ComponentWrapper } from "server/components/ComponentDataWrapper"
import EntityComponentMixin, { ComponentFunctionalities } from "server/components/ComponentMixin"
import { EntityHealthComponent } from "server/components/Entity/EntityHealthComponent"
import { BaseEntity } from "../BaseEntity"
import { EntityCoordinateComponent } from "server/components/Entity/CoordinateComponent"
import { CollectionService, Players, Workspace } from "@rbxts/services"
import { EntityCombatComponent } from "server/components/Entity/EntityCombatComponent"
import { Entities } from "shared/EntitySignatures"
import { BaseHumanoidEntity } from "../humanoid/BaseHumanoidEntity"
import { Data } from "shared/types/Data"

import { TimeoutThread } from "shared/utilities/threading/TimeoutThread"
import { AnimateableCharacter, AnimationUtilities } from "shared/utilities/animations.utilities"
import animations, { Actions } from "shared/animations/animations"
import { Memory } from "shared/utilities/memory.utilities"
import { EntityIsLocalized } from "shared/utilities/decorators/EntityListensFor"
import { EntityGearUtilities } from "../gear/classes/EntityGearUtilities"
import { EntityBaseGear } from "../gear/classes/EntityBaseGear"
import Ragdoll from "shared/utilities/ragdoll/ragdoll"

// All equipment actions
export enum EquipmentAction {
    ADD, REMOVE, EQUIP, UNEQUIP,
}

const RESPAWN_LOCATIONS = CollectionService.GetTagged("Spawn").map((instance) => {
    const position = (instance as BasePart).Position
    instance.Destroy()
    
    return position
})

@EntityIsLocalized(Entities.Players.CLIENT)
export class BaseCharacterEntity extends BaseEntity implements ComponentFunctionalities {
    // Assigning a humanoid to the base character entity
    private humanoid! : BaseHumanoidEntity;
    private gear : EntityBaseGear | undefined;

    // Create a private memory
    public memory = Memory.create({stuns : 0, blocked : 0})

    /**
     * Constructs a new BaseCharacterEntity. Injects the model instance into the constructor.
     * Initializes the character with health, coordinate, and combat components.
     * 
     * @param instance - The model instance.
     * 
     * @author NodeSupport
     */
    constructor(private instance : Model) {
        // Create the health and coordinate components
        const health = new EntityHealthComponent.Component({
            value: 100, max: 100
        })

        // Create the coordinate component
        const coordinate = new EntityCoordinateComponent.Component({
            value: new Vector3(0, 0, 0)
        })

        // Create the combat component
        const combat = new EntityCombatComponent.Component({
            stunned: false, blocking: false, canBlock: true,
            rolling: false, posture: { max: 100, current: 100 }
        })
        
        // Call the super constructor with the health component and a callback
        super(Entities.Players.CHARACTER, new ComponentWrapper.Entity([ health, coordinate, combat ]), 
            (promise) => promise.then(() => this.initialize()))
    }

    public async getHealth() {
        // Get the health component
        const health = this.getComponent(EntityHealthComponent)

        // Return the health value
        return health.get()
    }

    public getHealthComponent() {
        return this.getComponent(EntityHealthComponent)
    }

    public async isBlocking() {
        // Get the combat component
        const combat = this.getComponent(EntityCombatComponent)
        
        // Check if the character is blocking
        return combat.get().blocking
    }

    public async blocking(isBlocking : boolean) {
        // Get the combat component
        const combat = this.getComponent(EntityCombatComponent)

        // Set blocked to the current timestamp.
        isBlocking && this.memory.set("blocked", tick())

        // Set the character to be blocking
        combat.blocking(isBlocking)
    }

    public async broken(length : number, animation: string = animations[Actions.COMBAT].PARRIED) {
        // Get the combat component
        const combat = this.getComponent(EntityCombatComponent)
        
        await combat.update({stunned: true, blocking: false, canBlock: false}).then(() => {
            // Get the animation
            const model = this.humanoid.getModel() as AnimateableCharacter

            // Play the animation
            AnimationUtilities.play(animation, model)
        })

        // Create a timeout thread
        TimeoutThread.create(this.network.getEntityPointer(), "blockable", length).then(() => {
            combat.setCanBlock(true).catch((err) => warn("Failed to set can block", err))
        })

        // Create a timeout thread
        TimeoutThread.create(this.network.getEntityPointer(), "stun", length).then(() => {
            combat.stunned(false).catch((err) => warn("Failed to unstun character", err))
        })
    }

    public async hitstun() {
       // Get the combat component
       const combat = this.getComponent(EntityCombatComponent)
        
       await combat.update({stunned: true, blocking: false, canBlock: false}).then(() => {
            // Get the stun index
            const index = this.memory.get("stuns")
            const key = index % animations[Actions.COMBAT].STUNS.size()

            // Get the animation
            const animation = animations[Actions.COMBAT].STUNS[key]
            const model = this.humanoid.getModel() as AnimateableCharacter

            // Play the animation
            AnimationUtilities.play(animation, model)

            // Increment the stun index
            this.memory.set("stuns", index + 1)
        })

        TimeoutThread.create(this.network.getEntityPointer(), "blockable", 0.4).then(() => {
            combat.setCanBlock(true).catch((err) => warn("Failed to set can block", err))
        })

        // Create a timeout thread
        TimeoutThread.create(this.network.getEntityPointer(), "stun", 1).then(() => {
            combat.stunned(false).catch((err) => warn("Failed to unstun character", err))
        })
    }

    public async getHumanoidInstance() {
        return this.instance.FindFirstChild("Humanoid") as Humanoid
    }

    public async getHumanoidRootPart() {
        return this.instance.WaitForChild("HumanoidRootPart") as BasePart
    }

    public async respawn() {
        this.instance.Parent = Workspace;
        
        const root = this.instance.FindFirstChild("HumanoidRootPart") as BasePart;

        // Get the closest spawn location
        const position = RESPAWN_LOCATIONS.reduce((prev, curr) => {
            const prevDistance = (prev.sub(root.Position)).Magnitude
            const currDistance = (curr.sub(root.Position)).Magnitude

            return prevDistance < currDistance ? prev : curr
        })

        // Set the position of the character
        root.CFrame = new CFrame(position);
    
        // Get the health component
        const health = this.getComponent(EntityHealthComponent)
        health.rewrite({ value: health.max(), max: health.max() })
    }

    /**
     * This function handles equipment actions for a character entity.
     * 
     * @param {EquipmentAction} action - The action to be performed on the equipment.
     * 
     * @returns {Promise<void>} A promise that resolves when the action is completed, or rejects if an error occurs.
     * 
     * @throws Will throw an error if the action is undefined or not valid, or if the humanoid is not found.
     * 
     * @author NodeSupport
     */
    public async equipment(action : EquipmentAction, data : Data.User) : Promise<void> {
        const onCreateEquipment = async (data : Data.User) => {
            // Create the weaponary
            await EntityGearUtilities.createGear(data.gear).then((gear) => {
                if(!gear) throw "Failed to create gear"

                // Set the weapon
                this.gear = new gear(this.humanoid)
            }).catch((err) => warn("Failed to create gear", err))
        }

        // If the weapon is not found, create the weaponary
        if(!this.gear) await onCreateEquipment(data) 

        // Perform the action on the equipment
        return new Promise((resolve, reject) => {
            if(action === undefined) return reject("Invalid action, provide a valid action.")
            if(!this.humanoid) return reject("Humanoid not found")

            // Get the weaponary variant
            const variant = data.gear.variant.variant;

            switch(action) {
                case EquipmentAction.ADD:
                    // Add the equipment
                    return resolve(this.gear!.add(variant))
            }
        })
    }

    public getHumanoid() {
        return this.humanoid
    }

    private async request(...args : unknown[]) {
        // switch(args[0]) {
            
        // }
    }

    /**
     * Initializes the BaseCharacterEntity, setting up necessary connections and attributes.
     * 
     * @author NodeSupport
     */
    public initialize() : void {
        // Assigning a humanoid component to the base character entity
        this.humanoid = new BaseHumanoidEntity(this.instance, this.network.getEntityPointer())

        // Get the health component
        const health = this.getComponent(EntityHealthComponent)
        health.listeners.subscribe("rewrite", (value : number) => {
            // Pass if the value is anything above 0
            if(value > 0) return;

            const oldRagdollModel = Workspace.FindFirstChild(this.instance.Name + "_ragdoll") as Model
            if(oldRagdollModel) oldRagdollModel.Destroy()

            const player = Players.GetPlayerFromCharacter(this.instance)

            // Assign a ragdoller to the character
            const clone = Ragdoll.Clone(this.instance);
            clone.PrimaryPart!.SetNetworkOwner(player);

            this.instance.Parent = undefined;
        })

        // Get the coordinate component
        const coordinate = this.getComponent(EntityCoordinateComponent)
        
        // Create a listener for the move event and move the character
        coordinate.listeners.subscribe("move", (value : Vector3) => {
            const root = this.instance.FindFirstChild("HumanoidRootPart") as BasePart
            root.CFrame = new CFrame(value)
        })

        this.network.listen(0, (...args) => this.request(...args))

        // This is an instance therefor add attributes
        this.instance.SetAttribute("id", this.network.getEntityPointer())
        CollectionService.AddTag(this.instance, "entity")

        this.instance.PrimaryPart = this.instance.WaitForChild("HumanoidRootPart") as BasePart
        this.respawn()
    }
}

// Use declaration merging to tell TypeScript that Entity has a test method
export interface BaseCharacterEntity extends ComponentFunctionalities {}
export default EntityComponentMixin(BaseCharacterEntity)