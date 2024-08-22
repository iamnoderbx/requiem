import { Enchantment } from "shared/types/EnchantmentTypes"
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export namespace EnchantmentSharedSelectors {
    export const getEnchantments = (reader : buffer) => {
        const wrapper = BufferWrapper()
        return wrapper.deserialize(reader) as Enchantment.Type[]
    }
}