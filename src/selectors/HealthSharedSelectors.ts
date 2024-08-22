export namespace HealthSharedSelectors {
    export const getHealth = (reader : buffer) => {
        return buffer.readf32(reader, 0)
    }
}