import { Workspace } from "@rbxts/services";
import { Treasury } from "./types/Treasury";
import { Number } from "./utilities/number.utilities";
import { Branches } from "./Branches";
import Object from "@rbxts/object-utils";
import { String } from "./utilities/string.utilities";
import { Locations } from "./types/Locations";

export namespace Treasuries {
    export const isTreasuryReservedName = (name : string) => {
        const branches = Branches.BranchType;
        let isReservedName = false;

        for(const branch of Object.keys(branches)) {
            const formattedName = String.CapitalizeAllFirstLetters(string.lower(branch));

            if(string.lower(name) === string.lower(formattedName)) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " Treasury")) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " Branch")) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " Branch Treasury")) isReservedName = true;
        };

        for(const location of Object.keys(Locations)) {
            const formattedName = String.CapitalizeAllFirstLetters(string.lower(location));

            if(string.lower(name) === string.lower(formattedName)) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " Treasury")) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " District")) isReservedName = true;
            if(string.lower(name) === string.lower(formattedName + " District Treasury")) isReservedName = true;
        }

        return isReservedName;
    }

    export const getIncomeSourceProfitAmount = (incomeSourceType : Treasury.IncomeSourceTypes) => {
        if(incomeSourceType === Treasury.IncomeSourceTypes.FACTORY) return 100;
        if(incomeSourceType === Treasury.IncomeSourceTypes.BRANCH) return 100;
        if(incomeSourceType === Treasury.IncomeSourceTypes.DISTRICT) return 100;

        return 100;
    }
    
    export const getIncomeSourceTimeLength = (incomeSourceType : Treasury.IncomeSourceTypes) => {
        if(incomeSourceType === Treasury.IncomeSourceTypes.FACTORY) return 10;
        if(incomeSourceType === Treasury.IncomeSourceTypes.BRANCH) return 10;
        if(incomeSourceType === Treasury.IncomeSourceTypes.DISTRICT) return 10;

        return 10;
    }

    export const getAmountOfRedeemableIncome = (incomeSource : Treasury.IncomeSource) => {
        const currentTime = Workspace.GetServerTimeNow();
        const createdAt = incomeSource.timeCreated;
        const unix = DateTime.fromIsoDate(createdAt)?.UnixTimestamp;

        let lastRedeemed = incomeSource.timeLastClaimed;
        let unixLastClamed = lastRedeemed ? DateTime.fromIsoDate(lastRedeemed as unknown as string)?.UnixTimestamp : undefined;

        if(!unixLastClamed) unixLastClamed = lastRedeemed as number;
        if(incomeSource.timeLastClaimed === 0 || !unixLastClamed) unixLastClamed = unix || currentTime;

        if(typeOf(lastRedeemed) === "number" && incomeSource.timeLastClaimed !== 0) unixLastClamed = lastRedeemed as number;

        const timeDifference = currentTime - unixLastClamed;
        const timeLength = getIncomeSourceTimeLength(incomeSource.type);

        // Calculate how many cycles of getIncomeSourcetimeLength have passed.
        // For example, if timeDifference is 15 and timeLength is 5, then 3 cycles have passed.
        const cyclesPassed = math.floor(timeDifference / timeLength);
        return cyclesPassed;
    }

    export const isIncomeSourceRedeemable = (incomeSource : Treasury.IncomeSource) => {
        const currentTime = Workspace.GetServerTimeNow();
        const createdAt = incomeSource.timeCreated;
        const unix = DateTime.fromIsoDate(createdAt)?.UnixTimestamp;

        let lastRedeemed = incomeSource.timeLastClaimed;
        let unixLastClamed = lastRedeemed ? DateTime.fromIsoDate(lastRedeemed as unknown as string)?.UnixTimestamp : undefined;

        if(!unixLastClamed) unixLastClamed = lastRedeemed as number;
        if(incomeSource.timeLastClaimed === 0 || !unixLastClamed) unixLastClamed = unix || currentTime;

        if(typeOf(lastRedeemed) === "number" && incomeSource.timeLastClaimed !== 0) unixLastClamed = lastRedeemed as number;

        const timeDifference = currentTime - unixLastClamed;
        const timeLength = getIncomeSourceTimeLength(incomeSource.type);

        // REPLACE FIVE WITH A DYNAMIC VALUE
        if(timeDifference >= timeLength) return true;
    }

    export const getTreasuryActionLabel = (action : number | string) => {
        switch(action) {
            case 11: return "Updated Access";
            case 10: return "Created Treasury";
            case 9: return "Set Treasury Name";
            case 8: return "Updated Location";
            case 7: return "Updated Owner";
            case 6: return "Updated Income Sources";
            case 5: return "Added Income Source";
            case 4: return "Added Items";
            case 3: return "Removed Items";
            case 2: return "Added Marcs";
            case 1: return "Removed Marcs";
            default: return "Unknown Action";
        }
    }

    export const getTreasuryMarcImpact = (action : number, detail : string | number) => {
        if(action === 2) {
            return $tuple(`+$${Number.AddCommasToNumber(tonumber(detail)!)}`, tonumber(detail)!);
        } else if(action === 1) {
            return $tuple(`-$${Number.AddCommasToNumber(math.abs(tonumber(detail)!))}`, tonumber(detail)!);
        }

        return $tuple();
    }
}