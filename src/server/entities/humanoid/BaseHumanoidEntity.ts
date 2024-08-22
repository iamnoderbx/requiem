import EntityComponentMixin, { ComponentFunctionalities } from "server/components/ComponentMixin";
import { BaseEntity } from "../BaseEntity";
import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { Entities } from "shared/EntitySignatures";
import { HandUtilities } from "shared/utilities/hands.utilities";
import { UtilityNumberComponent } from "server/components/Utilities/UtilityNumberCompontent";
import { CollectionService, Players } from "@rbxts/services";
import { Animations } from "shared/animations/animations";
import { EntityAnimationsComponent } from "server/components/Entity/EntityAnimationsComponent";
import { EffectsComponentData, EntityEffectsComponent } from "server/components/Entity/EntityEffectsComponent";

// Generate a type for the limbs of the body
// This will be used to store the health of each limb
export type Limb = "Left Arm" | "Right Arm" | "Left Leg" | "Right Leg" | "Head" | "Torso";
export type BodyLimbData =  { object : BasePart, health: number, maxhealth : number } ;

// Create a type for the humanoid entity
export const BodyComponentParts : Limb[] = [ "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Head", "Torso" ];

export class BaseHumanoidEntity extends BaseEntity implements ComponentFunctionalities {
    // Store the body parts of the humanoid
    private BodyComponentParts : Partial<Record<Limb, BodyLimbData>> = {};

    // Store the hands of the humanoid in object; non-r6 nativity hence not BodyComponent
    private hands : { right : BasePart | undefined, left : BasePart | undefined } = { right : undefined, left : undefined }

    private bones: {
        handles: {
            left: { motor: Motor6D | undefined; object: BasePart | undefined };
            right: { motor: Motor6D | undefined; object: BasePart | undefined };
        };
        torso: { motor: Motor6D | undefined; object: BasePart | undefined };
    } = {
        handles: {
            left: { motor: undefined, object: undefined },
            right: { motor: undefined, object: undefined },
        },
        torso: { motor: undefined, object: undefined },
    };

    /**
     * Creates a new humanoid entity.
     * 
     * @param instance - The model instance of the humanoid.
     * @param character - The character ID of the humanoid.
     */
    constructor(private instance : Model, private character : number | void, animation : Animations | void) {
        // Create a new ownership component
        const ownership = new UtilityNumberComponent.Component({
            value: Players.GetPlayerFromCharacter(instance)?.UserId || 0
        })

        // Create a new component for the animations
        const animations = new EntityAnimationsComponent.Component({ value: animation ?? Animations.DEFAULT })
        
        // Create a new effects component
        const effects = new EntityEffectsComponent.Component({ flash: false})

        // Call the super constructor with the health component and a callback
        super(Entities.Entities.HUMANOID, new ComponentWrapper.Entity([ ownership, animations, effects ]), 
            (promise) => promise.then(() => this.initialize()))
    }

    public createTurnGyro() {
        const root = this.instance.FindFirstChild("HumanoidRootPart") as BasePart;
        if(!root) return;

        const humanoid = this.instance.FindFirstChild("Humanoid") as Humanoid;
        humanoid.AutoRotate = false;

        const bodyGyro = new Instance("BodyGyro")
        bodyGyro.CFrame = root.CFrame
        bodyGyro.MaxTorque = new Vector3(0, math.huge, 0)
        bodyGyro.P = 5000
        bodyGyro.Parent = root

        return bodyGyro
    }

    public isNPC() {
        const ownership = this.getComponent(UtilityNumberComponent);
        return ownership.get() === 0;
    }

    /**
     * Gets the model instance of the humanoid.
     * 
     * @returns {Model} The model instance of the humanoid.
     */
    public getModel() {
        return this.instance;
    }
    
    /**
     * Gets the character ID of the humanoid.
     * 
     * @returns {number | void} The character ID of the humanoid.
     */
    public getCharacter() {
        return this.character;
    }

    /**
     * Sets the animations for the humanoid entity.
     * 
     * @param animations - The animations to set.
     * 
     * @author NodeSupport
     */
    public setAnimations(animations : Animations) {
        this.getComponent(EntityAnimationsComponent)
            .set(animations).catch((e) => warn(e))
    }

    /**
     * Gets the health of a specific body part of the humanoid entity.
     * 
     * @param part - The body part to get the health of.
     * @returns {number} The health of the body part.
     * 
     * @author NodeSupport
     */
    public getBodyPartHealth(part : Limb) : number {
        return this.BodyComponentParts[part]?.health || 0;
    }

    /**
     * Gets a specific body part of the humanoid entity.
     * 
     * @param part - The body part to get.
     * @returns {BodyLimbData | undefined} The body part, or undefined if it doesn't exist.
     * 
     * @author NodeSupport
     */
    public getBodyPart(part : Limb) : BodyLimbData | undefined {
        return this.BodyComponentParts[part];
    }

    /**
     * Gets the hands of the humanoid entity.
     * 
     * @returns {Hands} The hands of the humanoid entity.
     * 
     * @author NodeSupport
     */
    public getHands() {
        return this.hands;
    }

    /**
     * Gets the bones of the humanoid entity.
     * 
     * @returns {Bones} The bones of the humanoid entity.
     * 
     * @author NodeSupport
     */
    public getBones() {
        return this.bones;
    }

    public move(position : Vector3) {
        const humanoid = this.instance.FindFirstChild("Humanoid") as Humanoid;
        humanoid.MoveTo(position);
    }

    /**
     * Gets the player associated with the humanoid entity.
     * 
     * @returns {Player} The player associated with the humanoid entity.
     * 
     * @author NodeSupport
     */
    public getAssociatedPlayer() {
        return Players.GetPlayerFromCharacter(this.instance);
    }

    private effects() : void {
        // Get the effects component and subscribe to the "flash" event
        const effects = this.getComponent(EntityEffectsComponent)
        effects.listeners.subscribe("flash", (data : EffectsComponentData) => {
            // Humanoid has a flash step implementation, add effect (TODO)
        })
    }
    
    /**
     * Initializes the humanoid entity.
     * 
     * @returns {void} 
     * 
     * @author NodeSupport
     */
    public initialize() : void {
        // Set the "id" attribute of the instance to the entity pointer
        this.instance.SetAttribute("id", this.network.getEntityPointer())

        // Add the "entity" tag to the instance
        CollectionService.AddTag(this.instance, "entity")

        if(this.instance.FindFirstChild("UpperTorso")) return;

        // Assign hands and other humanoid parts to the associated character
        this.hands.right = HandUtilities.addRightHandToRig(this.instance)
        this.hands.left = HandUtilities.addLeftHandToRig(this.instance)

        // Create the bones for the humanoid
        this.bones.handles.right = HandUtilities.addRightHandHolster(this.instance)
        this.bones.handles.left = HandUtilities.addLeftHandHolster(this.instance)

        // Add the torso bone
        this.bones.torso = HandUtilities.addTorsoBone(this.instance)

        // Create the body parts
        this.instance.GetChildren().forEach((part) => {
            // Check if the part is a BasePart
            if(!part.IsA("BasePart")) return;

            // Check if the part is a humanoid part
            if(!BodyComponentParts.includes(part.Name as Limb)) return;

            // Add the part to the body parts
            this.BodyComponentParts[part.Name as Limb] = {
                object : part, health : 100, maxhealth : 100   
            };
        })

        const humanoid = this.instance.FindFirstChild("Humanoid") as Humanoid;
        humanoid.NameDisplayDistance = 0;
        humanoid.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
        
        humanoid.HealthDisplayDistance = 0;
        humanoid.HealthDisplayType = Enum.HumanoidHealthDisplayType.AlwaysOff;

        humanoid.MaxHealth = math.huge;
        humanoid.Health = humanoid.MaxHealth;

        humanoid.BreakJointsOnDeath = false;
        humanoid.HealthChanged.Connect((health) => humanoid.Health = humanoid.MaxHealth)

        humanoid.SetStateEnabled(Enum.HumanoidStateType.Dead, false);

        // Add the effects to the humanoid
        this.effects();
    }
}

// Use declaration merging to tell TypeScript that Entity has a test method
export interface BaseHumanoidEntity extends ComponentFunctionalities {}
export default EntityComponentMixin(BaseHumanoidEntity)