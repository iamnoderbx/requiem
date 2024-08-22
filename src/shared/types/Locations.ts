import Object from "@rbxts/object-utils";
import { String } from "shared/utilities/string.utilities";

export enum Locations {
    SHIGANSHINA = 1,
    QUINTA = 2,
    HOLST = 3,
    ACRITA = 4,
    
    TROST = 5,
    KARANSE = 6,
    KROLVA = 7,
    UTOPIA = 8,

    EHRMICH = 9,
    YARKEL = 10,
    ORVUD = 11,
    STOHESS = 12,

    ROYAL_PALACE = 13,
}

export namespace Location {
    export enum Wall {
        MARIA,
        ROSE,
        SINA,
    }

    const WALLS = {
        [Location.Wall.MARIA]: [Locations.SHIGANSHINA, Locations.QUINTA, Locations.HOLST, Locations.ACRITA],
        [Location.Wall.ROSE]: [Locations.TROST, Locations.KARANSE, Locations.KROLVA, Locations.UTOPIA],
        [Location.Wall.SINA]: [Locations.EHRMICH, Locations.YARKEL, Locations.ORVUD, Locations.STOHESS, Locations.ROYAL_PALACE],
    }

    const DISTRICTS = [
        Locations.SHIGANSHINA, Locations.QUINTA, Locations.HOLST, Locations.ACRITA,
        Locations.TROST, Locations.KARANSE, Locations.KROLVA, Locations.UTOPIA,
        Locations.EHRMICH, Locations.YARKEL, Locations.ORVUD, Locations.STOHESS,
    ]

    export function getSimpleRatingString(rating : number) {
        // Poor, Average, Good, Excellent
        if (rating >= 0 && rating <= 25) return "Poor";
        if (rating >= 26 && rating <= 50) return "Average";
        if (rating >= 51 && rating <= 75) return "Good";
        if (rating >= 76 && rating <= 100) return "Excellent";
    }

    export function getOutlookString(outlook : number) {
        if (outlook >= 0 && outlook <= 25) return "Civilians currently hate living within %s.";
        if (outlook >= 26 && outlook <= 50) return "Civilians are indifferent to living within %s.";
        if (outlook >= 51 && outlook <= 75) return "Civilian outlook is positive within %s.";
        if (outlook >= 76 && outlook <= 100) return "Civilians are ecstatic to live within %s.";
    }

    export function getReputationString(reputation : number) {
        if (reputation >= 0 && reputation <= 20) return "The civilians currently hate the %s.";
        if (reputation >= 21 && reputation <= 40) return "The civilians currently dislike the %s.";
        if (reputation >= 41 && reputation <= 60) return "The civilians are neutral about the %s.";
        if (reputation >= 61 && reputation <= 80) return "The civilians actively enjoy the %s."
        if (reputation >= 81 && reputation <= 100) return "The civilians are ecstatic about the %s.";

        return "The civilians are indifferent about the %s.";
    }

    export function cleanDistrictName(stringLocation : string) {
        const location = Locations[stringLocation as keyof typeof Locations]

        const name = string.lower(String.ReplaceUnderscoresWithSpaces(Locations[location]));
        const proper = String.CapitalizeAllFirstLetters(string.lower(String.ReplaceUnderscoresWithSpaces(name)));
        const wall = Location.getWallLocation(location) ?? "Unknown";
        const isDistrict = Location.isDistrict(location);

        return proper + (isDistrict ? " District" : "")
    }

    export function isDistrict(location : Locations) {
        return DISTRICTS.includes(location);
    }

    export function getWallLocation(location : Locations) {
        for (const wall of (Object.keys(WALLS) as Array<keyof typeof WALLS>)) {
            if (WALLS[wall as keyof typeof WALLS].includes(location)) {
                return wall;
            }
        }
    }
}