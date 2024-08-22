import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type WeaponComponentData = { unsheathed: boolean }

export namespace EntityWeaponComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<WeaponComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : WeaponComponentData) {
            super(EntityWeaponComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(8)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writeu8(this.buffer, 0, data.unsheathed ? 1 : 0)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : WeaponComponentData) : void {
            buffer.writeu8(this.buffer, 0, data.unsheathed ? 1 : 0)
        }

        // Get the value from the buffer
        public get() : WeaponComponentData {
            return { unsheathed: buffer.readu8(this.buffer, 0) === 1 }
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        @AttachSubscriptionListener()
        public setUnsheathed(isUnSheathed : boolean) {
            return new Promise((resolve, reject) => {
                try {
                    this.rewrite({ unsheathed: isUnSheathed })
                    resolve(this.get())
                } catch(e) { reject(e) }
            })
        }
    }

    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
