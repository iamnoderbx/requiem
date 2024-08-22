export namespace MovementSharedSelectors {
    export const getEntityWalkspeed = (reader : buffer) => {
        return buffer.readf32(reader, 0)
    }

    export const getEntitySprintMultiplier = (reader : buffer) => {
        return buffer.readf32(reader, 4)
    }

    export const getEntityHumanoid = (reader : buffer) => {
        return buffer.readf32(reader, 8)
    }
}