import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

/**
 * ServerKillCommand
 * Kill a specified player.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "kill", description: "Sets the players health to 0." })
export class ServerKillCommand {
    constructor() { }
    /**
     * The root executor for the command. No groups are needed.
     * 
     * @param interaction The command interaction.
     * @param player The player to kill.
     * 
     * @author NodeSupport
     */

    @Commands.Guard([Permission.Owner])
    @Commands.Arguments([
        { name: "player", description: "The player to kill.", type: PlayerCommandType }
    ])

    command(interaction: CommandInteraction, players: BasePlayerEntity[] | undefined): CommandResponse {
        if (!players || players.size() === 0) return interaction.error("Failed to kill players, none were specified.")

        players.forEach(player => {
            // Set the health to 0
            const health = player.getCharacter().getHealthComponent()
            health.kill().catch(() => interaction.error("Failed to kill player " + player.getName()));
        })

        const size = players.size()
        return interaction.reply("Successfully reduced " + size + (size === 1 ? " players" : " players'") + " health to zero.")
    }
}
