import { Animals } from "shared/Animals";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

type HorseBufferData = [
    string, // name
    [number, number, number], // color [r, g, b]
    number, // created
    boolean, // equipped
    number, // gender
    number, // bred
    number, // ownership
    number, // id
    number[] // statistics
];

export namespace HorseSharedSelectors {
    export const getHorses = (reader: buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as HorseBufferData[]
        
        const parsed = deserialize.map((data) => {
            return {
                name: data[0],
                color: { r: data[1][0], g: data[1][1], b: data[1][2] },
                created: data[2],
                equipped: data[3],
                gender: data[4],
                bred: data[5],
                ownership: data[6],
                id: data[7],
                statistics: {
                    [Animals.Statistics.RunSpeed]: data[8][0],
                    [Animals.Statistics.TurnSpeed]: data[8][1],
                    [Animals.Statistics.JumpPower]: data[8][2],
                    [Animals.Statistics.Stamina]: data[8][3],
                    [Animals.Statistics.Health]: data[8][4],
                }
            }
        })
        
        return parsed as unknown as Animals.Horse[];
    }
}