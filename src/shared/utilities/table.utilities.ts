import Object from "@rbxts/object-utils";

export namespace Table {
    export function isIdentical<T extends object>(a: T, b: T): boolean {
        // If both are null or undefined, return true
        if (a === b) return true;

        // If either is null or undefined, return false
        if (a === undefined || b === undefined) return false;

        // If both are Object objects and their keys length is equal
        if (typeOf(a) === 'table' && typeOf(b) === 'table') {
            const keysA = Object.keys(a) as defined[];
            const keysB = Object.keys(b) as defined[];

            if (keysA.size() !== keysB.size()) return false;

            for (let key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!isIdentical(a[key as keyof typeof a] as object, b[key as keyof typeof b] as object)) return false;
            }

            return true;
        }

        // Otherwise, use strict equality
        return a === b;
    }
}