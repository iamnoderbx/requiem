import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { MemoryStoreService, Workspace } from "@rbxts/services";
import PlotAPIServiceRunner, { GetPlotResponse, PlotAssetType } from "server/entities/player/services/plots/PlotAPIServiceRunner";
import { PlotBufferData } from "selectors/PlotSharedSelectors";

export type ExposedComponentData = PlotBufferData
export type PlotComponentData = GetPlotResponse & {}

export namespace SharedPlotComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Container extends ComponentWrapper.Data implements ComponentData<SharedPlotComponent.Component[]> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : SharedPlotComponent.Component[] = [];
        
        constructor() {
            super(SharedPlotComponent.Symbol)

            const serializable = this.serialize([])

            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(serializable)

            this.state.createProperty(this.buffer)
        }
        
        /**
         * Serialize the data to be stored in the buffer
         * 
         * @param data The data to serialize
         * @returns { ExposedComponentData[] }
         * 
         * @author NodeSupport
         */
        public serialize(data : SharedPlotComponent.Component[]) : ExposedComponentData[] {
            return data.map((v) => v.serialize(v.get()))
        }

        /**
         * Get the unserialized data from the container
         * @returns { SharedPlotComponent.Component[] }
         * 
         * @author NodeSupport
         */
        public get() : SharedPlotComponent.Component[] {
            return this.unserialized
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
        public rewrite(data : SharedPlotComponent.Component[]) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            return this.buffer
        }
        
        /**
         * Add a treasury to the container, apply middleware and subscription listeners
         * Adds middleware to the treasury to listen for changes and update the container
         * 
         * @param treasury The treasury to add to the container
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public addPlot(plot : SharedPlotComponent.Component) {
            // Add a treasury to the container
            const current = this.get()

            // If the treasury already exists, return
            if (current.find((v) => v.get().id === plot.get().id)) return

            current.push(plot)

            // Rewrite the buffer with the new data
            this.rewrite(current)

            // Add a listener to the treasury
            plot.middleware.apply(() => {
                this.rewrite(current)
            })
        }
    }

    export class Component extends ComponentWrapper.Data implements ComponentData<PlotComponentData> {
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : PlotComponentData;
        private updated : number = tick();

        /**
         * Create a new treasury component
         * @param data The data to store in the component
         */
        constructor(data : PlotComponentData) {
            super(SharedPlotComponent.Symbol)

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
        public serialize(data : PlotComponentData) : ExposedComponentData {
            return [ data.id, data.owner ]
        }

        /**
         * Reformat the treasury data with the
         * most recent data from the API
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async reformat() : Promise<void> {
            const data : GetPlotResponse = await PlotAPIServiceRunner.getPlot(tonumber(this.unserialized.id)!);
            this.unserialized = data;

            this.rewrite(data);
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
        public rewrite(data : PlotComponentData) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Serialize the data
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            // Check if the data has been updated
            if (tick() - this.updated > 120) {
                // Update the time the data was updated
                this.updated = tick()

                // Update the data with the most recent data
                this.reformat();
            }

            return this.buffer
        }

        public addAssetToPlot(asset : PlotAssetType) {
            print("Adding asset:", asset)
        }

        /**
         * Get the unserialized data from the container
         * 
         * @returns { PlotComponentData }
         * 
         * @author NodeSupport
         */
        public get() : PlotComponentData {
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

