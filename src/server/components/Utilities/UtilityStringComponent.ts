import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";

export type StringComponentData = { value: string }

export namespace UtilityStringComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<string> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : StringComponentData) {
            super(UtilityStringComponent.Symbol)

            // Create a buffer to store the value and max
            // Our buffer will be a string with an unknown length
            this.buffer = buffer.create(data.value.size() + 4)
            this.state.createProperty(this.buffer)

            // Write the size of the string to the buffer
            buffer.writeu32(this.buffer, 0, data.value.size())

            // Write the string to the buffer, update the buffer size
            buffer.writestring(this.buffer, 4, data.value)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite() : void {
            throw error("You cannot rewrite a predefined string component")
        }

        // Get the value from the buffer
        public get() : string {
            const length = buffer.readu32(this.buffer, 0)
            return buffer.readstring(this.buffer, 4, length)
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        // Empty Exposed Interface; should only be used for retrieving with
        // no additional functionality
    }

    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
