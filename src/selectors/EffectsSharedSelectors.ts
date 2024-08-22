export namespace EffectsSharedSelectors {
    export const getEntityFlashing = (reader : buffer) => {
        return buffer.readu8(reader, 0) === 1
    }
    
    export const getEntityEffects = (reader : buffer) => {
        return {
            flash: getEntityFlashing(reader)
        }
    }
}