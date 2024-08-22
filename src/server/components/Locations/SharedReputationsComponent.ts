import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { MemoryStoreService, MessagingService } from "@rbxts/services";
import { LocationBufferData } from "selectors/LocationSharedSelectors";
import ReputationAPIServiceRunner, { GetLocationEverythingResponse } from "server/entities/player/services/reputation/ReputationAPIServiceRunner";

// Create a memory service for the treasuries
const MemoryBranchHashmap = MemoryStoreService.GetHashMap("reputations");

export type ExposedComponentData = LocationBufferData
export type ReputationComponentData = GetLocationEverythingResponse

export namespace SharedReputationsComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<ReputationComponentData> {
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // This is a private field ReputationComponentData is only used to store the value in a buffer
        private unserialized : ReputationComponentData;
        private updated : number = tick();
        
        public static branches: Map<number, SharedReputationsComponent.Component> = new Map();

        /**
         * Create a new branch component
         * @param data The data to store in the component
         */
        constructor(data : ReputationComponentData) {
            super(SharedReputationsComponent.Symbol)

            // Serialize the data
            this.unserialized = data;
            this.buffer = this.rewrite(data);
        }

        /**
         * Serialize the data to be stored in the buffer
         * 
         * @param data The data to serialize
         * @returns { ExposedComponentData }
         * 
         * @author NodeSupport
         */
        public serialize(data: ReputationComponentData): ExposedComponentData {
            return data.map((location) => {
                return [
                    [ 
                        location.location.id, location.location.name, location.location.type, location.location.population, 
                        location.location.average_income, location.location.happiness, location.location.outlook, location.location.businesses,
                        location.location.civilian_tax, location.location.industrial_tax, location.location.governor
                    ],
                    location.reputation.map((instance) => {
                        return [ instance.id, instance.type, instance.name, instance.reputation, instance.location ]
                    })
                ]
            })
        }

        /**
         * Reformat the branch data with the
         * most recent data from the API
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async reformat(updateCrossServer : boolean = true) : Promise<void> {
            const data : GetLocationEverythingResponse = await ReputationAPIServiceRunner.getEverything();
            
            this.unserialized = data;
            this.rewrite(data, updateCrossServer);
        }

        /**
         * Updates the branch in the memory store with the most recent data
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        private async rewriteMemoryStore(updateCrossServer : boolean = false) : Promise<void> {
            MemoryBranchHashmap.SetAsync("reputations", this.unserialized, 180)
            updateCrossServer && MessagingService.PublishAsync("reputations", true)
        }

        /**
         * Rewrite the buffer with new data, apply middleware and subscription listeners
         * Will communicate with the client to update the selectors
         * 
         * @param data The data to rewrite
         * @returns { buffer }
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : ReputationComponentData = this.unserialized, updateCrossServer : boolean = false) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Serialize the data
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            // Update the branch in the memory store
            updateCrossServer && this.rewriteMemoryStore(updateCrossServer);

            // Check if the data has been updated
            if (tick() - this.updated > 20) {
                // Update the time the data was updated
                this.updated = tick()

                // Update the data with the most recent data
                this.reformat();
            }

            return this.buffer
        }

        /**
         * Get the unserialized data from the container
         * 
         * @returns { BranchComponentData }
         * 
         * @author NodeSupport
         */
        public get() : ReputationComponentData {
            return this.unserialized
        }

        /**
         * Convert the buffer to a string
         * 
         * @returns { string }
         * 
         * @author NodeSupport
         */
        public toBufferString() : string {
            return buffer.tostring(this.buffer)
        }
    }
}

