import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type HealthComponentData = { value: number, max: number }

export namespace EntityHealthComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<number> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : HealthComponentData) {
            super(EntityHealthComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(8)
            
            // Write the value and max to the buffer
            buffer.writef32(this.buffer, 0, data.value)
            buffer.writef32(this.buffer, 4, data.max)

            this.state.createProperty(this.buffer)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : HealthComponentData) : void {
            buffer.writef32(this.buffer, 0, data.value)
            buffer.writef32(this.buffer, 4, data.max)
        }

        // Get the value from the buffer
        public get() : number {
            return buffer.readf32(this.buffer, 0)
        }

        // Get the max from the buffer
        public max() : number {
            return buffer.readf32(this.buffer, 4)
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {
        
        public kill() : Promise<boolean> {
            return new Promise((resolve, reject) => {
                this.rewrite({ value: 0, max: this.max() })
                resolve(true)
            })
        }

        // Reduce the health of the entity
        public reduce(amount : number) : Promise<boolean> {
            return new Promise((resolve, reject) => {
                // Reject the promise if the amount is negative
                if(amount < 0) throw reject("Amount must be positive")

                // Get the current health of the entity
                const health = this.get()

                // Calculate the new health by subtracting the amount from the current health
                // The new health is clamped to be between 0 and the maximum health
                const newHealth = math.clamp(health - amount, 0, this.max())

                // Update the health of the entity
                this.rewrite({ value: newHealth, max: this.max() })

                // Resolve the promise with a value of true
                resolve(true)
            })
        }

        // Increase the health of the entity
        public increase(amount : number) : Promise<boolean> {
            return new Promise((resolve, reject) => {
                // Reject the promise if the amount is negative
                if(amount < 0) throw reject("Amount must be positive")

                // Get the current health of the entity
                const health = this.get()

                // Calculate the new health by adding the amount to the current health
                // The new health is clamped to be between 0 and the maximum health
                const newHealth = math.clamp(health + amount, 0, this.max())

                // Update the health of the entity
                this.rewrite({ value: newHealth, max: this.max() })

                // Resolve the promise with a value of true
                resolve(true)
            })
        }
    }
    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
