import { Grasslands } from "../Biomes/Grasslands";

export abstract class BiomeVertex {
	public static getHeightAt(x : number, z : number) : [ number, number[] ] {
		let biome_height = Grasslands.getHeightAt(x, z);
		return biome_height
	};
}