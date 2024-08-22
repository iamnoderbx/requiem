import { Keybinds } from "shared/Keybindings";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"

export namespace KeybindSharedSelectors {
    // Define the Category type
    export function getKeybinds(buffer : buffer) : Keybinds.Map {
        const keybinds = BufferWrapper().deserialize(buffer) as [[Keybinds.Category, [[string, string[]]]]]
        
        // Convert the keybinds to a map
        // [[Category, [[name, [key]]]]
        const keybindsMap : Keybinds.Serialized = keybinds.map(([category, keybinds]) => {
            return {
                category: category,
                keybinds: keybinds.map(([name, keys]) => {
                    return {
                        name,
                        keys
                    }
                })
            }
        })

        const result = Keybinds.Deserialize(keybindsMap)
        return result
    }
}