import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export namespace UtilityArraySharedSelectors {
    export function getArray<T>(reader : buffer) {
        const wrapper = BufferWrapper()
        return wrapper.deserialize(reader) as T[]
    }
}