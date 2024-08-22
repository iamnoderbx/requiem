import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { Bloodline } from "shared/types/Bloodline";
import { Animals } from "shared/Animals";
import { Keybinds } from "shared/Keybindings";
import Object from "@rbxts/object-utils";

export type ExposedComponentData = Keybinds.Map;

export namespace EntityKeybindsComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        private unserialized : Keybinds.Map;

        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : Keybinds.Map) {
            super(EntityKeybindsComponent.Symbol)

            // Create a serializable array to store the data
            const serializable = this.serialize(data)
            this.unserialized = data;

            // Create a buffer to store the value and max
            // Write the values to the buffer in an array form.
            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(serializable)

            this.state.createProperty(this.buffer)
        }


        public serialize(keybinds : Keybinds.Map) {
            // Create a serializable array to store the data to be written to the buffer
            // [[Category, [[name, [key]]]]
            return Object.keys(keybinds).map(key => {
                const category = Keybinds.Default[key as keyof Keybinds.Map] as unknown as Keybinds.SoftKeybindMap;

                return [
                    key,
                    Object.keys(category).map(key => {
                        return [
                            key,
                            (category[key as keyof typeof category] as unknown as Enum.KeyCode[]).map(key => key.Name)
                        ]
                    })
                ]
            })
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : Keybinds.Map) : void {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);
        }

        // Get the value from the buffer
        public get() : ExposedComponentData {
            return this.unserialized
        }

        public toBufferString() : string {
            return buffer.tostring(this.buffer)
        }
    }
}

