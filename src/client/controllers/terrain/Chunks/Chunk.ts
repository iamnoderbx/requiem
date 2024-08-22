// !native

import { Geometry } from "shared/utilities/geometry.utilities";
import { BiomeVertex } from "./Vertex";
import { Players, RunService, Workspace } from "@rbxts/services";
import MemoryCacheInstance from "../Cache/Part";
import { TERRAIN_WEDGE_PART } from "../Cache/TerrainWedgePart";
import { WATER_LEVEL } from "../Cache/Water";
import { DECORATION_SAMPLE_SIZE, getCellCenterFromWorldPosition, getResolutionFromDistance } from "../Resolution";
import { Requiem } from "shared/Requiem";
import { Multithreading } from "shared/utilities/threading/Multithreading";
import { GenerateChunkParallel, getBiomeAtWorldPosition, getResolutionFromBiome } from "./Parallel/GenerateChunkParallel";

export type Square = {
	// The position of the vertice in the world
	world_position: Vector3;

	// The height of the vertice
	corners: Array<Vector3>;

	// Edges of the square
	edges: Array<Vector3[]>;
}

const parallel = new Multithreading(32, GenerateChunkParallel);

export class Chunk {
	public resolution: number = 4;
	private subdivisions: number = this.resolution / 2;

	public local_position: Vector3 = new Vector3(0, 0, 0);
	public world_position: Vector3 = new Vector3(0, 0, 0);
	public real_position: Vector3 = new Vector3(0, 0, 0);

	private lookup_key: string = "";

	private rendered: boolean = false;
	private triangles: BasePart[] = [];

	private model: Model = new Instance("Model");
	private render_index: number = 0;

	private isChunkDecorated: boolean = false;

	private pXRender : number = 0;
	private pZRender : number = 0;

	constructor(resolution: number, subdivisions: number) {
		this.resolution = resolution;
		this.subdivisions = subdivisions;
	}

	public renderParrallel(xPos: number, zPos: number, allocation: MemoryCacheInstance) {
		this.pXRender = xPos;
		this.pZRender = zPos;

		this.world_position = new Vector3(
			(xPos + 0.5) * this.resolution,
			0,
			(zPos + 0.5) * this.resolution
		);
		
		const [ biome] = getBiomeAtWorldPosition(this.world_position)
		const dominent_resolution = getResolutionFromBiome(biome);
		const free = allocation.release(4 * ((dominent_resolution * dominent_resolution)));
		this.triangles = free

		parallel.execute(xPos, zPos, this.resolution, dominent_resolution, free);
		this.rendered = true;
	}

	public getVectorLookupKey() {
		return this.lookup_key;
	}

	public setVectorLookupKey(key: string) {
		this.lookup_key = key;
	}

	public setSubdivisions(subdivisions: number) {
		this.subdivisions = subdivisions;
	}

	public getSubdivisions() {
		return this.subdivisions;
	}

	public getWorldPosition() {
		return this.world_position;
	}

	public isDecorated() {
		return this.isChunkDecorated;
	}

	public destroy(allocation: MemoryCacheInstance) {
		this.triangles.forEach(triangle => {
			allocation.reallocatePart(triangle);
		})

		this.triangles = [];
		this.model.Parent = undefined;

		this.rendered = false;
	}

	public rerender(allocation: MemoryCacheInstance) {
		if (!this.rendered) return;
		this.rendered = false;

		this.triangles.forEach(triangle => {
			allocation.reallocatePart(triangle);
		})

		this.render_index++;
		this.triangles = [];
		this.renderParrallel(this.pXRender, this.pZRender, allocation);
	}
}