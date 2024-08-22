import { Animals } from "shared/Animals";
import { Keybinds } from "shared/Keybindings";
import { Treasury } from "./Treasury";
import { Locations } from "./Locations";

export enum Weaponary {
    Fists = 0,
    Gear = 1,
}

export namespace Data {
    export enum GearVariations {
        Default,
        Training,
    }

    export type None = null;

    export type Nichirin = {
        variant : GearVariations,
        forged : number,
    }

    export type Gear = {
        type: Weaponary.Gear,
        variant: Nichirin
    }

    export type User = {
        gear : Gear,
        bloodline: number,

        horses: Animals.Horse[],
        keybinds: Keybinds.Serialized;

        origin: Locations;

        blueprints: number[],
    }
}