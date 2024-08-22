import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import { CommandBufferStructure, CommandStructure } from "shared/utilities/decorators/CommandDecorators";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";

export type ExposedComponentData = CommandBufferStructure[];

export namespace CommandWrapperComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol: unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer: buffer;
        readonly state: NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data: ExposedComponentData) {
            super(CommandWrapperComponent.Symbol)

            // Create a buffer to store the value and max
            // Write the values to the buffer in an array form.
            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(data)

            this.state.createProperty(this.buffer)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data: ExposedComponentData): void {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(data)
        }

        // Get the value from the buffer
        public get(): ExposedComponentData {
            const wrapper = BufferWrapper()
            return wrapper.deserialize(this.buffer)
        }

        public toBufferString(): string {
            return buffer.tostring(this.buffer)
        }
    }
}
