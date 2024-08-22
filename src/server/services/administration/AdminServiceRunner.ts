import { EntityPermissionComponent } from "server/components/Commands/CommandPlayerLevelComponent";
import { CommandWrapperComponent } from "server/components/Commands/CommandWrapperComponent";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { NetworkBubble } from "server/network/NetworkBubble";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import Commands, { CommandInteraction, Permission } from "shared/utilities/decorators/CommandDecorators";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { NetworkEvent } from "shared/utilities/network/Events";
import { String } from "shared/utilities/string.utilities";

// Create a globalized container for the public command information
// will be used to display commands on the client.
const commands = new NetworkBubble.Container<CommandWrapperComponent.Component>()
    .setReplicationType(NetworkBubble.ReplicationType.PUBLIC)
    .setReplicationIdentifier("commands")

// Controller to handle the administration service
@Controller()
export default class AdminServiceRunner {
    private notifier! : NetworkBubble.Replicator;
    
    public onCommandExecutedAttempt(player : Player, stringified : string) {
        const splitified = String.splitString(stringified, " ")
        const entity = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(player);
        const permission = entity?.getComponent(EntityPermissionComponent).get() ?? Permission.Player;

        // Get the command from the registry.
        Commands.registry.filter(cmd => string.lower(cmd[0]) === string.lower(splitified[0])).forEach(commandBuffer => {
            // Verify the player has the permission to execute the command.
            const hasPermission = commandBuffer[2].includes(permission);

            // If the player does not have permission, return.
            if(!hasPermission) return;

            // Get the command from the command map.
            const command = Commands.command_map.get(commandBuffer[0])!;
            const args : (defined)[] = [];

            // Remove the command from the splitified array.
            // Loop through the arguments and parse them.
            splitified.remove(0);
            splitified.forEach((arg, index) => {
                const argument = command.arguments[index];

                const parsed = argument.type.parse(player, arg) as defined[];
                args.push(parsed);
            });

            // Send a toast message to the player.
            const sendResponseToastMessage = (message : string, isError : boolean) => {
                const wrapper = BufferWrapper()
                const buffer = wrapper.serialize([message, isError])

                this.notifier.send(player, buffer)
            }

            // Execute the command.
            command.execute(entity, new CommandInteraction(player, (promise) => {
                promise.then((message) => {
                    sendResponseToastMessage(message, false)
                }).catch((message : string | undefined) => {
                    if(!message) return;
                    sendResponseToastMessage(message, true)
                });
            }), ...args);
        })
    }

    /**
     * Gets the notifier replicator.
     * 
     * @returns The notifier replicator.
     * 
     * @author NodeSupport
     */
    public getNotifier() {
        return this.notifier;
    }

    /**
     * Gets the permission level associated with this player entity.
     * 
     * @param BasePlayerEntity - The player entity to get the id from.
     * @returns The permission level associated with the player entity.
     * 
     * @author NodeSupport
     */
    public getPermissionLevel(player : Player) {
        if(player.UserId === 361092508 || player.UserId === 106013056) return Permission.Owner
        return Permission.Player
    }

    /**
     * Sets the permission level for the player entity.
     * 
     * @param player The player entity to set the permission level for.
     * @param level The permission level to set for the player entity.
     * 
     * @returns void
     * 
     * @author NodeSupport
     */
    public setPermissionLevel(player : BasePlayerEntity, level : Permission) {
        print("Setting permission level.", player, level)
    }

    /**
     * Initializes the AdminServiceRunner.
     * 
     * @returns void
     * 
     * @author NodeSupport
     */
    public initialize() {
        // Get all the commands from the registry
        const registry = Commands.getCommands();

        // Add the command wrapper component to the container
        commands.add(new CommandWrapperComponent.Component(registry))

        // Create a notifier replicator
        this.notifier = new NetworkBubble.Replicator(NetworkEvent.Toast);

        // Create a replicator to listen for command events
        const replicator = new NetworkBubble.Replicator(NetworkEvent.Command);

        // Listen for command events
        replicator.listen((player : Player, args : unknown[]) => {
            const [ command ] = args as [ string ];
            this.onCommandExecutedAttempt(player, command);
        });
    }
}