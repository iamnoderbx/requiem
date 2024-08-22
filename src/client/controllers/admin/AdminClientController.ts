import { BaseEntity } from "client/entities/BaseEntity";
import { CommandSharedSelectors } from "selectors/PermissionSharedSelectors";
import Commands, { ClientCommandStructure } from "shared/utilities/decorators/CommandDecorators";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { Memory } from "shared/utilities/memory.utilities";

const commands = Memory.createEmptySubscription("commands");

@Controller()
export class AdminClientController {
    // The private commands that the player has access to.
    private commands : ClientCommandStructure | undefined;

    /**
     * Gets the commands that the player has access to.
     * 
     * @returns ClientCommandStructure
     * 
     * @author NodeSupport
     */
    public getCommands() {
        return this.commands;
    }

    /**
     * Initializes the AdminClientController.
     * 
     * @returns void
     * 
     * @author NodeSupport
     */
    public initialize() {
        const onCommandsRegistered = (commands : ClientCommandStructure[]) => {
            if(this.commands || !commands) return;
            if(!commands[-1]) return;

            // Get the players permission level.
            BaseEntity.resolveClientEntity().then((entity) => {
                const permission = entity.getPermissionLevel();
                const unformatted = CommandSharedSelectors.getCommandRegistry(commands[-1]! as unknown as buffer);
                const formatted = CommandSharedSelectors.formatCommands(unformatted);
                
                // Filter all commands that the player does not have permission to use.
                const filtered = formatted.filter((command) => {
                    return command.permission.filter((perm) => perm === permission).size() > 0;
                })

                // Set the commands to the filtered list.
                this.commands = filtered;
            })
        }

        // Listen for changes to the commands.
        Memory.changed(commands, (value) => {
            if(!value) return;
            onCommandsRegistered(value as ClientCommandStructure[]);
        })

        // Set the commands to the subscription.
        onCommandsRegistered(commands.get() as ClientCommandStructure[])
    }
}