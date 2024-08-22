import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { Bloodline } from "shared/types/Bloodline";

export type ExposedComponentData = [
    number, // id
    string, // name
    number, // origin
    number, // treasury
    number, // created
    string, // icon
    string, // storyboard
    [number, number, number, number[]][] // members
];

export namespace SharedBloodlineComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : Bloodline.Bloodline) {
            super(SharedBloodlineComponent.Symbol)

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Create a buffer to store the value and max
            // Write the values to the buffer in an array form.
            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(serializable)

            this.state.createProperty(this.buffer)
        }

        public serialize(data : Bloodline.Bloodline) {
            return [
                data.id, data.name, data.origin, data.treasury, data.created,
                data.icon, data.storyboard,

                // Map the members to a serializable format
                data.members.map(member => {
                    return [member.id, member.role, member.parent, member.permissions]
                })
            ]
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : Bloodline.Bloodline) : void {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()

            // Create a serializable array to store the data
            const serializable = this.serialize(data)
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);
        }

        // Get the value from the buffer
        public get() : ExposedComponentData {
            const wrapper  = BufferWrapper()
            return wrapper.deserialize(this.buffer)
        }

        public toBufferString() : string {
            return buffer.tostring(this.buffer)
        }
    }
}

