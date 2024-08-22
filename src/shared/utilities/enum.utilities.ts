import Object from "@rbxts/object-utils";

export namespace EnumUtilities {
    export function EnumRandomizer<T>(anEnum: T & object): T[keyof T] {
        const enumValues = (Object.values(anEnum) as unknown) as T[keyof T][];
        const randomIndex = math.floor(math.random() * enumValues.size());
        return enumValues[randomIndex];
    }
}