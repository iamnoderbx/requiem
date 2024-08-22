import { ComponentWrapper } from "server/components/ComponentDataWrapper"
import EntityComponentMixin, { ComponentFunctionalities } from "server/components/ComponentMixin"
import { BaseEntity } from "../BaseEntity"
import { CollectionService } from "@rbxts/services"
import { EntityTaggedWith } from "shared/utilities/decorators/EntityListensFor"

import { Entities } from "shared/EntitySignatures"
import { UtilityStringComponent } from "server/components/Utilities/UtilityStringComponent"
import { BaseCharacterEntity } from "../player/BaseCharacterEntity"
import { UtilityNumberComponent } from "server/components/Utilities/UtilityNumberCompontent"

// This is a client entity, it listens for the PlayerAdded event
// and is localized to the client- only replicate to the instance passed
@EntityTaggedWith("dummy")
class BasePlayerEntity extends BaseEntity implements ComponentFunctionalities {
    private character! : BaseCharacterEntity
    /**
     * Constructs a new BasePlayerEntity. Injects the player instance into the constructor from
     * the PlayerAdded event. Initializes the player with a name and id component.
     * 
     * @param instance - The player instance, note this is injected from the event
     * 
     * @author NodeSupport
     */
    constructor(private instance : Model) {
        const name = new UtilityStringComponent.Component({
            value: instance.Name
        })

        const id = new UtilityNumberComponent.Component({
            value: -1
        })

        // Call the super constructor with the health component and a callback
        super(Entities.Players.CLIENT, new ComponentWrapper.Entity([ name, id ]), 
            (promise) => promise.then(() => this.initialize()))
    }

    /**
     * Initializes the player entity, adds the character model to the entity, 
     * and sets the entity pointer.
     * 
     * @author NodeSupport
     */
    public async initialize() {
        this.character = new BaseCharacterEntity(this.instance)

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
    public getCharacter() : BaseCharacterEntity {
        return this.character
    }
}

// Use declaration merging to tell TypeScript that Entity has a test method
interface BasePlayerEntity extends ComponentFunctionalities {}
export default EntityComponentMixin(BasePlayerEntity)