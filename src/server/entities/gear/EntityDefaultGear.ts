import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { EntityWeaponComponent } from "server/components/Entity/EntityWeaponComponent";
import { Entities } from "shared/EntitySignatures";
import { BaseEntity, InitializationStatus } from "../BaseEntity";
import { BaseHumanoidEntity } from "../humanoid/BaseHumanoidEntity";
import { Data } from "shared/types/Data";
import { EntityBaseGear } from "./classes/EntityBaseGear";
import { EquipmentUtilities } from "shared/utilities/equipment.utilities";
import { GearActions } from "shared/utilities/network/Events";
import { Animations } from "shared/animations/animations";
import { UtilityNumberComponent } from "server/components/Utilities/UtilityNumberCompontent";
import BaseTitanEntity from "../titan/BaseTitanEntity";
import { BaseCharacterEntity } from "../player/BaseCharacterEntity";
import { BasePlayerEntity } from "../player/BasePlayerEntity";

//@EntityIsLocalized(Entities.Players.CLIENT)
export class EntityDefaultGear extends BaseEntity implements EntityBaseGear {
    private gear : { weld : WeldConstraint, object : Model } | undefined
    private areBladesDrawn : boolean = false

    private grapples : number[] = []

    private holsters : {
        left: { weld : Weld, object : Model } | undefined;
        right: { weld : Weld, object : Model } | undefined;
    } | undefined

    private handles : {
        left?: {weld: Weld; object: Model} | undefined, 
        right?: {weld: Weld; object : Model} | undefined
    } = {}

    constructor(public humanoid : BaseHumanoidEntity) {
        const player = humanoid.getAssociatedPlayer()

        // Create a new weapon component
        const weapon = new EntityWeaponComponent.Component({unsheathed: false})

        // Create a new ownership component
        const ownership = new UtilityNumberComponent.Component({
            value: player?.UserId || 0
        })

        // Call the super constructor, player is added to ensure localization is
        // set during super compilation.
        super(Entities.Weapons.GEAR, new ComponentWrapper.Entity([ weapon, ownership ]), 
            (promise) => promise.then(() => this.initialize()))
    }

    private async grappled(...args : unknown[]) {
        const side = args[0] as number
        const isGrappling = (args[1] as number) === 1 ? true : false
        
        let entity = args[2] as number | undefined

        const player_instance = this.humanoid.getAssociatedPlayer()
        const character_id = this.humanoid.getCharacter()
        if(!character_id || !player_instance) return;

        const id = player_instance.GetAttribute("id") as number | undefined
        if(id === undefined) return;

        const player = BaseEntity.resolveEntityFromId<BasePlayerEntity>(id)
        
        if(!entity || !isGrappling) {
            const grapple = this.grapples[side]
            if(!grapple) return;

            if(!BaseTitanEntity.grapples[grapple]) BaseTitanEntity.grapples[grapple] = {}
            if(!BaseTitanEntity.grapples[grapple][player!.getEntityPointer()]) BaseTitanEntity.grapples[grapple][player!.getEntityPointer()] = 0
            BaseTitanEntity.grapples[grapple][player!.getEntityPointer()] -= 1
        } else if(entity && isGrappling) {
            entity = entity - 1

            if(!BaseTitanEntity.grapples[entity]) BaseTitanEntity.grapples[entity] = {}
            if(!BaseTitanEntity.grapples[entity][player!.getEntityPointer()]) BaseTitanEntity.grapples[entity][player!.getEntityPointer()] = 0
            BaseTitanEntity.grapples[entity][player!.getEntityPointer()] += 1

            this.grapples[side] = entity
        }
    }

    private async blades(areBladesBeingDranw : boolean, avoidUpdateState : boolean = false) {
        if(!this.handles.left || !this.handles.right) return;
        
        const leftBlade = this.handles.left.object.FindFirstChild("Blade") as BasePart
        const rightBlade = this.handles.right.object.FindFirstChild("Blade") as BasePart

        if(!leftBlade || !rightBlade) return;

        leftBlade.Transparency = areBladesBeingDranw ? 0 : 1
        rightBlade.Transparency = areBladesBeingDranw ? 0 : 1

        if(areBladesBeingDranw) this.humanoid.setAnimations(Animations.GEAR)
        else this.humanoid.setAnimations(Animations.DEFAULT)

        if(!avoidUpdateState) this.areBladesDrawn = areBladesBeingDranw
    }

    private async unholstering(isUnholstered : boolean) {
        // Get the right hand
        const left_hand = this.humanoid.getHands().left;
        if(!left_hand) return;

        const right_hand = this.humanoid.getHands().right;
        if(!right_hand) return;

        const left_holster = this.humanoid.getBones().handles.left
        if(!left_holster) return;

        const right_holster = this.humanoid.getBones().handles.right
        if(!right_holster) return;

        if(isUnholstered) {
            this.handles.left = EquipmentUtilities.unsheathe(left_hand, this.holsters?.left!)
            this.handles.right = EquipmentUtilities.unsheathe(right_hand, this.holsters?.right!)
            
            if(this.areBladesDrawn) this.blades(true, true)
        } else {
            EquipmentUtilities.sheathe(right_hand, right_holster.object!, this.handles.right!)
            EquipmentUtilities.sheathe(left_hand, left_holster.object!, this.handles.left!)

            if(this.areBladesDrawn) this.blades(false, true)
            
            this.handles.left = undefined
            this.handles.right = undefined
        }
    }

    public async add(variant: Data.GearVariations): Promise<void> {
        let bone = this.humanoid.getBones().torso
        if(this.humanoid.status === InitializationStatus.UNINITIALIZED) {
            await this.humanoid.isInitialized
        }

        bone = this.humanoid.getBones().torso
        if(!bone.motor || !bone.object) return;

        // Cast the bone to a motor and object
        const torso_bone = bone as { motor : Motor6D, object : BasePart }
        const left_handle_bone = this.humanoid.getBones().handles.left as { motor : Motor6D, object : BasePart }
        const right_handle_bone = this.humanoid.getBones().handles.right as { motor : Motor6D, object : BasePart }

        this.gear = EquipmentUtilities.addGearModelEquipment(variant, torso_bone)

        this.holsters = {
            left: EquipmentUtilities.addGearHandleHolsters(variant, left_handle_bone),
            right: EquipmentUtilities.addGearHandleHolsters(variant, right_handle_bone),
        }
    }

    public initialize(...args: unknown[]) {
        this.network.listen(GearActions.UNHOLSTER, (value) => this.unholstering(value as boolean))
        this.network.listen(GearActions.DRAW, (value) => this.blades(value as boolean))
        this.network.listen(GearActions.GRAPPLED, (...args : unknown[]) => this.grappled(...args))
    }
}