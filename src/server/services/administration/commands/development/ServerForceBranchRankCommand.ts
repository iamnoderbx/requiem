import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { BranchCommandType } from "../../types/BranchCommandType";
import { Branches } from "shared/Branches";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import { BranchRankCommandType } from "../../types/BranchRankCommandType";
import { BaseEntity } from "server/entities/BaseEntity";
import { String } from "shared/utilities/string.utilities";

/**
 * ServerForceBranchRankCommand
 * Drops all data structures such as branchs.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "rankbranchuser", description: "Forcefully rank a user in their branch." })
export class ServerForceBranchRankCommand {
    constructor() { }
    /**
     * The root executor for the command. No groups are needed.
     * 
     * @param interaction The command interaction.
     * @param player The player to add to the branch.
     * @param branch The branch to add the player to.
     * 
     * @author NodeSupport
     */

    @Commands.Guard([Permission.Owner])
    @Commands.Arguments([
        {name: "player", description: "The player to add to the branch.", type: PlayerCommandType},
        {name: "rank", description: "The rank to set the player to.", type: BranchRankCommandType}
    ])
    command(interaction: CommandInteraction, targets: BasePlayerEntity[] | undefined, rank : string[] | undefined): CommandResponse {
        const sender = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(interaction.getSender())

        if(!targets || targets.size() === 0) return interaction.error("No player was specified.")
        if(!rank || rank.size() === 0) return interaction.error("No branch was specified.")

        const rank_upper = string.upper(rank[0]);
        const rank_id = Branches.BranchRank[rank_upper as keyof typeof Branches.BranchRank];

        if(!rank_id) return interaction.error("Invalid branch specified.");

        targets.forEach((player) => {
            player.getBranchService().setUserBranchRank(rank_id, true).then((response) => {
                sender?.info(response)
            }).catch((err) => {
                sender?.error(err)
            })
        })
        
        return interaction.reply("Successfully sent promotion request.")
    }
}
