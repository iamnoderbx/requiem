import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { ComponentWrapper, ComponentData } from "../ComponentDataWrapper";
import { AttachSubscriptionListener } from "../ComponentListeners";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { GetAuditsResponse, GetBranchMemberResponse, GetBranchMembersResponse } from "server/entities/player/services/groups/BranchAPIServiceRunner";
import { BranchMemberBufferData } from "selectors/BranchMemberSelector";
import PlayerBranchService from "server/entities/player/services/groups/PlayerBranchService";
import { SharedBranchesComponent } from "./SharedBranchesComponent";
import { Branches } from "shared/Branches";
import { String } from "shared/utilities/string.utilities";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

export type ExposedMemberData = BranchMemberBufferData;
export type BranchMemberData = GetBranchMemberResponse & {
    pagination? : GetBranchMembersResponse['members']
};

export namespace BranchMemberComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Component extends ComponentWrapper.Data implements ComponentData<BranchMemberData> {
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private branch : SharedBranchesComponent.Component | undefined;
        private unserialized : BranchMemberData;
        
        // Member Pagination
        private page : number = 0;
        private pages : number = -1;
        private limit : number = 20;

        private search : string | undefined;
        private rank : number | undefined;

        private pagination : BranchMemberData['pagination'] | undefined;

        // Audit Pagination
        private audit_page : number = 0;
        private audit_pages : number = -1;
        private audit_limit : number = 11;
        private audit_filter : number | undefined;
        private audit_data : GetAuditsResponse['logs'] | undefined;

        /**
         * Create a new branch component
         * @param data The data to store in the component
         */
        constructor(data : BranchMemberData) {
            super(BranchMemberComponent.Symbol)

            // Serialize the data
            this.unserialized = data;
            this.buffer = this.rewrite(data);
        }

        /**
         * Serialize the data to be stored in the buffer
         * 
         * @param data The data to serialize
         * @returns { ExposedComponentData }
         * 
         * @author NodeSupport
         */
        public serialize(data : BranchMemberData) : ExposedMemberData {
            return [
                // Basic branch data & detachment data.
                data.branch_id, data.rank_id, data.rank, data.username, data.wage, 
                [data.detachment.detachment_id, data.detachment.detachment_name, data.detachment.r, data.detachment.g, data.detachment.b, data.detachment.players ?? 0, data.detachment.abbreviation],
                
                // Pagination data
                [this.page, (this.pages - 1) !== this.page, this.pagination?.map((page) => [
                    page.branch_id, page.rank_id, page.user_id, page.username,
                    [page.detachment.detachment_id, page.detachment.detachment_name, page.detachment.r, page.detachment.g, page.detachment.b, page.detachment.players ?? 0, page.detachment.abbreviation]
                ]) || []],

                // Audit data
                [this.audit_page, (this.audit_pages - 1) !== this.audit_page, this.audit_data?.map((page) => [
                    page.user_id, page.audit_type, page.log, page.timestamp
                ]) || []]
            ]
        }

        /**
         * Get the unserialized data from the container
         * @returns { SharedBranchComponent.Component[] }
         * 
         * @author NodeSupport
         */
        public get() : BranchMemberData {
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
        public rewrite(data : BranchMemberData) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()

            // Store the unserialized data
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Serialize the data
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            // Return the buffer
            return this.buffer
        }

        public performAction(sender : BasePlayerEntity, action : string, userId : number, args : unknown[]) : Promise<void> {
            return new Promise((resolve, reject) => {
                if(userId === this.unserialized.user_id) return reject("You cannot perform actions on yourself");
                if(this.unserialized.rank_id < Branches.getRankFromCleanString("LIEUTENANT")) return reject("You do not have permission to perform this action");

                // Get the targets rank
                const target_rank = this.pagination?.find((member) => member.user_id === userId)?.rank_id;
                if((target_rank ?? 0) >= this.unserialized.rank_id) return reject("You do not have permission to perform this action");

                const performAction = async (action : string) => {
                    if(!this.branch) return;

                    switch(action) {
                        case "Exile User": return await this.branch.removeUserFromBranch(userId, sender)
                        case "Create Detachment" : return await this.branch.createDetachment(args, sender)
                        case "Delete Detachment" : return await this.branch.deleteDetachment(userId, sender)
                        case "Set User Detachment" : return await this.branch.setUserDetachment(userId, args, sender)
                        case "Transfers" : return await this.branch.getBranchTransfers()
                        case "Request Transfer" : return await this.branch.createTransferRequest(userId, sender)
                        case "Delete Transfer" : return await this.branch.deleteTransferRequest(userId, sender)
                        case "Accept Transfer" : return await this.branch.acceptTransferRequest(userId, sender)
                    }
                }

                performAction(action).then(() => {
                    this.paginate(this.page);
                    resolve();
                }).catch((err : string) => {
                    const filtered = String.FilterTracebackFromString(err);
                    reject(filtered);
                });
            })
        }

        public getBranchAudits() : void {
            if(!this.branch) return;

            this.branch.getBranchAuditLogs(this.audit_page, this.audit_limit, this.audit_filter).then((pagination) => {
                this.audit_pages = pagination.pages;
                this.audit_data = pagination.logs;

                this.rewrite(this.unserialized);
            });
        }

        public paginateAudits(page : number) : void {
            if(!this.branch) return;

            this.audit_page = page;
            this.getBranchAudits();
        }

        public setAuditFilter(filter : number) : void {
            if(this.audit_filter === filter) return;

            if(!filter || filter === 0) this.audit_filter = undefined;
            else this.audit_filter = filter;
            
            this.getBranchAudits();
        }   

        public setTargetRank(sender : BasePlayerEntity, rank : string, userId : number) : void {
            if(!this.branch) return;

            const rankId = Branches.getRankFromCleanString(rank);
            if(!rankId) return

            if(userId === this.unserialized.user_id) return;
            if(rankId >= this.unserialized.rank_id) return;

            this.branch.setUserRank(userId, rankId, sender).then(() => {
                this.paginate(this.page);
            })
        }

        public setPaginationLimit(limit : number) : void {
            if(this.limit === limit) return;

            this.limit = limit;
            this.paginate(0);
        }

        public setRankFilter(rank : string) : void {
            if(!this.branch) return;

            const rankId = Branches.getRankFromCleanString(rank);
            if(this.rank === rankId) return;

            this.rank = rankId;
            this.paginate(0);
        }

        public setPaginationSearch(name : string) : void {
            if(this.search === name) return;

            if(name === "") this.search = undefined
            else this.search = name;
            
            this.paginate(0);
        }

        public async paginate(page : number) : Promise<void> {
            if(!this.branch) return;

            const pagination = await this.branch.getBranchMemberPage(page, this.rank, this.search, this.limit);
            
            if(!pagination) {

                this.page = page;
                this.pages = 0;
                this.pagination = [];
                this.rewrite(this.unserialized);

                return;
            }

            this.page = page;
            this.pages = pagination.totalPages;
            
            this.pagination = pagination.members;
            this.rewrite(this.unserialized);
        }
        
        /**
         * Update the internal branch variable for later use.
         * 
         * @param branch Set the branch association for the user
         * @returns { void }
         * 
         * @author NodeSupport
         */
        public setUserBranchAssociation(branch : SharedBranchesComponent.Component | undefined) : void {
            this.branch = branch;

            if(!branch) return;

            this.pagination = branch.get().firstPageCache;
            this.rewrite(this.unserialized);
        }
    }
    
}