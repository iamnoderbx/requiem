import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export type BranchBufferData = [
    number, // id
    string, // name
    string, // icon
    string, // shout
    number, // member_count
    number, // commander_id

    Array<[number, number, string, [number, string, number, number, number, number, string]]>, // members
    Array<[number, string, number, number, number, number, string]>, // detachments
    Array<[number, number, number]> // transfers
];

export type BufferDetatchmentData = {
    detachment_id: number
    detachment_name: string
    r: number, g: number, b: number,
    players: number,
    abbreviation: string
}

export type BranchTransferData = {
    user_id : number,
    current_branch_id : number,
    target_branch_id : number
}

export type BranchData = {
    id: number,
    name: string,
    icon: string,
    shout: string,
    member_count: number,
    commander: number,
    members_cache: {user_id: number, rank_id: number, username: string, detachment: BufferDetatchmentData}[],
    detachments: BufferDetatchmentData[],
    transfers: BranchTransferData[]
}

export namespace BranchSharedSelectors {
    export const getBranches = (reader : buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as BranchBufferData[]

        const results = deserialize.map((data) : BranchData => {
            return {
                id: data[0],
                name: data[1],
                icon: data[2],
                shout: data[3],
                member_count: data[4],
                commander: data[5],
                members_cache: data[6].map((member) => {
                    return {
                        user_id: member[0],
                        rank_id: member[1],
                        username: member[2],
                        detachment: {
                            detachment_id: member[3][0],
                            detachment_name: member[3][1],
                            r: member[3][2],
                            g: member[3][3],
                            b: member[3][4],
                            players: member[3][5],
                            abbreviation: member[3][6]
                        }
                    }
                }),
                detachments: data[7].map((detachment) => {
                    return {
                        detachment_id: detachment[0],
                        detachment_name: detachment[1],
                        r: detachment[2],
                        g: detachment[3],
                        b: detachment[4],
                        players: detachment[5],
                        abbreviation: detachment[6]
                    }
                }),
                transfers: data[8].map((transfer) => {
                    return {
                        user_id: transfer[0],
                        current_branch_id: transfer[1],
                        target_branch_id: transfer[2]
                    }
                })
            }
        })
        
        return results[0] as BranchData | undefined
    }
}