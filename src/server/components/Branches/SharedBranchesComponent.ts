import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { MemoryStoreService, MessagingService, Players } from "@rbxts/services";

import { BranchBufferData } from "selectors/BranchSharedSelectors";
import BranchAPIServiceRunner, { AddAuditResponse, BranchDetachmentType, BranchFromMemberResponse, GetAuditsResponse, GetBranchDetachmentResponse, GetBranchMembersResponse, GetBranchResponse, GetBranchTransfersResponse } from "server/entities/player/services/groups/BranchAPIServiceRunner";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { Branches } from "shared/Branches";
import PlayerBranchService from "server/entities/player/services/groups/PlayerBranchService";

// Create a memory service for the treasuries
const MemoryBranchHashmap = MemoryStoreService.GetHashMap("branches");

export type ExposedComponentData = BranchBufferData
export type BranchComponentData = Partial<BranchFromMemberResponse> & {
    firstPageCache?: GetBranchMembersResponse['members']
    detachments?: BranchDetachmentType[]
}

export namespace SharedBranchesComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export namespace CrossServerFunctionalities {
        export function forceUpdate(branch_id : number) {
            MessagingService.PublishAsync("branches_" + branch_id!, true)
        }
    }

    export class Container extends ComponentWrapper.Data implements ComponentData<SharedBranchesComponent.Component[]> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : SharedBranchesComponent.Component[] = [];
        
        constructor() {
            super(SharedBranchesComponent.Symbol)

            const serializable = this.serialize([])

            const wrapper = BufferWrapper()
            this.buffer = wrapper.serialize(serializable)

            this.state.createProperty(this.buffer)
        }
        
        /**
         * Serialize the data to be stored in the buffer
         * 
         * @param data The data to serialize
         * @returns { ExposedComponentData[] }
         * 
         * @author NodeSupport
         */
        public serialize(data : SharedBranchesComponent.Component[]) : ExposedComponentData[] {
            return data.map((v) => v.serialize(v.get()))
        }

        /**
         * Get the unserialized data from the container
         * @returns { SharedBranchComponent.Component[] }
         * 
         * @author NodeSupport
         */
        public get() : SharedBranchesComponent.Component[] {
            return this.unserialized
        }

        /**
         * Rewrite the buffer with new data, apply middleware and subscription listeners
         * Will communicate with the client to update the selectors
         * 
         * @param data The data to rewrite
         * @returns { buffer }
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : SharedBranchesComponent.Component[]) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            return this.buffer
        }
        
        /**
         * Add a branch to the container, apply middleware and subscription listeners
         * Adds middleware to the branch to listen for changes and update the container
         * 
         * @param branch The branch to add to the container
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public addBranch(branch : SharedBranchesComponent.Component) {
            // Add a branch to the container
            const current = this.get()

            // If the branch already exists, return
            if (current.find((v) => v.get().branch_id === branch.get().branch_id)) return

            // Wipe the current.
            current.clear();
            current.push(branch)

            // Rewrite the buffer with the new data
            this.rewrite(current)

            // Add a listener to the branch
            branch.middleware.apply(() => {
                this.rewrite(current)
            })
        }
    }

    export class Component extends ComponentWrapper.Data implements ComponentData<BranchComponentData> {
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        // This is a private field that is only used to store the value in a buffer
        private unserialized : BranchComponentData;
        private updated : number = tick();

        public detachments : BranchDetachmentType[] = [];
        private transfers : GetBranchTransfersResponse = [];

        
        public static branches: Map<number, SharedBranchesComponent.Component> = new Map();

        /**
         * Create a new branch component
         * @param data The data to store in the component
         */
        constructor(data : BranchComponentData) {
            super(SharedBranchesComponent.Symbol)

            // Serialize the data
            this.unserialized = data;
            this.buffer = this.rewrite(data);

            // MessagingService Subscription
            MessagingService.SubscribeAsync("branches_" + data.branch_id!, (message) => {
                this.reformat(false);
            })
        }

        /**
         * Serialize the data to be stored in the buffer
         * 
         * @param data The data to serialize
         * @returns { ExposedComponentData }
         * 
         * @author NodeSupport
         */
        public serialize(data: BranchComponentData): ExposedComponentData {
            const serializeBranch = (data: BranchComponentData) => {
                // Assuming branch_id, memberCount, and commander are always numbers or can be ensured to be numbers upstream.
                return [ data.branch_id!, data.name!, data.icon!, data.shout!, data.memberCount!, data.commander || 0];
            }

            const serializeDetachments = (data: BranchComponentData) => {
                return data.detachments!.map((v) => [v.detachment_id!, v.detachment_name!, v.r, v.g, v.b, v.players ?? 0, v.abbreviation]);
            };

            const serializeDetachment = (data: BranchDetachmentType) => {
                // Assuming detachment_id, r, g, b are always numbers or can be ensured to be numbers upstream.
                return [data.detachment_id!, data.detachment_name!, data.r, data.g, data.b, data.players ?? 0, data.abbreviation];
            }

            const serializePageCache = (data: GetBranchMembersResponse['members'])  => {
                return data.map((v) => [v.user_id, v.rank_id, v.username, serializeDetachment(v.detachment)]);
            }

            const serializeTransfers = (data: GetBranchTransfersResponse) => {
                return data.map((v) => [v.user_id, v.current_branch_id, v.target_branch_id]);
            };

            return [
                ...serializeBranch(data),
                serializePageCache(data.firstPageCache || []),
                serializeDetachments(data),
                serializeTransfers(this.transfers)
            ] as unknown as ExposedComponentData;
        }

        /**
         * Reformat the branch data with the
         * most recent data from the API
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async reformat(updateCrossServer : boolean = true) : Promise<void> {
            const data : GetBranchResponse = await BranchAPIServiceRunner.getBranch(tonumber(this.unserialized.branch_id)!);
            this.unserialized = data;

            // Get the home page cache
            // Query the first twenty members of the branch, for fast lookup later.
            const results = await BranchAPIServiceRunner.getBranchMembers(this.unserialized.branch_id!, 0, 20);
            this.setFirstPageCache(results);

            // Update the detachments
            this.detachments = await this.getBranchDetachments();
            this.rewrite(data, updateCrossServer);
        }

        /**
         * Updates the branch in the memory store with the most recent data
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        private async rewriteMemoryStore(updateCrossServer : boolean = false) : Promise<void> {
            MemoryBranchHashmap.SetAsync(tostring(this.unserialized.branch_id), this.unserialized, 180)
            updateCrossServer && MessagingService.PublishAsync("branches_" + this.unserialized.branch_id!, true)
        }

        /**
         * Rewrite the buffer with new data, apply middleware and subscription listeners
         * Will communicate with the client to update the selectors
         * 
         * @param data The data to rewrite
         * @returns { buffer }
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public rewrite(data : BranchComponentData = this.unserialized, updateCrossServer : boolean = false) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()

            // If the data is not present, use the current data
            if(!data.detachments && this.detachments) {
                data.detachments = this.detachments;
            }
            
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Serialize the data
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            // Update the branch in the memory store
            updateCrossServer && this.rewriteMemoryStore(updateCrossServer);

            // Check if the data has been updated
            if (tick() - this.updated > 20) {
                // Update the time the data was updated
                this.updated = tick()

                // Update the data with the most recent data
                this.reformat();
            }

            return this.buffer
        }

        /**
         * Get the audits for the branch at a specific page
         * 
         * @param page The page number
         * @param limit The limit of the page
         * @param audit_type The type of audit
         * @returns { Promise<GetAuditsResponse> }
         * 
         * @author NodeSupport
         */
        public async getBranchAuditLogs(page : number, limit : number, audit_type?: number) : Promise<GetAuditsResponse> {
            return BranchAPIServiceRunner.getAudits(this.unserialized.branch_id!, page, limit, audit_type);
        }

        public async addAuditLog(audit_type : number, user_id : number, data : string) : Promise<AddAuditResponse> {
            return BranchAPIServiceRunner.addAudit(user_id, this.unserialized.branch_id!, data, audit_type);
        }

        /**
         * Get the branch detachment data
         * 
         * @returns { Promise<BranchDetachmentType[]> }
         * 
         * @author NodeSupport
         */
        public async getBranchDetachments() : Promise<BranchDetachmentType[]> {
            // Get the branch detachment data
            const detachments = await BranchAPIServiceRunner.getBranchDetachments(this.unserialized.branch_id!);
            this.detachments = detachments.map((v) => {
                return {detachment_id: v.id, detachment_name: v.name, abbreviation: v.abbreviation,
                    r: v.r, g: v.g,  b: v.b, players: v.players
                }  
            });

            this.unserialized.detachments = this.detachments;

            return this.detachments;
        }

        /**
         * Get the branch transfers
         * 
         * @returns { Promise<GetBranchTransfersResponse> }
         * 
         * @author NodeSupport
         */
        public async getBranchTransfers(rewrite: boolean = false) : Promise<GetBranchTransfersResponse> {
            const transfers = await BranchAPIServiceRunner.getBranchTransfers(this.unserialized.branch_id!);
            const oldTransfersSize = this.transfers.size();

            this.transfers = transfers;
            if(oldTransfersSize === 0 || rewrite) this.rewrite(this.unserialized);

            return transfers;
        };

        /**
         * Accept a transfer request
         * 
         * @param userId The user ID to accept the transfer request of
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async acceptTransferRequest(userId : number, sender?: BasePlayerEntity) : Promise<void> {
            const targetTransfer = this.transfers.find((v) => v.user_id === userId);
            if(!targetTransfer) return;

            await BranchAPIServiceRunner.acceptBranchTransfer(userId, targetTransfer.target_branch_id);

            await this.getBranchTransfers(true);
            await this.reformat(true);

            const targetBranch = SharedBranchesComponent.Component.branches.get(targetTransfer.target_branch_id);
            if(sender) this.addAuditLog(Branches.AuditTypes.ACCEPT_TRANSFER, sender.getUserId(), `Accepted ` + Players.GetNameFromUserIdAsync(userId) + `'s transfer request from ${Branches.cleanBranchFromId(targetTransfer.target_branch_id)}.`);

            if(targetBranch) {
                await targetBranch.getBranchTransfers(true);
                await targetBranch.reformat(true);
            }
        }

        /**
         * Delete a transfer request
         * 
         * @param userId The user ID to delete the transfer request of
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async deleteTransferRequest(userId : number, sender?: BasePlayerEntity) : Promise<void> {
            const transfer = this.transfers.find((v) => v.user_id === userId);
            if(!transfer) return;

            await BranchAPIServiceRunner.deleteBranchTransfer(userId, transfer.current_branch_id, transfer.target_branch_id);
            await this.getBranchTransfers(true);

            if(sender) this.addAuditLog(Branches.AuditTypes.DECLINE_TRANSFER, sender.getUserId(), `Declined ` + Players.GetNameFromUserIdAsync(userId) + `'s transfer request from ${Branches.cleanBranchFromId(transfer.target_branch_id)}.`);


            const targetBranch = SharedBranchesComponent.Component.branches.get(transfer.target_branch_id);
            
            if(targetBranch) {
                await targetBranch.getBranchTransfers(true);
                await targetBranch.reformat(true);
            }

            return;
        }

        /**
         * Create a transfer request
         * 
         * @param userId The user ID to create the transfer request of
         * @returns { Promise<unknown> }
         * 
         * @throws { string } User is not in a branch
         * @throws { string } User is already in this branch
         * @throws { string } Transfer request already exists
         * 
         * @author NodeSupport
         */
        public async createTransferRequest(userId : number, sender?: BasePlayerEntity) : Promise<unknown> {
            // Get the users current branch
            const branch = await BranchAPIServiceRunner.getBranchFromMember(userId);
            const isUserInABranch = branch.branch_id;

            if(!isUserInABranch) return Promise.reject("User is not in a branch.");
            if(branch.branch_id === this.unserialized.branch_id) return Promise.reject("User is already in this branch.");

            // Check if a transfer request already exists
            const existingTransfer = this.transfers.find((v) => v.user_id === userId);
            if(existingTransfer) return Promise.reject("Transfer request already exists.");

            if(sender) this.addAuditLog(Branches.AuditTypes.REQUEST_TRANSFER, sender.getUserId(), `Requested a transfer of ` + Players.GetNameFromUserIdAsync(userId) + ` to the branch from the ${Branches.cleanBranchFromId(branch.branch_id)}.`);

            // Create a transfer request
            const response = await BranchAPIServiceRunner.addBranchTransfer(userId, branch.branch_id, this.unserialized.branch_id!);
            await this.getBranchTransfers(true);

            const targetBranch = SharedBranchesComponent.Component.branches.get(branch.branch_id);
            
            if(targetBranch) {
                await targetBranch.getBranchTransfers(true);
                await targetBranch.reformat(true);
            }

            return response;
        };

        /**
         * Assign a detachment to a user
         * 
         * @param userId The user ID to set the detachment of
         * @param args The name of the detachment
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async setUserDetachment(userId : number, args : unknown[], sender?: BasePlayerEntity) : Promise<void> {
            const detachment_name = args[0] as string;
            const detachment = this.detachments.find((v) => v.detachment_name === detachment_name);

            if(detachment_name === "None") {
                await BranchAPIServiceRunner.setMemberDetachment(this.unserialized.branch_id!, userId, -1);
                await this.reformat(true);

                if(sender) this.addAuditLog(Branches.AuditTypes.REMOVE_DETACHMENT, sender.getUserId(), `Removed ` + Players.GetNameFromUserIdAsync(userId) + ` from their detachment.`);
                
                return;
            }

            if(!detachment) return;
            if(sender) this.addAuditLog(Branches.AuditTypes.ASSIGNED_DETACHMENT, sender.getUserId(), `Assigned ` + Players.GetNameFromUserIdAsync(userId) + ` to the detachment ${detachment_name}.`);

            await BranchAPIServiceRunner.setMemberDetachment(this.unserialized.branch_id!, userId, detachment.detachment_id);
            await this.reformat(true);
        }

        /**
         * Add a detachment to the branch
         * 
         * @param args name, abbreviation, color
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async createDetachment(args : unknown[], sender?: BasePlayerEntity) : Promise<void> {
            const name = args[0] as string;
            const abbreviation = args[1] as string;
            const color = args[2] as Color3;

            // Create the detachment
            await BranchAPIServiceRunner.createBranchDetachment(this.unserialized.branch_id!, name, abbreviation, color.R, color.G, color.B);
            await this.reformat(true);

            if(sender) this.addAuditLog(Branches.AuditTypes.CREATE_DETACHMENT, sender.getUserId(), `Created the detachment ${name} with the abbreviation ${abbreviation}.`);
        }

        /**
         * Delete a detachment from the branch
         * 
         * @param detachment_id Detachment ID
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async deleteDetachment(detachment_id : number, sender?: BasePlayerEntity) : Promise<void> {
            const old_detachment = this.detachments.find((v) => v.detachment_id === detachment_id);

            // Delete the detachment
            await BranchAPIServiceRunner.deleteBranchDetachment(detachment_id);
            await this.reformat(true);

            if(sender) this.addAuditLog(Branches.AuditTypes.DELETE_DETACHMENT, sender.getUserId(), `Deleted the detachment ${old_detachment?.detachment_name ?? "unknown"}`);
        }

        /**
         * Remove a user from the branch
         * 
         * @param userId The user ID to add to the branch
         * @returns Promise<void>
         * 
         * @author NodeSupport
         */
        public async removeUserFromBranch(userId : number, sender?: BasePlayerEntity) : Promise<void> {
            const player = Players.GetPlayerByUserId(userId);
            if(player) {
                const component = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(player);
                if(!component) return;

                component.getBranchService().removeUserFromBranch().then(() => {
                    component.info("You have been exiled from your branch.")
                });
            } else {
                await BranchAPIServiceRunner.removeBranchMember(this.unserialized.branch_id!, userId);
                await this.reformat(true);
            }

            if(sender) this.addAuditLog(Branches.AuditTypes.EXILE_USER, sender.getUserId(), `Exiled ${Players.GetNameFromUserIdAsync(userId)} from the branch.`);
        }

        /**
         * Ranks a user in the branch
         * 
         * @param userId The user ID to rank in the branch
         * @param rank_id The rank ID to set the user to
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async setUserRank(userId : number, rank_id : number, sender?: BasePlayerEntity) : Promise<void> {
            const player = Players.GetPlayerByUserId(userId);

            const currentBranchUser = await BranchAPIServiceRunner.getBranchMember(userId);
            if(!currentBranchUser) return;

            const isPromotion = currentBranchUser.rank_id < rank_id;
            if(sender && isPromotion) this.addAuditLog(Branches.AuditTypes.PROMOTE_USER, sender.getUserId(), `Promoted ${Players.GetNameFromUserIdAsync(userId)} to the rank ${Branches.getRankFromId(rank_id)}.`);
            else if(sender) this.addAuditLog(Branches.AuditTypes.DEMOTE_USER, sender.getUserId(), `Demoted ${Players.GetNameFromUserIdAsync(userId)} to the rank ${Branches.getRankFromId(rank_id)}.`);

            if(player) {
                const component = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(player);
                if(!component) return;

                component.getBranchService().setUserBranchRank(rank_id, true).then(() => {
                    component.info("You have been promoted to " + Branches.getRankFromId(rank_id) + ".")
                });
            } else {
                await BranchAPIServiceRunner.setBranchRank(this.unserialized.branch_id!, userId, rank_id)
                await this.reformat(true);
            }

        };

        public async getBranchMemberPage(page : number, rank_id?: number, search?: string, limit?: number) : Promise<GetBranchMembersResponse> {
            const results = await BranchAPIServiceRunner.getBranchMembers(this.unserialized.branch_id!, page, limit ?? 20, rank_id, search);
            return results
        }

        /**
         * Update the first page cache for the branch
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async updateFirstPageCache(shouldRewrite : boolean = true, updateCrossServer : boolean = false) : Promise<void> {
            // Get the home page cache
            // Query the first twenty members of the branch, for fast lookup later.
            const results = await BranchAPIServiceRunner.getBranchMembers(this.unserialized.branch_id!, 0, 20);
            this.setFirstPageCache(results);
            
            shouldRewrite && this.rewrite(this.unserialized, updateCrossServer);
        }

        /**
         * Set the first page cache for the branch
         * 
         * @param data The data to set as the first page cache
         * 
         * @returns { void }
         */
        public setFirstPageCache(data : GetBranchMembersResponse) : void {
            // Set the first page cache
            this.unserialized.firstPageCache = data.members;
        }

        /**
         * Get the unserialized data from the container
         * 
         * @returns { BranchComponentData }
         * 
         * @author NodeSupport
         */
        public get() : BranchComponentData {
            return this.unserialized
        }

        /**
         * Convert the buffer to a string
         * 
         * @returns { string }
         * 
         * @author NodeSupport
         */
        public toBufferString() : string {
            return buffer.tostring(this.buffer)
        }
    }
}

