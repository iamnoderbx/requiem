import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import EntityComponentMixin, { ComponentInternalFunctions } from "../ComponentMixin";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";

export type CombatComponentData = { 
    stunned: boolean, 
    blocking : boolean, 
    
    canBlock: boolean, 
    rolling : boolean,

    posture : { max : number, current : number }
}

export namespace EntityCombatComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    class ComponentNetworkState extends ComponentWrapper.Data implements ComponentData<CombatComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected readonly buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : CombatComponentData) {
            super(EntityCombatComponent.Symbol)

            // Create a buffer to store the value and max
            this.buffer = buffer.create(8)
            this.state.createProperty(this.buffer)

            // Write the value and max to the buffer
            buffer.writeu8(this.buffer, 0, data.stunned ? 1 : 0)
            buffer.writeu8(this.buffer, 1, data.blocking ? 1 : 0)
            buffer.writeu8(this.buffer, 2, data.canBlock ? 1 : 0)
            buffer.writeu8(this.buffer, 3, data.rolling ? 1 : 0)
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        public rewrite(data : CombatComponentData) : void {
            buffer.writeu8(this.buffer, 0, data.stunned ? 1 : 0)
            buffer.writeu8(this.buffer, 1, data.blocking ? 1 : 0)
            buffer.writeu8(this.buffer, 2, data.canBlock ? 1 : 0)
            buffer.writeu8(this.buffer, 3, data.rolling ? 1 : 0)

            buffer.writeu16(this.buffer, 4, data.posture.current)
            buffer.writeu16(this.buffer, 6, data.posture.max)
        }

        // Get the value from the buffer
        public get() : CombatComponentData {
            return {
                stunned: buffer.readu8(this.buffer, 0) === 1,
                blocking: buffer.readu8(this.buffer, 1) === 1,
                canBlock: buffer.readu8(this.buffer, 2) === 1,
                rolling: buffer.readu8(this.buffer, 3) === 1,

                posture: {
                    current: buffer.readu16(this.buffer, 4),
                    max: buffer.readu16(this.buffer, 6)
                }
            }
        }
    }

    class ComponentExposedAPI extends ComponentNetworkState implements 
        ComponentInternalFunctions<ComponentNetworkState> {

        @AttachSubscriptionListener()
        public update(partialState: Partial<CombatComponentData>) {
            return new Promise((resolve, reject) => {
                try {
                    // Get the current state
                    const currentState = this.get();

                    // Merge the current state with the partial state
                    const newState = { ...currentState, ...partialState };

                    // Rewrite the state
                    this.rewrite(newState);

                    // Resolve the promise with the new state
                    resolve(this.get());
                } catch(e) {
                    // Reject the promise with the error
                    reject(e);
                }
            });
        }
        
        @AttachSubscriptionListener()
        public stunned(isStunned : boolean) {
            return this.update({ stunned: isStunned })
        }

        @AttachSubscriptionListener()
        public blocking(isBlocking : boolean) {
            return this.update({ blocking: isBlocking })
        }

        @AttachSubscriptionListener()
        public rolling(isRolling : boolean) {
            return this.update({ rolling: isRolling })
        }

        @AttachSubscriptionListener()
        public setCanBlock(canBlock : boolean) {
            return this.update({ canBlock })
        }

        @AttachSubscriptionListener()
        public reducePosture(amount : number) {
            return this.update({ posture: { current: this.get().posture.current - amount, max: this.get().posture.max } })
        }

        @AttachSubscriptionListener()
        public resetPosture() {
            return this.update({ posture: { current: this.get().posture.max, max: this.get().posture.max } })
        }

        @AttachSubscriptionListener()
        public setPosture(amount : number) {
            return this.update({ posture: { current: amount, max: amount } })
        }

        @AttachSubscriptionListener()
        public setMaxPosture(amount : number) {
            return this.update({ posture: { current: this.get().posture.current, max: amount } })
        }

        @AttachSubscriptionListener()
        public reset() {
            return this.update({ stunned: false, blocking: false, canBlock: true, rolling: false, posture: { current: this.get().posture.max, max: this.get().posture.max } })
        }
    }

    interface ComponentExposedAPI extends ComponentInternalFunctions<ComponentNetworkState> {}
    export const Component = EntityComponentMixin(ComponentExposedAPI)
}
