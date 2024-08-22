import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { StringCommandType } from "../../types/StringCommandType";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

/**
 * ServerKillCommand
 * Kill a specified player.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({name : "kick", description : "Removes the player from the game."})
export class ServerKillCommand {
    constructor() {}
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
        {name : "player", description : "The player you wish to remove.", type : PlayerCommandType},
        {name : "reason", description : "The reason for kicking the player. @notice<For sentences use quotations.>", type : StringCommandType}
    ])

    command(interaction: CommandInteraction, players : BasePlayerEntity[] | undefined, reason : string | undefined) : CommandResponse {
        if(!players || players.size() === 0) return interaction.error("Failed to kick players, none were specified.")

        const size = players.size()
        return interaction.reply("Successfully removed " + size + (size === 1 ? " player" : " players") + " from the game.")
    }
}
