import { Workspace } from "@rbxts/services";
import { Requiem } from "./Requiem";

export namespace Animals {
    export enum Gender {
        Male,
        Female,
    }

    export const GenderColors : {[key in Animals.Gender]: Color3} = {
        [Animals.Gender.Male]: Color3.fromRGB(112, 193, 255),
        [Animals.Gender.Female]: Color3.fromRGB(255, 105, 222),
    }

    export enum Color {
        Brown = "brown",
        White = "white",
        Black = "black",
        Grey = "grey",
    }

    export enum Statistics {
        RunSpeed = 1,
        TurnSpeed = 2,
        JumpPower = 3,
        Stamina = 4,
        Health = 5
    }
    
    export type Horse = {
        name: string;
        created: number;

        gender : Animals.Gender;
        statistics : {[key in Animals.Statistics]: number};

        equipped: boolean;
        ownership: number;

        color: {r: number, g: number, b: number};
        bred: number;

        owner?: string,
        id: number;
    }

    // Half an hour
    export function isHorseOnbreedCooldown(horse : Animals.Horse) : boolean {
        //return (Workspace.GetServerTimeNow() - horse.bred) < 20
        return (Workspace.GetServerTimeNow() - horse.bred) < (60 * 60 * 0.5); // 0.5
    }

    // 12 hours
    export function isHorseAdult(horse : Animals.Horse) : boolean {
        //return (Workspace.GetServerTimeNow() -  horse.created) > 30
        return (Workspace.GetServerTimeNow() -  horse.created) > (60 * 60 * 12); // 12
    }

    export namespace Models {
        export const Horse = Requiem.Assets.entities.horse
    }

    export function getColorFromEnum(color : Animals.Color | Color3) : Color3 {
        if(typeOf(color) === "Color3") return (color as Color3);

        switch(color) {
            case Animals.Color.Brown:
                return Color3.fromRGB(99, 74, 56)
            case Animals.Color.White:
                return Color3.fromRGB(232, 232, 232)
            case Animals.Color.Black:
                return Color3.fromRGB(23, 23, 31)
            case Animals.Color.Grey:
                return Color3.fromRGB(128, 128, 128)
            default:
                return Color3.fromRGB(255, 0, 0)
        }
    }
}