import Object from "@rbxts/object-utils";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import BranchAPIServiceRunner from "server/entities/player/services/groups/BranchAPIServiceRunner";
import ReputationAPIServiceRunner from "server/entities/player/services/reputation/ReputationAPIServiceRunner";
import TreasuryAPIServiceRunner from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";
import { Branches } from "shared/Branches";
import { Locations } from "shared/types/Locations";
import { TeamUtilities, Teams } from "shared/types/Teams";
import { Treasury } from "shared/types/Treasury";
import Commands, { CommandInteraction, CommandResponse, Permission } from "shared/utilities/decorators/CommandDecorators";
import { String } from "shared/utilities/string.utilities";

/**
 * ServerInitializeCommand
 * Creates all data structures such as branchs.
 * 
 * @export ServerKillCommand
 * 
 * @author NodeSupport
 */
@Commands.Command({ name: "initall", description: "Creates all data structures such as branchs." })
export class ServerInitializeCommand {
    private static readonly Branches = [
        Branches.BranchType.SCOUTING_LEGION,
        Branches.BranchType.MILITARY_POLICE,
        Branches.BranchType.STATIONARY_GUARD,
    ]

    private static readonly DefaultShouts : { [key: number] : string } = {
        [Branches.BranchType.SCOUTING_LEGION]: "We stand strong, as the unknown lurks, we will prevail.",
        [Branches.BranchType.MILITARY_POLICE]: "Order is the key to peace. We will maintain it at all costs.",
        [Branches.BranchType.STATIONARY_GUARD]: "Guarding the walls, we will protect humanity from all threats.",
    }

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
    @Commands.Arguments([])

    command(interaction: CommandInteraction): CommandResponse {
        const player = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(interaction.getSender())
        if(!player) return interaction.error("Failed to resolve the player.")
        
        new Promise(async (resolve, reject) => {
            for(const branch_id of Object.keys(ServerInitializeCommand.Branches)) {
                
                const [ success, res ] = BranchAPIServiceRunner.getBranch(branch_id).catch(() => {}).await();

                if(res !== undefined) {
                    player.info("Branch " + Branches.BranchType[branch_id] + " already exists, skipping.")
                    continue;
                }

                const name = Branches.BranchType[branch_id];
                const formatted = String.CapitalizeAllFirstLetters(string.lower(name));

                player.info("Branch " + formatted + " does not exist, creating it.")

                const icon = TeamUtilities.getBranchIcon(branch_id);
                await BranchAPIServiceRunner.createBranch(formatted, icon, ServerInitializeCommand.DefaultShouts[branch_id]);

                player.info("Branch " + formatted + " created.")

                // Create the ranks
                for(const key of Object.keys(Branches.BranchRank)) {
                    const rank = Branches.BranchRank[key];
                    const rankName = String.CapitalizeAllFirstLetters(string.lower(Branches.BranchRank[rank]));

                    await BranchAPIServiceRunner.createBranchRank(rank, branch_id, rankName, rank * 100)
                }

                player.info("Branch " + formatted + " ranks created.")

                // Create the treasury.
                const treasury = await TreasuryAPIServiceRunner.createTreasury(player.getUserId(), Treasury.Type.BRANCH, formatted + " Treasury", Locations.ROYAL_PALACE)
                await BranchAPIServiceRunner.updateBranchTreasury(branch_id, treasury.treasuryID);

                player.info("Branch " + formatted + " treasury created.")
            }

            for(const location of Object.keys(Locations)) {
                const formatted = String.CapitalizeAllFirstLetters(string.lower(location));
                player.info("Creating location for " + formatted + ".")

                await ReputationAPIServiceRunner.createLocation(location, 0, 1000, 100, 50, 50, 0, 10, 10, 100)

                const data = await ReputationAPIServiceRunner.getLocation(location, 0);

                player.info("Creating reputation factors for " + formatted + ".")
                
                await ReputationAPIServiceRunner.addReputation("Scouting Legion", 0, 50, data.id);
                await ReputationAPIServiceRunner.addReputation("Military Police", 0, 60, data.id);
                await ReputationAPIServiceRunner.addReputation("Stationary Guard", 0, 70, data.id);
            }
        })

        return interaction.reply("Successfully initialized all data structures.")
    }
}
