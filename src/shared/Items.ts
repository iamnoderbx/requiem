export namespace Items {
    export type Item = {
        name: string;
        weight: number;
    }

    export enum Types {
        BLUEPRINTS,
        TOOLS,
        MATERIALS,
    }

    export const Items = {
        [Types.BLUEPRINTS]: [
            {
                name: "Blueprint",
                weight: 0.5
            }
        ],
        [Types.TOOLS]: [
            {
                name: "Hammer",
                weight: 1.5
            }
        ],
        [Types.MATERIALS]: [
            {
                name: "Iron",
                weight: 2.5
            }
        ]
    }
}