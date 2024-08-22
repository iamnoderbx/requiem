import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";

export type ExposedComponentData<T> = T[]

export namespace UtilityArrayComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component<T> extends ComponentWrapper.Data implements ComponentData<ExposedComponentData<T>> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : ExposedComponentData<T> | undefined;

        // Construct our buffer and write the value and max to it
        constructor(data : ExposedComponentData<T>) {
            super(UtilityArrayComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = this.rewrite(data)
        }

        public serialize(data: ExposedComponentData<T>): unknown[] {
			return data
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : ExposedComponentData<T>) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            return this.buffer
        }

        // Get the value from the buffer
        public get() : ExposedComponentData<T> {
            return this.unserialized!
        }
    }
}
