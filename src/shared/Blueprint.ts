import Object from "@rbxts/object-utils";
import { Requiem } from "./Requiem"
import { Math } from "./utilities/math.utilities";

export namespace Blueprint {
	export const BLUEPRINT_FOLDER = Requiem.Assets.blueprints;

	export enum Key {
		ID = 1,
		NAME = 2,
		MODEL = 3,
		DESCRIPTION = 4,
		MATERIALS = 5,
		BUILD_TIME = 6,
		ICON = 7,
		CATEGORY = 8,
		SUBCATEGORY = 9,
		FOR_SALE = 10,
		PRICE = 11,
	}

	export enum Materials {
		WOOD,
		STONE,
		COBBLESTONE,
		IRON,
		GOLD,
	}
	
	export type Type = {
		[Key.ID]: number,
		[Key.NAME]: string,
		[Key.MODEL]: Model,
		[Key.DESCRIPTION]: string,
		[Key.MATERIALS]: [Materials, number][],
		[Key.BUILD_TIME]: number,
		[Key.ICON]: string,
		[Key.CATEGORY]: Category,
		[Key.SUBCATEGORY]: number,
		[Key.FOR_SALE]: boolean,
		[Key.PRICE]: number,
	}

	export enum Category {
		BUILDING,
		DECORATION,
		FURNITURE,
		MISCELLANEOUS,
		FENCES,
	}

	// Pointers to an identifier which represents each category.
	// This number must be unique.
	export const Categories = {
		[Category.BUILDING] : {
			"Village": 1,
			"Maria": 2,
			"Rose": 3,
			"Sina": 4,
			"Miscellaneous": 5,
		},

		[Category.DECORATION] : {
			"Kitchen": 1,
			"Living Room": 2,
			"Bedroom": 3,
			"Outdoor": 4,
		},

		[Category.FURNITURE] : {
			"Chair": 1,
			"Table": 2,
			"Bed": 3,
		},

		[Category.MISCELLANEOUS] : {
			"Lighting": 1,
			"Storage": 2,
			"Plants": 3,
			"Other": 4,
		},

		[Category.FENCES] : {
			"Short": 1,
			"Medium": 2,
			"Tall": 3,
		},
	}

	/*********************************************** */
	// !! ALWAYS ADD TO THE END OF THE ENUM
	// !! NEVER REMOVE OR CHANGE THE ORDER OF THE ENUM
	/*********************************************** */
	export enum BlueprintLookupEnum {
		// !! ALWAYS ADD TO THE END OF THE ENUM !!
		// NEVER REMOVE OR CHANGE THE ORDER OF THE ENUM
		// IT DOES NOT MATTER IF THIS LIST IS UNORGANIZED
		VILLAGE_HOUSING_1,
		WATCH_TOWER_1,
		SHORT_FENCE_1,
		SHORT_FENCE_2,
		SHORT_FENCE_3,
		SHORT_FENCE_4,
		SHORT_FENCE_5,
		SHORT_FENCE_6,
		SHORT_FENCE_7,
		SHORT_FENCE_8,
		SHORT_FENCE_9,
		MEDIUM_FORCE_1,
		MEDIUM_FORCE_2,
		TALL_FENCE_1,
		TALL_FENCE_2,
		TALL_FENCE_3,
		TALL_FENCE_4,
		TALL_FENCE_5,
	}

	// The blueprint map
	export const Blueprints = {
		/****************************************
		 *                                     	*
		 *    The Building (Houses) Category    *
		 *                                 		*
		 ****************************************/
		[Category.BUILDING]: {
		
			/************************************
			 *    	   Village Housing   	  	*
			************************************/
			[Categories[Category.BUILDING]["Village"]]: [
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.VILLAGE_HOUSING_1,
					[Key.NAME]: "Village Housing 1",
					[Key.MODEL]: BLUEPRINT_FOLDER.buildings.village.village_house_1,
					[Key.DESCRIPTION]: "A small house for villagers.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 100],
						[Materials.STONE, 50],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 60,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.BUILDING,
					[Key.SUBCATEGORY]: Categories[Category.BUILDING]["Village"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 1000,
				},

			] as Type[],

			/************************************
			 *    	     Misc Housing	   	  	*
			************************************/
			[Categories[Category.BUILDING]["Miscellaneous"]]: [
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.WATCH_TOWER_1,
					[Key.NAME]: "Watch Tower 1",
					[Key.MODEL]: BLUEPRINT_FOLDER.buildings.misc.watch_tower,
					[Key.DESCRIPTION]: "A small watch tower for overlooking.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 100],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.BUILDING,
					[Key.SUBCATEGORY]: Categories[Category.BUILDING]["Miscellaneous"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 700,
				},
			],
		},

		/****************************************
		 *                                     	*
		 *    	   The Fences Category    		*
		 *                                 		*
		 ****************************************/
		[Category.FENCES]: {
			/************************************
			 *    	    Small Fencing	   	  	*
			************************************/
			[Categories[Category.FENCES]["Short"]]: [
				/*********** 	SHORT FENCE 1 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_1,
					[Key.NAME]: "Short Fence 1",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_1,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 2 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_2,
					[Key.NAME]: "Short Fence 2",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_2,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 3 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_3,
					[Key.NAME]: "Short Fence 3",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_3,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 4 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_4,
					[Key.NAME]: "Short Fence 4",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_4,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 5 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_5,
					[Key.NAME]: "Short Fence 5",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_5,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 6 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_6,
					[Key.NAME]: "Short Fence 6",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_6,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 7 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_7,
					[Key.NAME]: "Short Fence 7",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_7,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 8 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_8,
					[Key.NAME]: "Short Fence 8",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_8,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
				/*********** 	SHORT FENCE 9 	****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.SHORT_FENCE_9,
					[Key.NAME]: "Short Fence 9",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.short.short_fence_9,
					[Key.DESCRIPTION]: "A small fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 30],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 40,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Short"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 100,
				},
			],

			/************************************
			 *    	    Medium Fencing	   	  	*
			/************************************/
			[Categories[Category.FENCES]["Medium"]]: [
				/***********	MEDIUM FENCE 1	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.MEDIUM_FORCE_1,
					[Key.NAME]: "Medium Fence 1",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.medium.medium_fence_1,
					[Key.DESCRIPTION]: "A medium fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 35],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 45,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Medium"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 125,
				},
				/***********	MEDIUM FENCE 2	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.MEDIUM_FORCE_2,
					[Key.NAME]: "Medium Fence 2",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.medium.medium_fence_2,
					[Key.DESCRIPTION]: "A medium fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 35],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 45,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Medium"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 125,
				},
			],

			/************************************
			 *    	    Tall Fencing	   	  	*
			 * **********************************/
			[Categories[Category.FENCES]["Tall"]]: [
				/***********	TALL FENCE 1	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.TALL_FENCE_1,
					[Key.NAME]: "Tall Fence 1",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.tall.tall_fence_1,
					[Key.DESCRIPTION]: "A tall fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 40],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 50,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Tall"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 150,
				},
				/***********	TALL FENCE 2	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.TALL_FENCE_2,
					[Key.NAME]: "Tall Fence 2",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.tall.tall_fence_2,
					[Key.DESCRIPTION]: "A tall fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 40],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 50,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Tall"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 150,
				},
				/***********	TALL FENCE 3	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.TALL_FENCE_3,
					[Key.NAME]: "Tall Fence 3",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.tall.tall_fence_3,
					[Key.DESCRIPTION]: "A tall fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 40],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 50,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Tall"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 150,
				},
				/***********	TALL FENCE 4	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.TALL_FENCE_4,
					[Key.NAME]: "Tall Fence 4",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.tall.tall_fence_4,
					[Key.DESCRIPTION]: "A tall fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 40],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 50,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Tall"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 150,
				},
				/***********	TALL FENCE 5	 ****************/
				{
					// The unique identifier for this blueprint & information
					[Key.ID]: BlueprintLookupEnum.TALL_FENCE_5,
					[Key.NAME]: "Tall Fence 5",
					[Key.MODEL]: BLUEPRINT_FOLDER.fences.tall.tall_fence_5,
					[Key.DESCRIPTION]: "A tall fence for protection.",

					// The materials required to build this blueprint
					[Key.MATERIALS]: [
						[Materials.WOOD, 40],
					],

					// The time it takes to build this blueprint
					[Key.BUILD_TIME]: 50,

					// The icon for this blueprint
					[Key.ICON]: "rbxassetid://123456789",

					// Repoint to this category
					[Key.CATEGORY]: Category.FENCES,
					[Key.SUBCATEGORY]: Categories[Category.FENCES]["Tall"],

					// Whether this blueprint is for sale
					[Key.FOR_SALE]: true,
					[Key.PRICE]: 150,
				},
			]
		}
	}

	export function getBlueprintDimensions(model: Model, decimanl: number = 2) {
		const [ _ , size ] = model.GetBoundingBox();
		return new Vector3(
			Math.Round(size.X, decimanl),
			Math.Round(size.Y, decimanl),
			Math.Round(size.Z, decimanl),
		);
	}

	export function getSubcategoryName(category : Category, subcategory : number) : string {
		const subcategories = Categories[category]
		
		for ( const [ name, id ] of Object.entries(subcategories) ) {
			if ( id === subcategory ) return name as string;
		}

		return "Unknown"
	}
	
	export function getBlueprintFromLookupEnum(lookupEnum: BlueprintLookupEnum) {
		let blueprintResult: Type | undefined;

		Object.keys(Blueprints).forEach((category) => {
			const castedCategory = category as keyof typeof Blueprints;
			
			Object.keys(Blueprints[castedCategory as Category.BUILDING]).forEach((subcategory) => {
				for (const blueprint of Blueprints[castedCategory as Category.BUILDING][subcategory]) {
					if (blueprint[Key.ID] === lookupEnum) {
						blueprintResult = blueprint as Type;
						break;
					}
				}
			})
		});

		return blueprintResult;
	}
}