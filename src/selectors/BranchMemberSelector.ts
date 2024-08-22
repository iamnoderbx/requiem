import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export type DetachmentBufferData = [number, string, number, number, number, number, string]
export type DetachmentData = {
    detachment_id: number,
    detachment_name: string,
    r: number,
    g: number,
    b: number,
    players: number,
    abbreviation: string,
}

//branch_id: number, rank_id: number, rank: string, username: string, wage : number, detachment: {detachment_id: number, detachment_name: string, r : number, g: number, b: number}
export type BranchMemberBufferData = [
    number, // branch_id
    number, // rank_id
    string, // rank
    string, // username
    number, // wage
    DetachmentBufferData, // detachment
    [number, boolean, Array<[number, number, number, string, DetachmentBufferData]>], // pagination, branchid, rankid, userid, username, detachment
    [number, boolean, Array<[number, number, string, string]>] // pagination, last, [user_id, log_id, log_reason, log_timestamp]
]

export type BranchMemberData = {
    branch_id: number,
    rank_id: number,
    rank: string,
    username: string,
    wage: number,

    detachment: DetachmentData,

    pagination: {
        page: Array<{
            branch_id: number,
            rank_id: number,
            user_id: number,
            username: string,
            detachment: DetachmentData
        }>,
        current: number
        hasNext: boolean
    }

    audits: {
        page: Array<{
            user_id: number,
            log_id: number,
            log_reason: string,
            log_timestamp: string
        }>,
        current: number,
        hasNext: boolean
    }
}

export namespace BranchMemberSelectors {
    export const getMember = (reader: buffer) => {
        const wrapper = BufferWrapper()
        const deserialize = wrapper.deserialize(reader) as BranchMemberBufferData

        const results: BranchMemberData = {
            branch_id: deserialize[0],
            rank_id: deserialize[1],
            rank: deserialize[2],
            username: deserialize[3],
            wage: deserialize[4],

            detachment: {
                detachment_id: deserialize[5][0],
                detachment_name: deserialize[5][1],
                r: deserialize[5][2],
                g: deserialize[5][3],
                b: deserialize[5][4],
                players: deserialize[5][5],
                abbreviation: deserialize[5][6]
            },

            pagination: {
                page: deserialize[6][2].map((page) => {
                    return {
                        branch_id: page[0],
                        rank_id: page[1],
                        user_id: page[2],
                        username: page[3],
                        detachment: {
                            detachment_id: page[4][0],
                            detachment_name: page[4][1],
                            r: page[4][2],
                            g: page[4][3],
                            b: page[4][4],
                            players: page[4][5],
                            abbreviation: page[4][6]
                        }
                    }
                }),
                current: deserialize[6][0],
                hasNext: deserialize[6][1]
            },

            audits: {
                page: deserialize[7][2].map((page) => {
                    return {
                        user_id: page[0],
                        log_id: page[1],
                        log_reason: page[2],
                        log_timestamp: page[3]
                    }
                }),
                current: deserialize[7][0],
                hasNext: deserialize[7][1]
            }
        }

        return results as BranchMemberData
    }
}