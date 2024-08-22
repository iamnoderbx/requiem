import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import { Permission } from "shared/utilities/decorators/CommandDecorators";

export type ExposedComponentData = { userid : number, team : number, permissions : Permission }

export namespace EntityPlayerPublicComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : ExposedComponentData) {
            super(EntityPlayerPublicComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(8)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writei32(this.buffer, 0, data.userid)
            buffer.writei8(this.buffer, 4, data.team)
            buffer.writei8(this.buffer, 5, data.permissions)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : ExposedComponentData) : void {
            buffer.writei32(this.buffer, 0, data.userid)
            buffer.writei8(this.buffer, 4, data.team)
        }

        // Get the value from the buffer
        public get() : ExposedComponentData {
            return {userid: this.userid(), team: this.team(), permissions: this.permissions()}
        }

        // Get the max from the buffer
        public userid() : number {
            return buffer.readi32(this.buffer, 0)
        }

        public team() : number {
            return buffer.readi8(this.buffer, 4)
        }

        public permissions() : Permission {
            return buffer.readi8(this.buffer, 5)
        }
    }
}
