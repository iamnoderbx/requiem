import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type CoordinateComponentData = { value: Vector3 }

export namespace EntityCoordinateComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<Vector3> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : CoordinateComponentData) {
            super(EntityCoordinateComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(12)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writef32(this.buffer, 0, data.value.X)
            buffer.writef32(this.buffer, 4, data.value.Y)
            buffer.writef32(this.buffer, 8, data.value.Z)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : CoordinateComponentData) : void {
            buffer.writef32(this.buffer, 0, data.value.X)
            buffer.writef32(this.buffer, 4, data.value.Y)
            buffer.writef32(this.buffer, 8, data.value.Z)
        }

        // Get the value from the buffer
        public get() : Vector3 {
            return new Vector3(
                buffer.readf32(this.buffer, 0),
                buffer.readf32(this.buffer, 4),
                buffer.readf32(this.buffer, 8)
            )
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        @AttachSubscriptionListener()
        public move(value : Vector3) {
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
