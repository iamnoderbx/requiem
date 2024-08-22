import { BaseEntity } from "client/entities/BaseEntity";
import { ClientPlayerEntity } from "client/entities/player/ClientPlayerEntity";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { Chunk } from "./Chunks/Chunk";
import MemoryCacheInstance from "./Cache/Part";
import { TERRAIN_WEDGE_PART } from "./Cache/TerrainWedgePart";
import { TERRAIN_MODEL } from "./Cache/TerrainModel";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import Octree from "@rbxts/octo-tree";
import { WATER_LEVEL } from "./Cache/Water";
import { Wall } from "./Chunks/Wall";
import { CHUNK_CELL_SIZE, getCellCenterFromWorldPosition, getResolutionFromDistance } from "./Chunks/Parallel/GenerateChunkParallel";

@Controller()
export class TerrainController {
    private client!: ClientPlayerEntity
    private allocation!: MemoryCacheInstance

    private connection: RBXScriptConnection | undefined;
    private loaded: Map<string, Chunk> = new Map();

    private render_distance = 10; // 16
    private octree: Octree<Chunk> = new Octree();
    private water_planes: Map<Vector3, Instance> = new Map();

    private walls: Record<"Maria" | "Rose" | "Sina", Wall> = {
        Maria: new Wall(60000),
        Rose: new Wall(30000),
        Sina: new Wall(15000)
    }

    private total_chunk_renders: number = 0;

    // Object to store the x and y coordinates of the current cell
    private onTerrainCellChange(xVector: number, zVector: number, position: Vector3) {
        const character = this.client.getCharacterModel()
        const root = character?.PrimaryPart

        if (!root) return

        // Loop through the cells in the render distance
        for (let x = -this.render_distance; x <= this.render_distance; x++) {
            for (let z = -this.render_distance; z <= this.render_distance; z++) {
                const vector = new Vector3(x + xVector, 1, z + zVector).mul(CHUNK_CELL_SIZE)
                const vectorKey = `${math.round(vector.X)},${math.round(vector.Z)}`;
                
                const distance = vector.sub(root.Position).Magnitude
                if (distance > (CHUNK_CELL_SIZE * this.render_distance)) {
                    continue
                }

                if (!this.loaded.has(vectorKey)) {

                    const cell_center = vector.add(new Vector3(CHUNK_CELL_SIZE / 2, 0, CHUNK_CELL_SIZE / 2));
                    const distance = (new Vector3(cell_center.X, 0, cell_center.Z)).sub(new Vector3(position.X, 0, position.Z)).Magnitude;
                    const subdivisions = getResolutionFromDistance(distance);

                    const chunk = new Chunk(CHUNK_CELL_SIZE, subdivisions);
                    chunk.renderParrallel(x + xVector, z + zVector, this.allocation);

                    this.total_chunk_renders++;
                    this.loaded.set(vectorKey, chunk);

                    // if (this.total_chunk_renders % 20 === 0) {
                    //     RunService.RenderStepped.Wait();
                    // }

                    // Round the position to the nearest 2048.
                    // const water_vector = new Vector3(math.floor(vector.X / 2048) * 2048, 0, math.floor(vector.Z / 2048) * 2048);
                    // if (!this.water_planes.has(water_vector)) {
                    //     const water_plane = new Instance("Part");
                    //     water_plane.Size = new Vector3(2048, 5, 2048);
                    //     water_plane.Position = new Vector3(water_vector.X, WATER_LEVEL - 2.5, water_vector.Z);
                    //     water_plane.Anchored = true;
                    //     water_plane.CanCollide = false;
                    //     water_plane.Transparency = 0.5;
                    //     water_plane.Color = Color3.fromRGB(135, 179, 245);
                    //     water_plane.Material = Enum.Material.Foil;
                    //     water_plane.Parent = Workspace;

                    //     this.water_planes.set(water_vector, water_plane);
                    // }

                    this.octree.CreateNode(vector, chunk);
                }
            }
        }
    }

    public async initialize() {

        // const new_wall = new Wall(15000, 5);
        // new_wall.load(300)
        // new_wall.render(new Vector3(0, 0, 0), 15000 * 2, false)

        // this.client = await BaseEntity.resolveClientEntity()
        // this.allocation = new MemoryCacheInstance(TERRAIN_WEDGE_PART, 4 * ((this.render_distance * this.render_distance) * (6 * 6) * 4), TERRAIN_MODEL)

        // let last_position: Vector3 | undefined = undefined

        // this.connection = RunService.RenderStepped.Connect(() => {
        //     const character = this.client.getCharacterModel()
        //     const root = character?.PrimaryPart

        //     if (!root) return

        //     const loadTerrainCell = () => {
        //         const x = math.floor(root.Position.X / CHUNK_CELL_SIZE)
        //         const z = math.floor(root.Position.Z / CHUNK_CELL_SIZE)
        //         this.onTerrainCellChange(x, z, getCellCenterFromWorldPosition(root.Position))
        //     }

        //     if (!last_position) {
        //         last_position = root.Position
        //         return loadTerrainCell()
        //     }

        //     // Check if the player has moved half a cell
        //     const distance = root.Position.sub(last_position).Magnitude
        //     if (distance > (CHUNK_CELL_SIZE)) {
        //         loadTerrainCell()
        //         last_position = root.Position

        //         // Remove chunks that are out of the render distance
        //         const nodes = this.octree.GetAllNodes()
        //         for (const node of nodes) {
        //             const distance = node.Position.sub(root.Position).Magnitude
        //             if (distance > (CHUNK_CELL_SIZE * (this.render_distance * 1.5))) {
        //                 this.loaded.delete(node.Object.getVectorLookupKey())
        //                 this.octree.RemoveNode(node)

        //                 node.Object.destroy(this.allocation)
        //             }
        //         }
        //     }

        //     if (distance > CHUNK_CELL_SIZE) {
        //         const nearby = this.octree.SearchRadius(root.Position, CHUNK_CELL_SIZE * 13);
        //         // const decoration_nearby = this.octree.SearchRadius(root.Position, CHUNK_CELL_SIZE * 10);

        //         // decoration_nearby.forEach((node) => {
        //         //     const chunk = node.Object
        //         //     if(!chunk.isDecorated()) {
        //         //         chunk.decorate()
        //         //     }
        //         // })

        //         // nearby.forEach((node) => {
        //         //     const chunk = node.Object
        //         //     const world_position = new Vector3(chunk.getWorldPosition().X, root.Position.Y, chunk.getWorldPosition().Z)
        //         //     const current_distance = world_position.sub(getCellCenterFromWorldPosition(root.Position)).Magnitude

        //         //     const resolution = getResolutionFromDistance(current_distance)

        //         //     if (chunk.getSubdivisions() !== resolution && chunk.getSubdivisions() < resolution) {
        //         //         chunk.setSubdivisions(resolution)
        //         //         chunk.rerender(this.allocation)
        //         //     }
        //         // })
        //     }
        // })
    }
}