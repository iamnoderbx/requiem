import { Treasury } from "shared/types/Treasury";
import { BasePlayerEntity } from "../../BasePlayerEntity";
import TreasuryAPIServiceRunner, { UpdateTreasuryNameResponse } from "./TreasuryAPIServiceRunner";
import { Locations } from "shared/types/Locations";
import { Memory } from "shared/utilities/memory.utilities";
import { SharedTreasuryComponent, TreasuryComponentData } from "server/components/Treasuries/SharedTreasuryComponent";
import { PlayerActions, TreasuryActions } from "shared/utilities/network/Events";
import { Players } from "@rbxts/services";
import { Treasuries } from "shared/Treasuries";

export default class PlayerTreasuryService {
    public static memory: symbol = Memory.createHashmap();
    private static treasuries: Map<number, SharedTreasuryComponent.Component> = new Map();

    private container!: SharedTreasuryComponent.Container;

    constructor(private player: BasePlayerEntity) { }

    public static getTreasuryFromCache(treasuryID: number): SharedTreasuryComponent.Component {
        return PlayerTreasuryService.treasuries.get(treasuryID) as SharedTreasuryComponent.Component;
    }

    /**
     * Creates a personal treasury for the player.
     *
     * @returns {Promise<number>} - A promise that resolves to the treasury ID of the created treasury.
     *
     * @author NodeSupport
     */
    private createPersonalTreasury(): Promise<number> {
        return new Promise(async (resolve, reject) => {
            const data = this.player.getData();
            if (!data) return reject("Failed to get player data");

            const origin = data.getData()?.origin ?? Locations.SHIGANSHINA;

            const treasury = await TreasuryAPIServiceRunner.createTreasury(
                this.player.getUserId(),
                Treasury.Type.PERSONAL,
                "Personal Treasury",
                origin,
            );

            if (!treasury || !treasury.treasuryID) return reject("Failed to create treasury");
            Memory.store(PlayerTreasuryService.memory, treasury.treasuryID, treasury);

            return resolve(treasury.treasuryID);
        });
    }

    public renameTreasury(treasuryID: number, name: string): Promise<UpdateTreasuryNameResponse | unknown> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        const owner = treasury.getTreasuryOwner();

        const current_name = treasury.getTreasuryName()

        if (Treasuries.isTreasuryReservedName(current_name)) {
            this.player.error("You do not have permission to rename this treasury.");
            return treasury.updateAuditLog();
        }

        if (Treasuries.isTreasuryReservedName(name)) {
            this.player.error("You cannot rename a treasury to a reserved name.");
            return treasury.updateAuditLog();
        }

        if (!owner || this.player.getUserId() !== owner) return Promise.reject("You do not have permission to rename this treasury.");

        this.player.success("You have successfully renamed your treasury to " + name + ".")

        return treasury.updateTreasuryName(name, this.player).catch((err) => {
            this.player.error(err);
        })
    }

    public addUserAccess(treasuryID: number, userID: number): Promise<unknown> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        const owner = treasury.getTreasuryOwner();

        if (!owner || this.player.getUserId() !== owner) return Promise.reject("You do not have permission to add users to this treasury.");
        return treasury.addUserToAccessTreasury(userID, this.player).catch((err) => {
            this.player.error(err);
        }).then(() => {
            this.player.success("You have successfully added " + Players.GetNameFromUserIdAsync(userID) + " to your treasury.")
        })
    }

    public removeUserAccess(treasuryID: number, userID: number): Promise<unknown> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        const owner = treasury.getTreasuryOwner();

        if (!owner || this.player.getUserId() !== owner) return Promise.reject("You do not have permission to remove users from this treasury.");
        return treasury.removeUserFromAccessTreasury(userID, this.player).catch((err) => {
            this.player.error(err);
        }).then(() => {
            this.player.success("You have successfully removed " + Players.GetNameFromUserIdAsync(userID) + " from your treasury.")
        })
    }

    /**
     * Gets the treasury notices for a given treasury.
     *
     * @param {number} treasuryID - The ID of the treasury to get the notices for.
     * @returns {Promise<Treasury.IncomeSource[]>} - A promise that resolves to the income sources of the treasury.
     *
     * @author NodeSupport
     */
    public getTreasuryNotices(treasuryID: number): Promise<Treasury.IncomeSource[]> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        return treasury.getTreasuryIncomeSources();
    }

    /**
     * Gets the audit log for a given treasury.
     *
     * @param {number} treasuryID - The ID of the treasury to get the audit log for.
     * @returns {Promise<Treasury.Audit[]>} - A promise that resolves to the audit log of the treasury.
     *
     * @author NodeSupport
     */
    public getTreasuryAudit(treasuryID: number): Promise<Treasury.Audit[]> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        return treasury.getAuditLog();
    }

    /**
     * Gets the permissions for a given treasury.
     *
     * @param {number} treasuryID - The ID of the treasury to get the permissions for.
     * @returns {Promise<Treasury.Permission[]>} - A promise that resolves to the permissions of the treasury.
     *
     * @author NodeSupport
     */
    public getTreasuryPermissions(treasuryID: number): Promise<Treasury.Permission[]> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        return treasury.getTreasuryAccessTable();
    }

    /**
     * Claims an income source for a given treasury.
     *
     * @param {number} treasuryID - The ID of the treasury to claim the income source for.
     * @param {number} incomeSourceID - The ID of the income source to claim.
     * @returns {Promise<unknown>} - A promise that resolves when the income source is claimed.
     *
     * @author NodeSupport
     */
    public claimIncomeSource(treasuryID: number, incomeSourceID: number): Promise<unknown> {
        const treasury = this.getTreasury<SharedTreasuryComponent.Component>(treasuryID);
        return treasury.claimIncomeSource(incomeSourceID, this.player).catch((err) => {
            this.player.error(err);
        })
    }

    public updatePlayerTreauries(): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            // Get the player's treasuries.
            let treasuries = await TreasuryAPIServiceRunner.getUsersTreasuries(this.player.getUserId());
            if (!treasuries) return reject("Failed to get treasuries");

            if (treasuries.size() === 0) {
                await this.createPersonalTreasury();
                treasuries = await TreasuryAPIServiceRunner.getUsersTreasuries(this.player.getUserId());
            }

            treasuries.forEach((treasury) => {
                Memory.store(PlayerTreasuryService.memory, treasury.treasuryID, treasury);

                // Add the treasury to the container
                this.getTreasury<SharedTreasuryComponent.Component>(treasury.treasuryID);
            });

            return resolve("Successfully updated player treasuries.")
        })
    }

    public getTreasury<T extends SharedTreasuryComponent.Component>(treasuryID: number): T {
        const treasury = PlayerTreasuryService.treasuries.get(treasuryID) as T;

        if (!treasury) {
            const memory = Memory.retrieve<TreasuryComponentData>(PlayerTreasuryService.memory, treasuryID);

            const creation = new SharedTreasuryComponent.Component(memory);
            PlayerTreasuryService.treasuries.set(treasuryID, creation);

            creation.getTreasuryLocation();

            this.container.addTreasury(creation)
        }

        return PlayerTreasuryService.treasuries.get(treasuryID) as T;
    }

    public initialize(): Promise<string> {
        this.player.getNetwork().listen(PlayerActions.Treasury, async (action, treasuryID, argument) => {
            switch (action) {
                case TreasuryActions.Audits: return this.getTreasuryAudit(treasuryID as number);
                case TreasuryActions.Notices: return this.getTreasuryNotices(treasuryID as number);
                case TreasuryActions.Permissions: return this.getTreasuryPermissions(treasuryID as number);
                case TreasuryActions.Rename: return this.renameTreasury(treasuryID as number, argument as string);
                case TreasuryActions.AddUserPermission: return this.addUserAccess(treasuryID as number, argument as number);
                case TreasuryActions.RemoveUserPermission: return this.removeUserAccess(treasuryID as number, argument as number);
                case TreasuryActions.ClaimIncome: return this.claimIncomeSource(treasuryID as number, argument as number);
            }
        });

        return new Promise(async (resolve, reject) => {
            this.container = new SharedTreasuryComponent.Container();

            await this.updatePlayerTreauries();

            this.player.addComponent(this.container);
            resolve("Successfully initialized treasury service.")
        })
    }
}