import { Items } from "./Items";

export namespace Recipes {

    export interface Recipe {
        result: Items.Item;
    }

    export interface Blueprint extends Recipe {
        type: Items.Types.BLUEPRINTS;
        materials: Items.Item[];
    }

    export const Recipes = {
        [Items.Types.BLUEPRINTS]: [
            Items.Items
        ]
    }
}