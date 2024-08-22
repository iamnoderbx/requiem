import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper"
import { CommandBufferStructure } from "shared/utilities/decorators/CommandDecorators"

export namespace CommandSharedSelectors {
    export const getPermissionLevel = (reader : buffer) => {
        return buffer.readu8(reader, 0)
    }

    export const getCommandRegistry = (reader : buffer) => {
        const wrapper = BufferWrapper()
        return wrapper.deserialize(reader) as CommandBufferStructure[]
    }

    export const formatCommands = (commands : CommandBufferStructure[]) => {
        return commands.map((command) => {
            return {
                name: command[0],
                description: command[1],
                permission: command[2],
                arguments: command[3].map((arg) => {
                    return {
                        name: arg[0],
                        description: arg[1],
                        type: arg[2]
                    }
                })
            }
        })
    };
}