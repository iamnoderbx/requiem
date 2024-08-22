import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { PlayerCommandType } from "../../types/PlayerCommandType";
import { Branches } from "shared/Branches";
import { BranchRankCommandType } from "../../types/BranchRankCommandType";
import { BaseEntity } from "server/entities/BaseEntity";
import { BranchCommandType } from "../../types/BranchCommandType";
import { NumberCommandType } from "../../types/NumberCommandType";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import { Players } from "@rbxts/services";

/**
 * ServerForceBranchRankCommand
 * Drops all data structures such as branchs.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "fillbranchusers", description: "Fill a branch with decoy data for testing." })
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
        { name: "branch", description: "The branch to fill data in.", type: BranchCommandType },
        { name: "amount", description: "The amount of decoy users to add.", type: NumberCommandType }
    ])
    command(interaction: CommandInteraction, branch: string[] | undefined, amount: number = 1): CommandResponse {
        if (!branch || branch.size() === 0) return interaction.error("No branch was specified.")

        const branch_upper = string.upper(branch[0]);

        const branchId = Branches.BranchType[branch_upper as keyof typeof Branches.BranchType];
        if (!branchId) return interaction.error("Invalid branch specified.");

        Promise.all([
            Promise.try(async () => {
                for (let i = 0; i < amount; i++) {
                    const username = Players.GetNameFromUserIdAsync(i + 95159112) || "Unknown User"
                    await BranchAPIServiceRunner.addBranchMember(branchId, i + 95159112, 1, username)
                }

                const player = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(interaction.getSender())
                player?.info("Successfully added " + amount + " decoy users to the branch.")
            })
        ])

        return interaction.reply("Successfully sent fill request.")
    }
}
