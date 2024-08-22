import { ComponentData, ComponentWrapper } from "../ComponentDataWrapper";
import { AttachMiddlewareListener } from "../ComponentMiddleware";
import { NetworkBubble } from "server/network/NetworkBubble";
import { AttachSubscriptionListener } from "../ComponentListeners";
import BufferWrapper from "shared/utilities/BufferWrapper/BufferWrapper";
import { MemoryStoreService, Workspace } from "@rbxts/services";
import TreasuryAPIServiceRunner, { AddTreasuryIncomeSourceResponse, AddTreasuryMarcsResponse, GetTreasuryAccessTableResponse, GetTreasuryResponse, RemoveTreasuryMarcsResponse, UpdateTreasuryAccessResponse, UpdateTreasuryIncomeSourcesResponse, UpdateTreasuryNameRequest, UpdateTreasuryNameResponse } from "server/entities/player/services/treasuries/TreasuryAPIServiceRunner";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { Treasury } from "shared/types/Treasury";
import { TreasuryBufferData } from "selectors/TreasurySharedSelectors";
import { Treasuries } from "shared/Treasuries";
import { Number } from "shared/utilities/number.utilities";

// Create a memory service for the treasuries
const MemoryTreasuryHashmap = MemoryStoreService.GetHashMap("treasuries");

export type ExposedComponentData = TreasuryBufferData
export type TreasuryComponentData = Partial<GetTreasuryResponse> & {
    treasuryID: number;
    marcs: number;
    name: string;

    location?: number;
}

export namespace SharedTreasuryComponent {
    // unique symbol is used to create a unique type that can be used as a key
    export const Symbol : unique symbol = {} as never

    export class Container extends ComponentWrapper.Data implements ComponentData<SharedTreasuryComponent.Component[]> {
        // This is a private field that is only used to store the value in a buffer
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : SharedTreasuryComponent.Component[] = [];
        
        constructor() {
            super(SharedTreasuryComponent.Symbol)

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
        public serialize(data : SharedTreasuryComponent.Component[]) : ExposedComponentData[] {
            return data.map((v) => v.serialize(v.get()))
        }

        /**
         * Get the unserialized data from the container
         * @returns { SharedTreasuryComponent.Component[] }
         * 
         * @author NodeSupport
         */
        public get() : SharedTreasuryComponent.Component[] {
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
        public rewrite(data : SharedTreasuryComponent.Component[]) : buffer {
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
         * Add a treasury to the container, apply middleware and subscription listeners
         * Adds middleware to the treasury to listen for changes and update the container
         * 
         * @param treasury The treasury to add to the container
         * 
         * @mixes AttachMiddlewareListener
         * @mixes AttachSubscriptionListener
         * 
         * @author NodeSupport
         */
        @AttachMiddlewareListener()
        @AttachSubscriptionListener()
        public addTreasury(treasury : SharedTreasuryComponent.Component) {
            // Add a treasury to the container
            const current = this.get()

            // If the treasury already exists, return
            if (current.find((v) => v.get().treasuryID === treasury.get().treasuryID)) return

            current.push(treasury)

            // Rewrite the buffer with the new data
            this.rewrite(current)

            // Add a listener to the treasury
            treasury.middleware.apply(() => {
                this.rewrite(current)
            })
        }
    }

    export class Component extends ComponentWrapper.Data implements ComponentData<TreasuryComponentData> {
        protected buffer : buffer;
        readonly state : NetworkBubble.State = new NetworkBubble.State()

        private unserialized : TreasuryComponentData;
        private updated : number = tick();

        /**
         * Create a new treasury component
         * @param data The data to store in the component
         */
        constructor(data : TreasuryComponentData) {
            super(SharedTreasuryComponent.Symbol)

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
        public serialize(data : TreasuryComponentData) : ExposedComponentData {
            return [ tonumber(data.treasuryID)!, data.name!, data.marcs!, data.ownerID!, data.location ?? 1,
                data.accessTable?.map((access) => {
                    return [access.user, access.withdraw_marc_limit, access.withdraw_item_limit]
                }) ?? [],

                data.income?.map((income) => {
                    return [income.UniqueID, income.TreasuryID, income.type, income.level, income.timeCreated, income.timeLastClaimed ?? 0]
                }) ?? [],

                data.audit?.map((audit) => {
                    return [audit.actionID, audit.playerID, audit.timestamp, audit.detail, (!audit || audit.reason === "") ? "No reasoning specified for this action." : audit.reason!]
                }) ?? [] 
            ]
        }

        /**
         * Reformat the treasury data with the
         * most recent data from the API
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        public async reformat() : Promise<void> {
            const data : GetTreasuryResponse = await TreasuryAPIServiceRunner.getTreasury(tonumber(this.unserialized.treasuryID)!);
            this.unserialized = data;

            this.rewrite(data);
        }

        /**
         * Updates the treasury in the memory store with the most recent data
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        private async rewriteMemoryStore() : Promise<void> {
            MemoryTreasuryHashmap.SetAsync(tostring(this.unserialized.treasuryID), this.unserialized, 180)
        }

        /**
         * Reformat the treasury data to be the most recent data
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        private async reformatMemoryStore() : Promise<void> {
            const data = await MemoryTreasuryHashmap.GetAsync(tostring(this.unserialized.treasuryID)) as GetTreasuryResponse;
            this.unserialized = data;
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
        public rewrite(data : TreasuryComponentData) : buffer {
            // Write the new data to the buffer
            const wrapper = BufferWrapper()
            this.unserialized = data;

            // Create a serializable array to store the data
            const serializable = this.serialize(data)

            // Serialize the data
            this.buffer = wrapper.serialize(serializable)
            this.state.overrideProperty(0, this.buffer);

            // Update the treasury in the memory store
            this.rewriteMemoryStore();

            // Check if the data has been updated
            if (tick() - this.updated > 120) {
                // Update the time the data was updated
                this.updated = tick()

                // Update the data with the most recent data
                this.reformat();
            }

            return this.buffer
        }

        /**
         * Gets the amount of marcs in the treasury
         * 
         * @returns { number } The amount of marcs in the treasury
         * 
         * @author NodeSupport
         */
        public getMarcs() : number {
            return this.unserialized.marcs;
        }

        /**
         * Get the location of the treasury
         * 
         * @returns { Promise<number>} The location of the treasury
         * 
         * @author NodeSupport
         */
        public getTreasuryLocation() : Promise<number> {
            return new Promise<number>(async (resolve, reject) => {
                if(!this.unserialized.location) {
                    const location = await TreasuryAPIServiceRunner.getTreasuryLocation(tonumber(this.unserialized.treasuryID)!);
                    this.unserialized.location = location;

                    this.rewrite(this.unserialized);
                }

                resolve(this.unserialized.location!);
            })
        }

        /**
         * Get the owner of the treasury
         * 
         * @returns { number } The owner of the treasury
         * 
         * @author NodeSupport
         */
        public getTreasuryOwner() : number {
            return this.unserialized.ownerID!;
        }

        /**
         * Update the audit logs for the treasury
         * 
         * @returns { Promise<void> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public async updateAuditLog() : Promise<void> {
            this.unserialized.audit = await TreasuryAPIServiceRunner.getTreasuryAudits(tonumber(this.unserialized.treasuryID)!).then((data) => {
                return data.auditLogs;
            })
        }

        /**
         * Get all of the audits for the treasury
         * 
         * @returns { Treasury.Audit[] }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public async getAuditLog() : Promise<Treasury.Audit[]> {
            if(!this.unserialized.audit) {
                const audits = await TreasuryAPIServiceRunner.getTreasuryAudits(tonumber(this.unserialized.treasuryID)!);
                this.unserialized.audit = audits.auditLogs;
            
                this.rewrite(this.unserialized);
            }

            return this.unserialized.audit;
        }
        
        /**
         * Get the users that have access to the treasury
         * 
         * @returns { Promise<Treasury.Permission[]> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public async getTreasuryAccessTable() : Promise<Treasury.Permission[]> {
            if(!this.unserialized.accessTable) {
                const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(tonumber(this.unserialized.treasuryID)!);
                this.unserialized.accessTable = access.accessTable;

                this.rewrite(this.unserialized);
            }

            return this.unserialized.accessTable!;
        }

        /**
         * Get the income sources for the treasury
         * 
         * @returns { Promise<Treasury.IncomeSource[]> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public async getTreasuryIncomeSources() : Promise<Treasury.IncomeSource[]> {
            const income = await TreasuryAPIServiceRunner.getTreasuryIncomeSources(tonumber(this.unserialized.treasuryID)!)
                .catch(() => {});

            this.unserialized.income = income?.incomeSources ?? [];

            this.rewrite(this.unserialized);
            return this.unserialized.income ?? [];
        }

        /**
         * Get the name of the treasury
         * 
         * @returns { string }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public getTreasuryName() : string {
            return this.unserialized.name;
        }

        /**
         * Claim an income source for the treasury
         * 
         * @param incomeSourceID The income source to claim
         * @param player The player claiming the income source
         * @returns { Promise<UpdateTreasuryIncomeSourcesResponse> }
         * 
         * @throws { string } If the income source is not redeemable
         * @throws { string } If the income source is not found
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public claimIncomeSource(incomeSourceID : number, player : BasePlayerEntity) : Promise<UpdateTreasuryIncomeSourcesResponse> {
            return new Promise<UpdateTreasuryIncomeSourcesResponse>(async (resolve, reject) => {
                const updated = await TreasuryAPIServiceRunner.getTreasuryIncomeSources(tonumber(this.unserialized.treasuryID)!);
                this.unserialized.income = updated.incomeSources;
             
                // Find the income source
                const incomeSource = this.unserialized.income?.find((income) => income.UniqueID === incomeSourceID);
                if(!incomeSource) return reject("Income source not found");

                // Check if the income source is redeemable
                const isRedeemable = Treasuries.isIncomeSourceRedeemable(incomeSource);
                if(!isRedeemable) return reject("Income source is not redeemable");

                // Get the amount of cycles to claim
                const cycles = Treasuries.getAmountOfRedeemableIncome(incomeSource);
                const profitAmount = Treasuries.getIncomeSourceProfitAmount(incomeSource.type);

                // Calculate the total amount of marcs to add to the treasury
                const totalAmount = profitAmount * cycles;

                // Update the payslip to have a timeLastClaimed to be the current time
                incomeSource.timeLastClaimed = math.floor(Workspace.GetServerTimeNow());

                // Update the treasury
                await TreasuryAPIServiceRunner.updateTreasuryIncomeSource(
                    tonumber(this.unserialized.treasuryID)!, 
                    incomeSourceID, incomeSource.TreasuryID, incomeSource.type, incomeSource.timeLastClaimed, incomeSource.level,
                    player.getUserId()
                ).then(async (data) => {
                    player.info("Processing funds to your treasury...")

                    // Add the marcs to the treasury
                    await this.addMarcsToTeasuryByUser(totalAmount, player, true, incomeSourceID, "Claimed a payslip income source (x" + cycles + ")");
                    
                    // Update the treasury income sources
                    await TreasuryAPIServiceRunner.getTreasuryIncomeSources(tonumber(this.unserialized.treasuryID)!);
                    player.success("Successfully claimed income source for +$" + Number.AddCommasToNumber(totalAmount) + " marcs.")
                })
            });
        };

        /**
         * Create a new income source for the treasury
         * 
         * @param incomeSourceType The type of income source
         * @param level The level of the income source
         * @param player The player adding the income source 
         * @returns { Promise<AddTreasuryIncomeSourceResponse> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public async createTreasuryIncomeSource(incomeSourceType : Treasury.IncomeSourceTypes, level : number, player : BasePlayerEntity) : Promise<AddTreasuryIncomeSourceResponse> {
            return new Promise<AddTreasuryIncomeSourceResponse>(async (resolve, reject) => {
                const result = TreasuryAPIServiceRunner.addTreasuryIncomeSource(this.unserialized.treasuryID, incomeSourceType, level, player.getUserId())
                
                // Update the income sources
                this.getTreasuryIncomeSources().then(() => resolve(result)).catch((err) => reject(err))
            })
        }

        /**
         * Remove a user from the treasury access table
         * 
         * @param userID The user to remove from the treasury
         * @param player The player removing the user from the treasury
         * @returns { Promise<UpdateTreasuryAccessResponse>}
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public removeUserFromAccessTreasury(userID: number, player: BasePlayerEntity) : Promise<UpdateTreasuryAccessResponse> {
            return new Promise<UpdateTreasuryAccessResponse>(async (resolve, reject) => {
                const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(this.unserialized.treasuryID);
                const permissions = access.accessTable || [];

                const index = permissions.findIndex((permission) => permission.user === userID);
                if (index === -1) return reject("User does not have access to treasury");

                // Remove the user from the treasury access table
                permissions.remove(index);

                TreasuryAPIServiceRunner.updateTreasuryAccess(this.unserialized.treasuryID, permissions, player.getUserId()).then(async (data) => {
                    const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(this.unserialized.treasuryID);
                    const permissions = access.accessTable || [];

                    this.unserialized.accessTable = permissions;
                    this.rewrite(this.unserialized);

                    await this.updateAuditLog();

                    resolve(data)
                }).catch((err) => reject(err))
            })
        };

        /**
         * Add a user to the treasury access table
         * 
         * @param userID The user to add to the treasury
         * @param player The user adding the player to the treasury
         * @returns { Promise<UpdateTreasuryAccessResponse> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public addUserToAccessTreasury(userID: number, player: BasePlayerEntity) : Promise<UpdateTreasuryAccessResponse> {
            return new Promise<UpdateTreasuryAccessResponse>(async (resolve, reject) => {
                const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(this.unserialized.treasuryID);
                const permissions = access.accessTable || [];

                if(permissions.find((permission) => permission.user === userID)) return reject("User already has access to treasury");
                permissions.push({user: userID, withdraw_item_limit: 100, withdraw_marc_limit: 500000});

                TreasuryAPIServiceRunner.updateTreasuryAccess(this.unserialized.treasuryID, permissions, player.getUserId()).then(async (data) => {
                    const access = await TreasuryAPIServiceRunner.getTreasuryAccessTable(this.unserialized.treasuryID);
                    const permissions = access.accessTable || [];
                    
                    this.unserialized.accessTable = permissions;
                    await this.updateAuditLog();

                    this.rewrite(this.unserialized);

                    resolve(data)
                }).catch((err) => reject(err))
            })
        }

        /**
         * Update the name of the treasury.
         * 
         * @param name The new name of the treasury
         * @param player The player updating the treasury name
         * @returns { Promise<UpdateTreasuryNameResponse> }
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public updateTreasuryName(name : string, player : BasePlayerEntity) : Promise<UpdateTreasuryNameResponse> {
            return new Promise<UpdateTreasuryNameResponse>(async (resolve, reject) => {
                TreasuryAPIServiceRunner.updateTreasuryName(this.unserialized.treasuryID, name, player.getUserId()).then(async (data) => {
                    await this.updateAuditLog();

                    this.unserialized.name = name;
                    this.rewrite(this.unserialized);

                    resolve(data)
                }).catch((err) => reject(err))
            })
        }
        
        /**
         * Take marcs from the treasury.
         * If the player does not have enough marcs, the function will reject
         * 
         * @param amount The amount of marcs to remove
         * @param player The player removing the marcs
         * @param canGoInDebt If the treasury can go in debt
         * @returns { Promise<RemoveTreasuryMarcsResponse> }
         * 
         * @mixes AttachMiddlewareListener
         * @throws { string } If the treasury does not have enough marcs and canGoInDebt is false
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public removeMarcsFromTreasuryByUser(amount : number, player : BasePlayerEntity, canGoInDebt: boolean = false) : Promise<RemoveTreasuryMarcsResponse> {
            return new Promise<RemoveTreasuryMarcsResponse>(async (resolve, reject) => {
                const marcs = this.getMarcs();
                if (marcs < amount && !canGoInDebt) return reject("Not enough marcs in treasury");

                TreasuryAPIServiceRunner.removeTreasuryMarcs(this.unserialized.treasuryID, amount, player.getUserId()).then(async (data) => {
                    await this.updateAuditLog();

                    this.unserialized.marcs = this.getMarcs() - amount;
                    this.rewrite(this.unserialized);

                    resolve(data)
                }).catch((err) => reject(err))
            })
        }

        /**
         * Add marcs to the treasury.
         * TODO: Add a check to see if the player has enough marcs to add
         * TODO: Update payslips.
         * 
         * @param amount The amount of marcs to add
         * @param player The player the marcs are from
         * @param fromPayslip If the marcs are from a payslip
         * @param fromPlayslipId The id of the payslip
         * @returns { Promise<AddTreasuryMarcsResponse> }
         * 
         * @mixes AttachMiddlewareListener
         * 
         * @author NodeSupport
         */
        @AttachSubscriptionListener()
        public addMarcsToTeasuryByUser(amount : number, player : BasePlayerEntity, fromPayslip: boolean = false, fromPlayslipId?: number, reason?: string) : Promise<AddTreasuryMarcsResponse> {
            return new Promise<AddTreasuryMarcsResponse>(async (resolve, reject) => {
                TreasuryAPIServiceRunner.addTreasuryMarcs(this.unserialized.treasuryID, amount, player.getUserId(), fromPayslip, fromPlayslipId, reason).then(async (data) => {
                    await this.updateAuditLog();

                    this.unserialized.marcs = this.getMarcs() + amount;
                    this.rewrite(this.unserialized);

                    resolve(data)
                }).catch((err) => reject(err))
            })
        }

        /**
         * Get the unserialized data from the container
         * 
         * @returns { TreasuryComponentData }
         * 
         * @author NodeSupport
         */
        public get() : TreasuryComponentData {
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

