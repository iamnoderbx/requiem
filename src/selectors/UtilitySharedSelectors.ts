export namespace UtilitySharedSelectors {
    // Get a string from the buffer
    export const getString = (reader : buffer) => {
        const length = buffer.readu32(reader, 0)
        return buffer.readstring(reader, 4, length)
    }

    // Get a number from the buffer
    export const getNumber = (reader : buffer) => {
        // Read the type from the first byte of the buffer
        const numType = buffer.readu8(reader, 0)

        // Read the value from the buffer based on the type
        if(numType === 1) return buffer.readu8(reader, 1) // u8
        else if(numType === 2) return buffer.readu16(reader, 1) // u16
        else return buffer.readu32(reader, 1) // u32
    }

    // Get a boolean from the buffer
    export const getBoolean = (reader : buffer) => {
        return buffer.readu8(reader, 0) === 1
    }
    
    // Get a float from the buffer
    export const getFloat = (reader : buffer) => {
        return buffer.readf32(reader, 0)
    }

    // Get a Vector3 from the buffer
    export const getVector3 = (reader : buffer) => {
        return new Vector3( // Create a new Vector3 from the buffer
            buffer.readf32(reader, 0),
            buffer.readf32(reader, 4),
            buffer.readf32(reader, 8)
        )
    }
}