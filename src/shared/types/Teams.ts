import { Branches } from "shared/Branches";

export enum Teams {
    STAFF = 0,
    SCOUTING_LEGION = 1,
    STATIONARY_GUARD = 2,
    MILITARY_POLICE = 3,
    CIVILIAN = 4,
}

// SL ICON rbxassetid://5346876856
// STATIONARY ICON rbxassetid://5346877648
// POLICE ICON rbxassetid://5346878532
// STAFF ICON rbxassetid://9457336842 (no icon) (header lable at {0.048, 0},{0.5, 0})

export namespace TeamUtilities {
    export function getTeamColor(team : Teams) : [Color3, Color3] {
        switch(team) {
            case Teams.STAFF:
                return [Color3.fromRGB(21, 58, 103), Color3.fromRGB(125, 184, 255)];
            case Teams.SCOUTING_LEGION:
                return [Color3.fromRGB(15, 21, 54), Color3.fromRGB(48, 106, 157)]
            case Teams.STATIONARY_GUARD:
                return [Color3.fromRGB(54, 13, 13), Color3.fromRGB(157, 51, 51)]
            case Teams.MILITARY_POLICE:
                return [Color3.fromRGB(17, 54, 31), Color3.fromRGB(78, 157, 57)];
            case Teams.CIVILIAN:
                return [Color3.fromRGB(80, 80, 80), Color3.fromRGB(255, 255, 255)];
        }
    }

    export function getTeamName(team : Teams) : string {
        switch(team) {
            case Teams.STAFF:
                return "Requiem Team";
            case Teams.SCOUTING_LEGION:
                return "Scouting Legion";
            case Teams.STATIONARY_GUARD:
                return "Stationary Guard";
            case Teams.MILITARY_POLICE:
                return "Military Police";
            case Teams.CIVILIAN:
                return "Civilian";
        }
    }

    export function getBranchIcon(branch : Branches.BranchType) {
        switch(branch) {
            case Branches.BranchType.SCOUTING_LEGION:
                return "rbxassetid://5346876856";
            case Branches.BranchType.MILITARY_POLICE:
                return "rbxassetid://5346878532";
            case Branches.BranchType.STATIONARY_GUARD:
                return "rbxassetid://5346877648";
            case Branches.BranchType.TRAINEE_CORPS:
                return "rbxassetid://5346878532";
        }
    }

    export function getTeamIcon(team : Teams) : string {
        switch(team) {
            case Teams.STAFF:
                return "rbxassetid://9457336842";
            case Teams.SCOUTING_LEGION:
                return "rbxassetid://5346876856";
            case Teams.STATIONARY_GUARD:
                return "rbxassetid://5346877648";
            case Teams.MILITARY_POLICE:
                return "rbxassetid://5346878532";
            case Teams.CIVILIAN:
                return "rbxassetid://5346998835";
        }
    }
}
