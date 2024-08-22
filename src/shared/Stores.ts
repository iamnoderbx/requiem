import Object from "@rbxts/object-utils"
import { Blueprint } from "./Blueprint"

export namespace Stores {
	export enum Types {
		Draftsman,
	}

	export const SellerTypes = {
		[Types.Draftsman]: "blueprint"
	}

	export const SellerItemRanges = {
		[Types.Draftsman]: new NumberRange(2, 7),
	}
	
	// export type StoreComponentItem = {name : string, price : number, available: boolean, meta: unknown[]}
	export const GetSellerRandomItem = (storeType : Types) => {
		switch (storeType) {

			// If the store type is a draftsman, return a random blueprint.
			case Types.Draftsman:
				// Randomly get an item to fill the given shop with.
				return (rng : Random) => {
					const enumLength = Object.keys(Blueprint.BlueprintLookupEnum).size()
					const blueprint = Blueprint.getBlueprintFromLookupEnum(rng.NextInteger(0, enumLength - 1))

					// Check if the blueprint exists.
					if(!blueprint) return warn("Could not find a blueprint for the given lookup enum.");

					// Get a random id for the horse.
					const id: number = rng.NextInteger(100000, 999999);

					// Return the item.
					return {
						name : blueprint[Blueprint.Key.NAME],
						price : blueprint[Blueprint.Key.PRICE],
						available : true,
						meta: [id, blueprint[Blueprint.Key.ID]]
					}
				}

			// If the store type is invalid, warn the user.
			default: (rng : Random) => warn("Invalid store type.")
		}
	}
}