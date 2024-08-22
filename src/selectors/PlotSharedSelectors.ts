import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";

export type PlotBufferData = [
    number, // id
	number, // owner
];

export type PlotDataSerialized = {
    id: number,
    owner: number,
};

export namespace PlotSharedSelectors {
    export const getPlots = (reader : buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as PlotBufferData[]

        const results = deserialize.map((data) => {
            return {
				id: data[0],
				owner: data[1],
			}
        })

        return results
    }
}