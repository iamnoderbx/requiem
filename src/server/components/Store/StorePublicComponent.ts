import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";

export type StoreComponentItem = {name : string, price : number, available: boolean, meta: unknown[]}
export type ExposedComponentData = {id: number, items : StoreComponentItem[]}

export namespace StorePublicComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : ExposedComponentData | undefined;

        // Construct our buffer and write the value and max to it
        constructor(data : ExposedComponentData) {
            super(StorePublicComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = this.rewrite(data)
        }

        public getUnserialized() : ExposedComponentData {
            return this.unserialized!
        }

        private serializeItem(item : StoreComponentItem) {
            return [item.name, item.price, item.available, item.meta]
        }

        public serialize(id : number, items : StoreComponentItem[]) {
            return [id, items.map((v) => this.serializeItem(v))]
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : ExposedComponentData) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data.id, data.items)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            return this.buffer
        }

        // Get the value from the buffer
        public get() : ExposedComponentData {
            return {id: this.unserialized?.id!, items: this.unserialized?.items!}
        }
    }
}
