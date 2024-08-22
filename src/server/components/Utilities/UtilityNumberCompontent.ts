import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type NumberComponentData = { value: number }

export namespace UtilityNumberComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<number> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        private id : number;

        readonly state : NetworkBubble.State = new NetworkBubble.State()

        public static createDynamicNumberBuffer(value : number) : buffer {
            const size = value > 65535 ? 4 : value > 255 ? 2 : 1
            const newBuffer = buffer.create(size + 1)
            
            // Write the type to the buffer
            if(size === 1) buffer.writeu8(newBuffer, 0, 1) // 1 for u8
            else if(size === 2) buffer.writeu8(newBuffer, 0, 2) // 2 for u16
            else buffer.writeu8(newBuffer, 0, 3) // 3 for u32

            // Write the value to the buffer
            if(size === 1) buffer.writeu8(newBuffer, 1, value) // start at index 1
            else if(size === 2) buffer.writeu16(newBuffer, 1, value) // start at index 1
            else buffer.writeu32(newBuffer, 1, value) // start at index 1

            return newBuffer
        }

        // Construct our buffer and write the value and max to it
        constructor(data : NumberComponentData) {
            super(UtilityNumberComponent.Symbol)

            // Create a buffer to store the value and max
            // Dynamically size our buffer based on how large the number is
            this.buffer = ComponentNetworkState.createDynamicNumberBuffer(data.value)
            this.id = this.state.createProperty(this.buffer)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : NumberComponentData) : void {
            const buffer = ComponentNetworkState.createDynamicNumberBuffer(data.value)
            this.state.overrideProperty(this.id, buffer)

            // Update the buffer
            this.buffer = buffer;
        }

        public get() : number {
            // Read the type from the first byte of the buffer
            const numType = buffer.readu8(this.buffer, 0)

            // Read the value from the buffer based on the type
            if(numType === 1) return buffer.readu8(this.buffer, 1) // u8
            else if(numType === 2) return buffer.readu16(this.buffer, 1) // u16
            else return buffer.readu32(this.buffer, 1) // u32
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        // Empty Exposed Interface; should only be used for retrieving with
        // no additional functionality
        @AttachSubscriptionListener()
        public set(value : number) {
            return new Promise((resolve, reject) => {
                try {
                    this.rewrite({ value })
                    resolve(value)
                } catch(e) { reject(e) }
            })
        }
    }

    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
