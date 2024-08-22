import { String } from "./utilities/string.utilities";

export namespace Branches {
    export enum BranchType {
        SCOUTING_LEGION = 1,
        MILITARY_POLICE = 2,
        STATIONARY_GUARD = 3,
        TRAINEE_CORPS = 4,
    }

    export enum BranchRank {
        RECRUIT = 1,
        PRIVATE = 2,
        PRIVATE_FIRST_CLASS = 3,
        LANCE_CORPORAL = 4,
        CORPORAL = 5,
        SERGEANT = 6,
        SERGEANT_MAJOR = 7,
        LIEUTENANT = 8,
        CAPTAIN = 9,
        SECTION_COMMANDER = 10,
        ASSISTANT_COMMANDER = 11,
        COMMANDER = 12,
    }

    export enum AuditTypes {
        ACCEPT_TRANSFER = 1,
        DECLINE_TRANSFER = 2,
        REQUEST_TRANSFER = 3,
        ASSIGNED_DETACHMENT = 4,
        REMOVE_DETACHMENT = 5,
        CREATE_DETACHMENT = 6,
        DELETE_DETACHMENT = 7,
        EXILE_USER = 8,
        PROMOTE_USER = 9,
        DEMOTE_USER = 10,
    }

    export function getBranchFromId(id : number) {
        return BranchType[id];
    }

    export function getBranchFromCleanString(branch : string) {
        const upper = string.upper(branch);
        
        // Replace spaces with underscores
        const [ replaced ] = string.gsub(upper, " ", "_");

        return BranchType[replaced as keyof typeof BranchType];
    }

    export function cleanBranchFromId(id : number) {
        const branch = BranchType[id];

        // Replace underscores with spaces
        const [ replaced ] = string.gsub(branch, "_", " ");

        // Capitalize the first letter of each word
        return String.CapitalizeAllFirstLetters(string.lower(replaced));
    }

    export function getAuditFromCleanString(audit : string) {
        const upper = string.upper(audit);
        
        // Replace spaces with underscores
        const [ replaced ] = string.gsub(upper, " ", "_");

        return AuditTypes[replaced as keyof typeof AuditTypes];
    }

    export function getRankFromCleanString(rank : string) {
        const upper = string.upper(rank);
        
        // Replace spaces with underscores
        const [ replaced ] = string.gsub(upper, " ", "_");

        return BranchRank[replaced as keyof typeof BranchRank];
    }

    export function getRankFromId(id : number) {
        return String.CapitalizeAllFirstLetters(string.lower(BranchRank[id]));
    }
}