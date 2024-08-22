import { Bloodline } from "shared/types/Bloodline"
import { Enchantment } from "shared/types/EnchantmentTypes"
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

type BloodlineBufferData = [
    number, // id
    string, // name
    number, // origin
    number, // treasury
    number, // created
    string, // icon
    string, // storyboard
    [number, number, number, number[]][] // members
];

export namespace BloodlineSharedSelectors {
    export const getBloodline = (reader : buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as BloodlineBufferData
        
        const parsed = {
            id: deserialize[0],
            name: deserialize[1],
            origin: deserialize[2],
            treasury: deserialize[3],
            created: deserialize[4],
            icon: deserialize[5],
            storyboard: deserialize[6],
            members: deserialize[7].map(member => {
                return {id: member[0], role: member[1], parent: member[2], permissions: member[3]}
            })
        }

        return parsed as unknown as Bloodline.Bloodline
    }
}