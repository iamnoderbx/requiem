import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { BranchCommandType } from "../../types/BranchCommandType";
import { Branches } from "shared/Branches";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";

/**
 * ServerForceBranchUserCommand
 * Drops all data structures such as branchs.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "addbranchuser", description: "Forcefully add a user in to a given branch." })
export class ServerForceBranchUserCommand {
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
        {name: "branch", description: "The branch to add the player to.", type: BranchCommandType}
    ])
    command(interaction: CommandInteraction, targets: BasePlayerEntity[] | undefined, branch : string[] | undefined): CommandResponse {
        if(!targets || targets.size() === 0) return interaction.error("No player was specified.")
        if(!branch || branch.size() === 0) return interaction.error("No branch was specified.")

        const branch_upper = string.upper(branch[0]);

        const branchId = Branches.BranchType[branch_upper as keyof typeof Branches.BranchType];
        if(!branchId) return interaction.error("Invalid branch specified.");

        targets.forEach(async (player) => {
            player.getBranchService().addUserToBranch(branchId)
        })
        
        return interaction.reply("Successfully added the player to the branch.")
    }
}
