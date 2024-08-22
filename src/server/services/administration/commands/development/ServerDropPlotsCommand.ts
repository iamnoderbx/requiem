import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import PlotsAPIServiceRunner from "server/entities/player/services/plots/PlotAPIServiceRunner";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";

/**
 * ServerDropPlotsCommand
 * Drops all data structures such as plots.
 * 
 * @export ServerDropPlotsCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "dropplots", description: "Drops all data structures such as plots." })
export class ServerDropPlotsCommand {
    constructor() { }
    /**
     * The root executor for the command. No groups are needed.
     * 
     * @param interaction The command interaction.
     * 
     * @author NodeSupport
     */

    @Commands.Guard([Permission.Owner])
    @Commands.Arguments([])
    command(interaction: CommandInteraction): CommandResponse {
        const player = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(interaction.getSender())

        PlotsAPIServiceRunner.reset().then(() => {
            player?.info("Successfully reset all data structures.")
        }).catch(() => {
            player?.error("Failed to reset all data structures.")
        })

        return interaction.reply("Attempting to reset all data structures.")
    }
}
