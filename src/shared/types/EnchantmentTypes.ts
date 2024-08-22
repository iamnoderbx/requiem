import Object from "@rbxts/object-utils";

export namespace Enchantment {
    export enum Walls {
        Maria,
        Rose,
        Sina,
    }

    export enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Mythic,
    }
    
    export enum Key {
        Name = 1,
        Description = 2,
        Id = 3,
        Wall = 4,
        Rarity = 5,
        Obtained = 6,
        Category = 7,
        Requirements = 8,
        Lock = 9,
        Positives = 10,
        Negatives = 11,
        MetaData = 12,
    }

    export enum Category {
        Titan = 0,
        Gear = 1,
        Craftsmanship = 2,
        Human = 3,
        Leadership = 4,
        Medical = 5,
    }

    export type Type = {
        [Key.Name]: string,
        [Key.Description]: string,
        [Key.Id]: number,
        [Key.Wall]: Walls,
        [Key.Rarity]: Rarity,
        [Key.Obtained]: number,
        [Key.Category]: Category,
        [Key.Requirements]: number[],
        [Key.Lock]: number[],
        [Key.Positives]: string[],
        [Key.Negatives]: string[],
        [Key.MetaData]: number[],
    }

    export const Map: (keyof typeof Key)[] = Object.keys(Key).filter(key => tonumber(key) !== undefined) as (keyof typeof Key)[];
}