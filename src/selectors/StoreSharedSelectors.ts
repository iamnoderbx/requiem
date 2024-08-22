import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";

type DeserializedStoreComponentItem = {id: number, items: {name : string, available: boolean, price : number, meta: unknown[]}[]}
type ServerStoreComponentItem = [number, []]

export namespace StoreSharedSelectors {
    export const getWorldStoreInventories = (state : defined) => {
        const casted = state as {value : Array<buffer>};
        if(!state || !casted.value) return [];

        const results : DeserializedStoreComponentItem[] = [];
        casted.value.forEach((reader) => {
            const wrapper = BufferWrapper();
            const deserialized = wrapper.deserialize(reader) as ServerStoreComponentItem;
            
            results.push({
                id: deserialized[0],
                items: deserialized[1].map((item) => {
                    return {
                        name: item[0] as string,
                        price: item[1] as number,
                        available: item[2] as boolean,
                        meta: item[3] as unknown[]
                    }
                })
            })
        })

        return results
    }
}