import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import TreasuryAPIServiceRunner from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";

/**
 * ServerDropTreasuriesCommand
 * Drops all data structures such as treasuries.
 * 
 * @export ServerDropTreasuriesCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "droptreasuries", description: "Drops all treasury data structures." })
export class ServerDropTreasuriesCommand {
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

        TreasuryAPIServiceRunner.reset().then(() => {
            player?.info("Successfully reset all treasury structures.")
        }).catch(() => {
            player?.error("Failed to reset all treasury structures.")
        })

        return interaction.reply("Attempting to reset all treasury structures.")
    }
}
