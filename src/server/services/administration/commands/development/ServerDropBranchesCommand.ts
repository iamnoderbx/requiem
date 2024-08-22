import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import { Branches } from "shared/Branches";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";

/**
 * ServerDropBranchesCommand
 * Drops all data structures such as branchs.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "dropbranches", description: "Drops all data structures such as branchs." })
export class ServerDropBranchesCommand {
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

        BranchAPIServiceRunner.reset().then(() => {
            player?.info("Successfully reset all data structures.")
        }).catch(() => {
            player?.error("Failed to reset all data structures.")
        })

        return interaction.reply("Attempting to reset all data structures.")
    }
}
