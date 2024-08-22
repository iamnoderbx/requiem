import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import ReputationAPIServiceRunner from "server/entities/player/services/reputation/ReputationAPIServiceRunner";
import { Branches } from "shared/Branches";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";

/**
 * ServerDropReputationsCommand
 * Drops all data structures such as reputations.
 * 
 * @export ServerDropReputationsCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "dropreputations", description: "Drops all data structures such as reputations." })
export class ServerDropReputationsCommand {
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

        ReputationAPIServiceRunner.reset().then(() => {
            player?.info("Successfully reset all reputations.")
        }).catch(() => {
            player?.error("Failed to reset all reputations.")
        })

        return interaction.reply("Attempting to reset all data structures.")
    }
}
