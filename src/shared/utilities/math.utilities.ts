export namespace Math {
    export function Lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    export function Round(num: number, numDecimalPlaces: number) {
        let  mult = 10 ^ (numDecimalPlaces ?? 0)
        return math.floor(num * mult + 0.5) / mult
    }
}