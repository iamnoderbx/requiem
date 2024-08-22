import Object from "@rbxts/object-utils";
import { Treasury } from "./Treasury"

export namespace Bloodline {
    export enum Origins {
        Yarkel,
        Stohess,
        Trost,
        Karanese,
        Shiganshina,
        Orvud,
        Ehrmich,
        Krovla,
        Utopia,
        Chlorba,
    }

    export enum Role {
        Head,
        Heir,
        Member,
        Pending,
    }

    export enum Permissions {
        Disown,
        Invite,
        Treasury,
    }

    export interface Member {
        id: number,
        role: Role,

        level : number,

        parent: number,
        permissions: Permissions[],

        lore : string,
    }

    export interface Bloodline {
        id: number,
        name: string,

        origin: Origins,
        treasury: Treasury.Treasury;

        created: number,
        icon: string,
        storyboard: string,
        members: Member[]
    }
}