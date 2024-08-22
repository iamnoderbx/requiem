import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";

export type MovementComponentData = { walkspeed: number, sprint: number, humanoid: number }

export namespace EntityMovementComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<number> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : MovementComponentData) {
            super(EntityMovementComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(12)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writef32(this.buffer, 0, data.walkspeed)
            buffer.writef32(this.buffer, 4, data.sprint)
            buffer.writef32(this.buffer, 8, data.humanoid)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : MovementComponentData) : void {
            buffer.writef32(this.buffer, 0, data.walkspeed)
            buffer.writef32(this.buffer, 4, data.sprint)
            buffer.writef32(this.buffer, 8, data.humanoid)
        }

        // Get the value from the buffer
        public get() : number {
            return buffer.readf32(this.buffer, 0)
        }

        // Get the max from the buffer
        public sprint() : number {
            return buffer.readf32(this.buffer, 4)
        }

        public humanoid() : number {
            return buffer.readf32(this.buffer, 8)
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        // Reduce the health of the entity
        public adjust(amount : number) : Promise<boolean> {
            return new Promise((resolve, reject) => {
                // Reject the promise if the amount is negative
                if(amount < 0) throw reject("Amount must be positive")

                // Update the health of the entity
                this.rewrite({ walkspeed : amount, sprint: this.sprint(), humanoid: this.humanoid() })

                // Resolve the promise with a value of true
                resolve(true)
            })
        }
    }
    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
