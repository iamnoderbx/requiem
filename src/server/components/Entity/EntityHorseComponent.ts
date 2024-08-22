import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { Animals } from "shared/Animals";

export type ExposedComponentData = Animals.Horse[];

export namespace EntityHorseComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    /**
     * The component class for the horse entity.
     */
    export class Component extends ComponentWrapper.Data implements ComponentData<ExposedComponentData> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        private unserialized : Animals.Horse[] = []

        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // Construct our buffer and write the value and max to it
        constructor(data : Animals.Horse[]) {
            super(EntityHorseComponent.Symbol)

            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);
        }

        /**
         * Converts a horse object to a serializable buffer.
         * 
         * @param horse The horse to serialize
         * @returns A serialized horse buffer
         * 
         * @author NodeSupport
         */
        private serializeHorse(horse : Animals.Horse) {
            return [
                horse.name, [horse.color.r, horse.color.g, horse.color.b], horse.created, horse.equipped, horse.gender, horse.bred, horse.ownership, horse.id,
                [
                    horse.statistics[Animals.Statistics.RunSpeed],
                    horse.statistics[Animals.Statistics.TurnSpeed],
                    horse.statistics[Animals.Statistics.JumpPower],
                    horse.statistics[Animals.Statistics.Stamina],
                    horse.statistics[Animals.Statistics.Health]
                ]
            ]
        }

        /**
         * Converts an array of horses to a serializable buffer.
         * 
         * @param horse A list of horses you want to serialize
         * @returns A serialized list of horses
         * 
         * @author NodeSupport
         */
        public serialize(horse : Animals.Horse[]) {
            return horse.map(horse => {
                return this.serializeHorse(horse)
            })
        }

        // Rewrite the buffer with new data
        // Attach a middleware listener to the rewrite function
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : Animals.Horse[]) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            return this.buffer
        }

        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public add(data : Animals.Horse) : void {
            this.unserialized.push(data);
            this.rewrite(this.unserialized)
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

