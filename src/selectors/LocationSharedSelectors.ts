import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export type LocationBufferData = [
    [ number, string, number, number, number, number, number, number, number, number, number ], // ReputationLocation
    [number, number, string, number, number][], // ReputationInstance
][];

export type ReputationLocation = { id : number, name : string, type : number, population : number, average_income : number, happiness : number, outlook : number, businesses : number, civilian_tax: number, industrial_tax: number, governor: number}
export type ReputationInstance = { id : number, type : number, name : string, reputation : number, location : number };

export type LocationData = {location : ReputationLocation, reputation : Array<ReputationInstance>};
export type LocationInformation = Array<LocationData>;

export namespace LocationSharedSelectors {
    export const getLocations = (reader : buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as LocationBufferData

        const results = deserialize.map((location) : {
            location : ReputationLocation,
            reputation : Array<ReputationInstance>
        } => {
            return {
                location: {
                    id: location[0][0],
                    name: location[0][1],
                    type: location[0][2],
                    population: location[0][3],
                    average_income: location[0][4],
                    happiness: location[0][5],
                    outlook: location[0][6],
                    businesses: location[0][7],
                    civilian_tax: location[0][8],
                    industrial_tax: location[0][9],
                    governor: location[0][10]
                },
                reputation: location[1].map((instance) : ReputationInstance => {
                    return {
                        id: instance[0],
                        type: instance[1],
                        name: instance[2],
                        reputation: instance[3],
                        location: instance[4]
                    }
                })
            }
        });

        return results
    }
}