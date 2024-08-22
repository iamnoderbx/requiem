import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type EffectsComponentData = {
    flash : boolean,
}

export namespace EntityEffectsComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<EffectsComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : EffectsComponentData) {
            super(EntityEffectsComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(1)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writeu8(this.buffer, 0, data.flash ? 1 : 0)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : EffectsComponentData) : void {
            buffer.writeu8(this.buffer, 0, data.flash ? 1 : 0)
        }

        // Get the value from the buffer
        public get() : EffectsComponentData {
            return { flash: buffer.readu8(this.buffer, 0) === 1 }
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        // Reduce the health of the entity
        @AttachSubscriptionListener()
        public flash(flash : boolean) : Promise<boolean> {
            return new Promise((resolve) => {
                // Update the health of the entity
                this.rewrite({ flash })

                // Resolve the promise with a value of true
                resolve(true)
            })
        }
    }
    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
