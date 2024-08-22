import Object from "@rbxts/object-utils";

export namespace Keybinds {
    // Enum for keybind categories
    export enum Category {
        Horse,
        ODMG,
        Tools,
        General,
        Building,
    };

    export const Default = {
        // Horse keybinds
        [Category.Horse]: {
            "Summon Horse": [Enum.KeyCode.G],
            "Jump": [Enum.KeyCode.Space],
            "Dismount": [Enum.KeyCode.RightControl],
            "Sprint": [Enum.KeyCode.LeftShift],
        },
        [Category.ODMG]: {
            "Left Grapple": [Enum.KeyCode.Q],
            "Right Grapple": [Enum.KeyCode.E],
            "Gas Boost": [Enum.KeyCode.Space],
            "Toggle Handles": [Enum.KeyCode.R],
            "Toggle Blades": [Enum.KeyCode.F],
            "Unequip": [Enum.KeyCode.J],
            "Cancel Refill": [Enum.KeyCode.G],
        },
        [Category.Tools]: {
            "Reload": [Enum.KeyCode.R],
            "Aim": [Enum.KeyCode.F],
        },
        [Category.General]: {
            "Sprint": [Enum.KeyCode.LeftShift],
            "Interact": [Enum.KeyCode.E],
            "Toggle Menu": [Enum.KeyCode.Tab],
            "Emote Wheel": [Enum.KeyCode.M],
            "Shiftlock": [Enum.KeyCode.LeftControl],
            "Emotes": [Enum.KeyCode.M],
            "Cloak": [Enum.KeyCode.H],
            "Hood": [Enum.KeyCode.J],
            "Slot 1": [Enum.KeyCode.One],
            "Slot 2": [Enum.KeyCode.Two],
            "Slot 3": [Enum.KeyCode.Three],
            "Slot 4": [Enum.KeyCode.Four],
            "Slot 5": [Enum.KeyCode.Five],
            "Toggle Compass": [Enum.KeyCode.C],
        },
        [Category.Building]: {
            "Editor": [Enum.KeyCode.L],
        },
    } as const;

    // Map of keybinds
    export type Map = typeof Default;

    // Map of keybinds
    export type SoftKeybindMap = {
        [key in Category]: {
            [key: string]: Enum.KeyCode[];
        }
    };

    export type CategoryKeys<T extends keyof typeof Default> = keyof typeof Default[T];

    export type Serialized = {
        category: Category;
        keybinds: {
            name: string | number;
            keys: string[]
        }[];
    }[];

    export const Serialize = (keybinds: Map): Serialized => {
        return Object.keys(keybinds).map(key => {
            const category = keybinds[key as keyof Keybinds.Map] as unknown as SoftKeybindMap;

            return {
                category: key,
                keybinds: Object.keys(category).map(key => {
                    return {
                        name: key,
                        keys: (category[key as keyof typeof category] as unknown as Enum.KeyCode[]).map(key => key.Name)
                    }
                })
            }
        })
    }

    export const Deserialize = (keybinds: Serialized): Map => {
        const map: SoftKeybindMap = {} as SoftKeybindMap;

        keybinds.forEach(category => {
            map[category.category] = {};

            category.keybinds.forEach(keybind => {
                map[category.category][keybind.name as string] = keybind.keys.map(key => {
                    return Enum.KeyCode[key as keyof typeof Enum.KeyCode] as Enum.KeyCode
                })
            })
        })

        return map as unknown as Map;
    }
}