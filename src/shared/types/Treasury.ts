import { Locations } from "./Locations";

export namespace Treasury {

    export enum IncomeSourceTypes {
        FACTORY = 1,
        DISTRICT = 2,
        BRANCH = 3,
    }

    export enum Action {
        WITHDRAW = 1,                   // Withdraw
        DEPOSIT = 2,                    // Deposit
        REMOVE_ITEM = 3,                // Remove item
        ADD_ITEM = 4,                   // Add item
        CLAIM_PAYSLIP = 5,              // Claim payslip
    }

    export enum Type {
        PERSONAL = 1,                   // Personal treasury
        BRANCH = 2,                     // Branch treasury
        GOVERNMENT = 3,                 // Government treasury
        BLOODLINE = 4,                  // Bloodline treasury
    }
    
    export interface IncomeSource {
        UniqueID : number,              // Income source ID
        TreasuryID : number,            // Treasury ID
        type : number,                  // Income source type
        
        level : number,                 // Level
        timeCreated : string,           // Created timestamp
        timeLastClaimed : number,       // Last collected timestamp
    }

    export interface Item {
        history: number[],              // History of item, negative is player, positive is treasury
        meta: (number | string)[],      // Meta data, first is always item ID
    }

    export interface Container {
        treasury : number,              // Treasury ID
        itemUID: Item[],                // Items
        location : Locations,   // Location ID
        maxWeight : number,             // Max weight
    }

    export interface Permission {
        user: number,                   // User ID
        withdraw_marc_limit: number,    // Withdraw limit
        withdraw_item_limit: number,    // Withdraw item limit
    }

    export interface Audit {
        playerID: number,               // User ID
        actionID : Treasury.Action,       // Action
        timestamp : string,             // Timestamp
        detail : number | string,       // Amount of money or item ID, or other detail
        reason : string | undefined,    // Reason
    }

    export interface Treasury {
        id : number,                    // Treasury ID
        name : string,                  // Treasury name
        type : Treasury.Type,           // Treasury type
        owner : number,                 // Owner ID
        // permissions: Permission[],      // Permissions
        // audits: Audit[],                // Audits
        contents: Container[],          // Containers
        //income_sources: IncomeSource[], // Income sources
    }
}