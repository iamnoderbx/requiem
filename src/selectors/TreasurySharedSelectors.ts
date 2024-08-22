import { Bloodline } from "shared/types/Bloodline"
import { Enchantment } from "shared/types/EnchantmentTypes"
import { Treasury } from "shared/types/Treasury";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export type TreasuryBufferData = [
    number, // id
    string, // name
    number, // marcs
    number, // owner
    number, // location
    [number, number, number][], // permissions
    [number, number, number, number, string, number][], // income
    [number, number, string, (number | string), string][] // audits
];

export type TreasuryData = {
    id: number,
    name: string,
    marcs: number,
    owner: number,
    location : number,
    permissions: Treasury.Permission[]
    income: Treasury.IncomeSource[];
    audits: {
        playerID: number,
        detail: number | string,
        action: number,
        timestamp: string,
        reason : string,
    }[]
}

export namespace TreasurySharedSelectors {
    export const getTreasuries = (reader : buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as TreasuryBufferData[]

        const results = deserialize.map((data) => {
            return {
                id: data[0],
                name: data[1],
                marcs: data[2],
                owner: data[3],
                location: data[4],
                permissions: data[5].map((permission) => {
                    return {
                        user: permission[0],                   // User ID
                        withdraw_marc_limit: permission[1],    // Withdraw limit
                        withdraw_item_limit: permission[2],    // Withdraw item limit
                    }
                }),
                income: data[6].map((income) => {
                    return {
                        UniqueID: income[0],              // Income source ID
                        TreasuryID: income[1],            // Treasury ID
                        type: income[2],                  // Income source type
                        
                        level: income[3],                 // Level
                        timeCreated: income[4],           // Created timestamp
                        timeLastClaimed: income[5],       // Last collected timestamp
                    }
                }),
                audits: data[7].map((audit) => {
                    return {
                        action: audit[0],
                        playerID: audit[1],
                        timestamp: audit[2],
                        detail: audit[3],
                        reason: audit[4],
                    }
                })
            }
        })

        return results as unknown as TreasuryData
    }
}