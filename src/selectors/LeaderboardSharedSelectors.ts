export namespace LeaderboardSharedSelectors {
    export const getLeaderboardPlayerList = (state : defined) => {
        const casted = state as {value : Array<buffer>};
        if(!state || !casted.value) return [];
        
        const results : [number, number][] = [];
        
        casted.value.forEach((reader) => {
            const userid = buffer.readi32(reader, 0);
            const team = buffer.readi8(reader, 4);

            results.push([userid, team]);
        })

        return results
    }
}