import { BranchComponentData, SharedBranchesComponent } from "server/components/Branches/SharedBranchesComponent";
import { BasePlayerEntity } from "../../BasePlayerEntity";
import BranchAPIServiceRunner, { BranchFromMemberResponse, GetBranchMemberResponse, GetBranchMembersResponse } from "./BranchAPIServiceRunner";
import { BranchMemberComponent } from "server/components/Branches/BranchMemberComponent";
import { String } from "shared/utilities/string.utilities";
import { Branches } from "shared/Branches";
import { BranchMemberActions, PlayerActions } from "shared/utilities/network/Events";

export default class PlayerBranchService {
    private container : SharedBranchesComponent.Container = new SharedBranchesComponent.Container();
    private member! : BranchMemberComponent.Component

    constructor(private player : BasePlayerEntity) {}

    /**
     * Create a branch component for all players if it
     * does not yet exist.
     * 
     * @param branch The branch to create
     * 
     * @author NodeSupport
     */
    private async createBranch(branch : BranchFromMemberResponse) {
        // Create the branch component
        const component = new SharedBranchesComponent.Component(branch);
        component?.updateFirstPageCache(true);

        // Set the detachments
        component.detachments = await component?.getBranchDetachments();
        component.rewrite();

        this.container.addBranch(component);

        // Set the branch to the branches map
        SharedBranchesComponent.Component.branches.set(branch.branch_id, component);
    }

    /**
     * Remove the user from the branch.
     * Forcefully reformat the branch for the player, and rewrite the branch.
     * 
     * @returns { Promise<string> }
     * 
     * @throws {string} If the player could not be removed from the branch
     * @throws {string} If the branch could not be found
     * @throws {string} If the branch could not be rewritten
     * 
     * @author NodeSupport
     */
    public removeUserFromBranch() : Promise<string> {
        return new Promise((resolve, reject) => {
            // Get the branch from the member
            BranchAPIServiceRunner.getBranchFromMember(this.player.getUserId()).then((branch) => {
                // Remove the user from the branch
                BranchAPIServiceRunner.removeBranchMember(branch.branch_id, this.player.getUserId()).then(async () => {
                    // Get the member from the branch
                    const member = await BranchAPIServiceRunner.getBranchMember(this.player.getUserId());
                    const branch = SharedBranchesComponent.Component.branches.get(member.branch_id);

                    // If the branch does not exist, reject
                    if(!branch) return reject("Failed to rewrite the branch for the player.");
                    if(this.member) this.member.rewrite(member);

                    // Reformat the branch
                    await branch?.reformat(true);

                    // Resolve the promise
                    resolve("Successfully removed the player from the branch.");
                }).catch(() => {
                    // Could not remove the player from the branch
                    reject("Failed to remove the player from the branch.")
                })
            }).catch(() => {
                // Could not get the branch for the player
                reject("Failed to get the branch for the player.")
            })
        });
    }

    /**
     * Sets the users rank in the branch.
     * 
     * @param rank_id The rank ID to set the player to
     * @param force_reformat Whether to reformat the branch after setting the rank
     * @returns { Promise<string> }
     * 
     * @throws {string} If the player could not be ranked in the branch
     * @throws {string} If the branch could not be found
     * @throws {string} If the branch could not be rewritten
     * 
     * @author NodeSupport
     */
    public setUserBranchRank(rank_id : number, force_reformat: boolean = false) : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            // Get the branch from the member
            BranchAPIServiceRunner.getBranchFromMember(this.player.getUserId()).then((branch) => {
                // Set the branch rank
                BranchAPIServiceRunner.setBranchRank(branch.branch_id, this.player.getUserId(), rank_id).then(async () => {
                    // Get the rank name
                    const rank_upper = Branches.BranchRank[rank_id];

                    // Get the member from the branch
                    const member = await BranchAPIServiceRunner.getBranchMember(this.player.getUserId());
                    const branch = SharedBranchesComponent.Component.branches.get(member.branch_id);

                    // If the branch does not exist, reject
                    if(!branch) return reject("Failed to rewrite the branch for the player.");
                    if(this.member) this.member.rewrite(member);

                    // Reformat the branch if needed
                    if(force_reformat) await branch?.reformat(true);

                    // Resolve the promise
                    resolve("Successfully ranked the player to " + String.CapitalizeAllFirstLetters(string.lower(rank_upper)) + " in the branch.");
                }).catch(() => {
                    // Could not rank the player in the branch
                    reject("Failed to rank the player in the branch.")
                })
            }).catch(() => {
                // Could not get the branch for the player
                reject("Failed to get the branch for the player.")
            })
        });
    }

    /**
     * Adds a user to a branch
     * 
     * @param branch_id The branch ID to add the player to
     * 
     * @author NodeSupport
     */
    public async addUserToBranch(branch_id : number) {
        // Get the branch data
        let branch_data : BranchComponentData | undefined = SharedBranchesComponent.Component.branches.get(branch_id)?.get()

        // If the branch does not exist, create it
        if(!branch_data) {
            const branch = await BranchAPIServiceRunner.getBranch(branch_id);
            if(branch.branch_id) await this.createBranch(branch);
        }

        // Get the branch data
        branch_data = SharedBranchesComponent.Component.branches.get(branch_id)!.get()!;

        // Check if the user is in a branch already
        const [ success, old_branch ] = BranchAPIServiceRunner.getBranchFromMember(this.player.getUserId()).await() as LuaTuple<[boolean, BranchFromMemberResponse]>;
        
        // Add the user to the branch
        BranchAPIServiceRunner.addBranchMember(branch_data.branch_id!, this.player.getUserId(), 1, this.player.getName()).catch(async () => {
            return Promise.reject("Failed to add user to branch.");
        }).then(async () => {
            // Get the branch data
            const branch = SharedBranchesComponent.Component.branches.get(branch_data!.branch_id!);
            this.container.addBranch(branch!);

            // Update the first page cache
            branch?.updateFirstPageCache(true, true);

            // Forcefully update the old branch
            success && SharedBranchesComponent.CrossServerFunctionalities.forceUpdate(old_branch.branch_id);

            // Get the member from the branch
            const member = await BranchAPIServiceRunner.getBranchMember(this.player.getUserId());
            const paginatedMember = member as GetBranchMemberResponse & { pagination: GetBranchMembersResponse['members']  };

            // Reform the member to have the pagination data
            paginatedMember.pagination = branch?.get().firstPageCache || paginatedMember.pagination;

            this.member.setUserBranchAssociation(branch);
            if(this.member) this.member.rewrite(paginatedMember);
        })
    }

    /**
     * Initialize the branches for the player.
     * 
     * @returns { Promise<string> }
     * 
     * @author NodeSupport
     */
    public initialize() : Promise<string> {
        this.player.getNetwork().listen(PlayerActions.Branch, async (action, argument, argument2, ...args : unknown[]) => {
            switch (action) {
                case BranchMemberActions.Pagination: return this.member?.paginate(argument as number);
                case BranchMemberActions.Search: return this.member?.setPaginationSearch(argument as string);
                case BranchMemberActions.Filter: return this.member?.setRankFilter(argument as string);
                case BranchMemberActions.Limit: return this.member?.setPaginationLimit(argument as number);
                case BranchMemberActions.Rank: return this.member?.setTargetRank(this.player, argument as string, argument2 as number);
                case BranchMemberActions.Audits: return this.member?.getBranchAudits();
                case BranchMemberActions.AuditsPagination: return this.member?.paginateAudits(argument as number);
                case BranchMemberActions.AuditsFilter: return this.member?.setAuditFilter(argument as number);
                case BranchMemberActions.Action: return this.member?.performAction(this.player, argument as string, argument2 as number, args).catch((message : string) => {
                    this.player.error(message);
                });
            }
        });
        
        return new Promise(async (resolve, reject) => {
            const branch = await BranchAPIServiceRunner.getBranchFromMember(this.player.getUserId())
            if(branch.branch_id && !SharedBranchesComponent.Component.branches.get(branch.branch_id)) await this.createBranch(branch);

            branch.branch_id && this.container.addBranch(SharedBranchesComponent.Component.branches.get(branch.branch_id)!);
            this.player.addComponent(this.container);

            const [ success, memberData ] = BranchAPIServiceRunner.getBranchMember(this.player.getUserId()).await() as LuaTuple<[boolean, GetBranchMemberResponse]>;

            const member : GetBranchMemberResponse = (branch && success) ? memberData : {
                branch_id: 0, detachment: {detachment_id: -1, detachment_name: "None", r: 0, g: 0, b: 0, abbreviation: "N/A", players: 0},
                rank: "None", rank_id: 0,
                user_id: this.player.getUserId(),
                username: this.player.getName(),
                wage: 0
            };

            const paginatedMember = member as GetBranchMemberResponse & { pagination: GetBranchMembersResponse['members']  };
            const component = new BranchMemberComponent.Component(paginatedMember);

            if(SharedBranchesComponent.Component.branches.get(branch.branch_id))
                component.setUserBranchAssociation(SharedBranchesComponent.Component.branches.get(branch.branch_id));

            this.player.addComponent(component);
            this.member = component;

            resolve("Successfully initialized the branches for the player.");
        })
    }
}