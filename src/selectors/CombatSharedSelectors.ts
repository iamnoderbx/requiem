export namespace CombatSharedSelectors {
    export const getEntityStunned = (reader : buffer) => {
        return buffer.readu8(reader, 0) === 1
    }

    export const getEntityBlocking = (reader : buffer) => {
        return buffer.readu8(reader, 1) === 1
    }

    export const getEntityCanBlock = (reader : buffer) => {
        return buffer.readu8(reader, 2) === 1
    }
}