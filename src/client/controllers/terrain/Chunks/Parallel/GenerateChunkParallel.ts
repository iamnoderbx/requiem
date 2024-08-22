import { Assets } from "shared/types/Assets";

const assets = game.GetService("ReplicatedStorage").WaitForChild("assets") as unknown as Assets

	const TERRAIN_WEDGE_PART = assets.other.WaitForChild("Triangle").Clone() as BasePart
	TERRAIN_WEDGE_PART.Size = new Vector3(1, 0.1, 1)
	TERRAIN_WEDGE_PART.Anchored = true
	TERRAIN_WEDGE_PART.Material = Enum.Material.Grass
	TERRAIN_WEDGE_PART.Color = Color3.fromRGB(77, 138, 69)
	TERRAIN_WEDGE_PART.Name = "TerrainTriangle"

export const CHUNK_CELL_SIZE = 1500; // 700

const Players = game.GetService("Players");
const height_cache : Record<string, number> = new SharedTable() as Record<string, number>;

const shared_index = new SharedTable() as Record<string, number>;
shared_index["render_index"] = 0;

type Grid = Record<number, Record<number, Vector3>>;

enum Biomes {
	FOREST,
	TERRACES,
	PLAINS
}

/**
 * triangle
 * Creates two wedge parts to form a triangle between three points in 3D space.
 * 
 * @param a A Vector3 representing the first vertex of the triangle.
 * @param b A Vector3 representing the second vertex of the triangle.
 * @param c A Vector3 representing the third vertex of the triangle.
 * @param w1 A BasePart representing the first wedge part.
 * @param w2 A BasePart representing the second wedge part.
 * 
 * @returns Tuple<BasePart, BasePart> The two wedge parts forming the triangle.
 * @author NodeSupport
 */
function triangle(a: Vector3, b: Vector3, c: Vector3, w1: BasePart, w2: BasePart) {
	// Calculate vectors between the points
	let ab = b.sub(a);
	let ac = c.sub(a);
	let bc = c.sub(b);
	
	// Calculate the dot products of the vectors
	let abd = ab.Dot(ab);
	let acd = ac.Dot(ac);
	let bcd = bc.Dot(bc);
	
	// Determine the longest side and reorder points if necessary
	if (abd > acd && abd > bcd) {
		let temp = c;
		c = a;
		a = temp;
	} else if (acd > bcd && acd > abd) {
		let temp = a;
		a = b;
		b = temp;
	}
	
	// Recalculate vectors after reordering points
	ab = b.sub(a);
	ac = c.sub(a);
	bc = c.sub(b);
	
	// Calculate the unit vectors for the triangle's orientation
	const right = ac.Cross(ab).Unit;
	const up = bc.Cross(right).Unit;
	const back = bc.Unit;
	
	// Calculate the height of the triangle and define the thickness of the wedges
	const height = math.abs(ab.Dot(up));
	const thickness = 5;
	const halfThickness = thickness / 2;
	
	// Calculate the CFrame for the first wedge
	let wedge1CFrame = CFrame.fromMatrix(a.add(b).div(2), right, up, back);
	// Calculate the CFrame for the second wedge
	let wedge2CFrame = CFrame.fromMatrix(a.add(c).div(2), right.mul(-1), up, back.mul(-1));
	
	// Adjust the CFrame if the wedge is upside down
	if (wedge1CFrame.RightVector.Y < 0) {
		wedge1CFrame = wedge1CFrame.mul(new CFrame(halfThickness, 0, 0));
	} else {
		wedge1CFrame = wedge1CFrame.mul(new CFrame(-halfThickness, 0, 0));
	}
	
	// Adjust the CFrame if the wedge is upside down
	if (wedge2CFrame.RightVector.Y < 0) {
		wedge2CFrame = wedge2CFrame.mul(new CFrame(halfThickness, 0, 0));
	} else {
		wedge2CFrame = wedge2CFrame.mul(new CFrame(-halfThickness, 0, 0));
	}
	
	// // Synchronize the task to ensure thread safety
	// task.synchronize();
	
	// // Set the size and CFrame for the second wedge
	// w2.Size = new Vector3(thickness, height, math.abs(ac.Dot(back)));
	// w2.CFrame = wedge2CFrame;
	
	// // Set the size and CFrame for the first wedge
	// w1.Size = new Vector3(thickness, height, math.abs(ab.Dot(back)));
	// w1.CFrame = wedge1CFrame;
	
	// // Desynchronize the task after modifications
	// task.desynchronize();
	
	// Return the two wedge parts forming the triangle
	return $tuple(
		[new Vector3(thickness, height, math.abs(ac.Dot(back))), wedge2CFrame],
		[new Vector3(thickness, height, math.abs(ab.Dot(back))), wedge1CFrame]
	);
}

// Define a simplex noise function to generate terrain height
function simplex(x: number, y: number, frequency: number, amplitude: number, persistence: number, octaves: number, seed: number) {
	let total = 0;
	let maxAmplitude = 0;
	let amp = 1;
	let freq = frequency;

	// Loop through each octave to generate noise
	for (let i = 0; i < octaves; i++) {
		total = total + math.noise(x * freq, y * freq, seed * 174812) * amp;
		maxAmplitude = maxAmplitude + amp;
		amp = amp * persistence;
		freq = freq * 2;
	}

	// Normalize the total noise value
	let normalizedTotal = total / maxAmplitude;
	return (normalizedTotal * amplitude + 1) / 2;
}

/**
 * getCellCenterFromWorldPosition
 * Returns the center position of a cell in the grid based on the given world position.
 * 
 * @param position A Vector3 representing the world position.
 * 
 * @returns Vector3 The center position of the cell in the grid.
 * @author NodeSupport
 */
export function getCellCenterFromWorldPosition(position: Vector3) {
    return new Vector3(
        math.floor(position.X / CHUNK_CELL_SIZE) * CHUNK_CELL_SIZE + CHUNK_CELL_SIZE / 2,
        0,
        math.floor(position.Z / CHUNK_CELL_SIZE) * CHUNK_CELL_SIZE + CHUNK_CELL_SIZE / 2
    );
}

/**
 * getResolutionFromDistance
 * Returns the resolution based on the given distance.
 * 
 * @param distance A number representing the distance.
 * 
 * @returns number The resolution corresponding to the distance.
 * @author NodeSupport
 */
export function getResolutionFromDistance(distance: number): number {
    return 2;
}

/**
 * getBiomeAtWorldPosition
 * Returns the biome at the given world position.
 * 
 * @param pos The world position to get the biome at
 * 
 * @returns The biome at the given world position
 * @author NodeSupport
 */
export function getBiomeAtWorldPosition(pos: Vector3) {
	const x = pos.X;
	const z = pos.Z;

	const humidity = simplex(x, z, 0.0002, 1, 0.2, 2, 122);
	const temperature = simplex(x, z, 0.0002, 1, 0.2, 3, 12);

	if (humidity > 0.5 && temperature > 0.4) {
		return $tuple(Biomes.FOREST, humidity, temperature);;
	}

	return $tuple(Biomes.PLAINS, humidity, temperature);
}

/**
 * getResolutionFromBiome
 * Returns the resolution based on the given biome.
 * 
 * @param biome The biome to get the resolution from
 * 
 * @returns number The resolution corresponding to the biome
 * @author NodeSupport
 */
export function getResolutionFromBiome(biome : Biomes) {
	switch(biome) {
		case Biomes.FOREST:
			return 6;
		case Biomes.TERRACES:
			return 6;
		case Biomes.PLAINS:
			return 6;
	}
}

/**
 * getNeighboringGrids
 * Returns the neighboring grids of a grid
 * 
 * @param world_position A Vector3 representing the world position of the grid
 * @param resolution The resolution of the grid
 
 * @returns Map<string, { subdivisions: number, position: Vector3 }> The neighboring grids of the grid
 * @author NodeSupport
 */
function getNeighboringGrids(world_position: Vector3, resolution: number) {
    // Initialize a map to store neighboring grids with their subdivisions and positions
    const neighbors = new Map<string, { subdivisions: number, position: Vector3 }>();
    const directions = ['top', 'bottom', 'left', 'right'];

    // Ensure the local player's character is loaded
    if (!Players.LocalPlayer.Character) Players.LocalPlayer.CharacterAdded.Wait();

    const character = Players.LocalPlayer.Character;
    // If the character is still not available, return the empty neighbors map
    if (!character) return neighbors;

    const root = character.PrimaryPart;
    // If the character's root part is not available, return the empty neighbors map
    if (!root) return neighbors;

    // Iterate over each direction to calculate the neighboring grid positions
    directions.forEach(direction => {
        // Calculate the position of the neighboring grid based on the direction
        const position = world_position.add(new Vector3(
            direction === 'left' ? -resolution : direction === 'right' ? resolution : 0,
            0,
            direction === 'top' ? resolution : direction === 'bottom' ? -resolution : 0
        ));

		const [ biome, humidity, temperature ] = getBiomeAtWorldPosition(position);
		const neighbor_resolution = getResolutionFromBiome(biome);

        // Add the neighboring grid's information to the map
        neighbors.set(direction, { subdivisions: neighbor_resolution, position: position });
    });

    // Return the map containing all neighboring grids
    return neighbors;
}

/**
 * alignEdgeWithLowerSubdivision
 * Aligns the edge of a grid with a lower subdivision
 * 
 * @param resolution The resolution of the grid
 * @param subdivisions The number of subdivisions in the grid
 * @param grid A grid of Vector3s
 * @param world_position The world position of the grid
 * @param direction The direction to align the edge
 * 
 * @returns void
 * @author NodeSupport
 */
function alignEdgeWithLowerSubdivision(resolution : number, subdivisions: number, grid: Grid, world_position : Vector3, direction: string) {
	const step = resolution / subdivisions;

		switch (direction) {
		case 'top':
			// Loop through each subdivision along the top edge
			for (let i = 0; i < subdivisions + 1; i++) {
				const x = world_position.X - (resolution / 2) + (i * step);
				const center_point = new Vector3(x, 0, world_position.Z + (resolution / 2));
	
				// Check if the current index is odd and the necessary grid points exist
				if (i % 2 !== 0 && grid[center_point.X] && grid[center_point.X - step] && grid[center_point.X + step]) {
					const neighborAVertex = grid[center_point.X - step][center_point.Z];
					const neighborBVertex = grid[center_point.X + step][center_point.Z];
	
					// If both neighboring vertices exist, average their heights
					if (neighborAVertex && neighborBVertex) {
						const height = new Vector3(center_point.X, (neighborAVertex.Y + neighborBVertex.Y) / 2, center_point.Z);
						grid[center_point.X][center_point.Z] = height;
					}
				}
			}
			break;
		case 'bottom':
			// Loop through each subdivision along the bottom edge
			for (let i = 0; i < subdivisions; i++) {
				const x = world_position.X - (resolution / 2) + (i * step);
				const center_point = new Vector3(x, 0, world_position.Z - (resolution / 2));
	
				// Check if the current index is odd and the necessary grid points exist
				if (i % 2 !== 0 && grid[center_point.X] && grid[center_point.X - step] && grid[center_point.X + step]) {
					const neighborAVertex = grid[center_point.X - step][center_point.Z];
					const neighborBVertex = grid[center_point.X + step][center_point.Z];
	
					// If both neighboring vertices exist, average their heights
					if (neighborAVertex && neighborBVertex) {
						const height = new Vector3(center_point.X, (neighborAVertex.Y + neighborBVertex.Y) / 2, center_point.Z);
						grid[center_point.X][center_point.Z] = height;
					}
				}
			}
			break;
		case 'left':
			// Loop through each subdivision along the left edge
			for (let i = 0; i < subdivisions; i++) {
				const z = world_position.Z - (resolution / 2) + (i * step);
				const center_point = new Vector3(world_position.X - (resolution / 2), 0, z);
	
				// Check if the current index is odd and the necessary grid points exist
				if (i % 2 !== 0 && grid[center_point.X] && grid[center_point.X][z - step] && grid[center_point.X][z + step]) {
					const neighborAVertex = grid[center_point.X][z - step];
					const neighborBVertex = grid[center_point.X][z + step];
	
					// If both neighboring vertices exist, average their heights
					if (neighborAVertex && neighborBVertex) {
						const height = new Vector3(center_point.X, (neighborAVertex.Y + neighborBVertex.Y) / 2, center_point.Z);
						grid[center_point.X][center_point.Z] = height;
					}
				}
			}
			break;
		case 'right':
			// Loop through each subdivision along the right edge
			for (let i = 0; i < subdivisions + 1; i++) {
				const z = world_position.Z - (resolution / 2) + (i * step);
				const center_point = new Vector3(world_position.X + (resolution / 2), 0, z);
	
				// Check if the current index is odd and the necessary grid points exist
				if (i % 2 !== 0 && grid[center_point.X] && grid[center_point.X][z - step] && grid[center_point.X][z + step]) {
					const neighborAVertex = grid[center_point.X][z - step];
					const neighborBVertex = grid[center_point.X][z + step];
	
					// If both neighboring vertices exist, average their heights
					if (neighborAVertex && neighborBVertex) {
						const height = new Vector3(center_point.X, (neighborAVertex.Y + neighborBVertex.Y) / 2, center_point.Z);
						grid[center_point.X][center_point.Z] = height;
					}
				}
			}
			break;
	}
}

/**
 * alignEdgesWithNeighbors
 * Aligns the edges of the current grid with its neighboring grids if they have lower subdivisions.
 * 
 * @param resolution The resolution of the grid.
 * @param subdivisions The number of subdivisions in the grid.
 * @param grid The grid data structure.
 * @param world_position A Vector3 representing the world position of the grid.
 * @param neighbors A Map containing the neighboring grids with their subdivisions and positions.
 * 
 * @returns void
 * @author NodeSupport
 */
function alignEdgesWithNeighbors(resolution : number, subdivisions: number, grid: Grid, world_position : Vector3, neighbors: Map<string, { subdivisions: number, position: Vector3 }>) {
	let hasRealignedNeighbors = false;

	// Iterate over each neighbor in the neighbors map
	neighbors.forEach((neighbor, direction) => {
		// Check if the neighbor has fewer subdivisions than the current grid
		if (neighbor.subdivisions < subdivisions) {
			// Align the edge of the current grid with the neighboring grid that has lower subdivisions
			alignEdgeWithLowerSubdivision(resolution, subdivisions, grid, world_position, direction);
			hasRealignedNeighbors = true;
		}
	});

	return hasRealignedNeighbors;
}

/**
 * GenerateChunkExecutioner
 * Generates a chunk of terrain based on the given parameters.
 * 
 * @param xPos The x position of the chunk
 * @param zPos The z position of the chunk
 * @param resolution The resolution of the chunk
 * @param subdivisions The amount of subdivisions in the chunk
 * @param available The pool of available BaseParts
 * 
 * @returns void
 * @author NodeSupport
 */
export default function GenerateChunkExecutioner(xPos : number, zPos : number, resolution : number, subdivisions : number, available : BasePart[]) {
	// Initialize an empty grid object
	let grid: Grid = {};
	
	// Calculate the world position of the grid based on xPos and zPos
	let world_position = new Vector3(
		(xPos + 0.5) * resolution,
		0,
		(zPos + 0.5) * resolution
	);

	// Extract the X and Z coordinates from the world position
	const worldX = world_position.X;
	const worldZ = world_position.Z;

	// Function to get the height at a specific (x, z) coordinate
	const getHeightAt = (x: number, z: number, biome: Biomes, humidity: number, temperature: number, terracing: number) => {
		// Warp parameters
		const warpFrequency = 0.05;
		const warpAmplitude = 10;
	
		// Warp the input coordinates
		const warpX = x + simplex(x, z, warpFrequency, warpAmplitude, 0.5, 3, 42);
		const warpZ = z + simplex(x, z, warpFrequency, warpAmplitude, 0.5, 3, 43);
	
		// Generate base noise using warped coordinates
		const baseNoise = simplex(warpX, warpZ, 0.0003, 2, 0.1, 2, 124);
		const exponent = 1.6;
	
		const exponentialNoise = math.pow(math.abs(1 + baseNoise), exponent);
		let height = exponentialNoise * 120;
	
		return height;
	}

	const [ biome ] = getBiomeAtWorldPosition(world_position);

	// Calculate half of the resolution and the step size based on subdivisions
	const halfResolution = resolution / 2;
	const step = resolution / subdivisions;

	// Loop through each subdivision to generate the grid
	for (let i = 0; i < subdivisions; i++) {
		for (let j = 0; j < subdivisions; j++) {
			// Calculate the x and z coordinates for the current subdivision
			const x = worldX - halfResolution + (i * step);
			const z = worldZ - halfResolution + (j * step);
	
			// Define the four corners of the current square in the grid
			const square: Vector3[] = [
				new Vector3(x, 0, z),
				new Vector3(x + step, 0, z),
				new Vector3(x, 0, z + step),
				new Vector3(x + step, 0, z + step)
			];
	
			// Loop through each corner of the square
			for (const corner of square) {
				// Get the height at the current corner, using cache if available
				const [ biome, humidity, temperature, terracing ] = getBiomeAtWorldPosition(corner);
				const height = height_cache[`${corner.X},${corner.Z}`] || getHeightAt(corner.X, corner.Z, biome, humidity, temperature, terracing);

				const vector = new Vector3(corner.X, height, corner.Z);
	
				// Initialize the grid column if it doesn't exist
				if (!grid[corner.X]) grid[corner.X] = {};
				// Set the height vector for the current corner in the grid
				grid[corner.X][corner.Z] = vector;
	
				// Cache the height for future use
				height_cache[`${corner.X},${corner.Z}`] = height;
			}
		}
	}

	// Get the neighboring grids of the current grid based on its world position and resolution
	const neighbors = getNeighboringGrids(world_position, resolution);

	// Align the edges of the current grid with its neighboring grids
	alignEdgesWithNeighbors(resolution, subdivisions, grid, world_position, neighbors);
	
	// Initialize a counter for the number of rendered triangles
	let render_count = 0;

	let triangles : Map<BasePart, [Vector3, CFrame]> = new Map();

	let triangleList : BasePart[] = [];
	let cFrameTriangleList : CFrame[] = [];

	// Loop through each subdivision in the grid
	for (let i = 0; i < subdivisions; i++) {
		for (let j = 0; j < subdivisions; j++) {
			// Calculate the x and z coordinates for the current subdivision
			const x = world_position.X - (resolution / 2) + (i * step);
			const z = world_position.Z - (resolution / 2) + (j * step);
	
			// Ensure grid entries exist before accessing them
			if (!grid[x] || !grid[x + step] || !grid[x][z] || !grid[x + step][z] || !grid[x][z + step] || !grid[x + step][z + step]) {
				continue; // Skip to the next iteration if any grid entry is missing
			}
	
			// Increment the render count
			render_count++;
	
			// Retrieve the four corners of the current square in the grid
			const bottomLeft = grid[x][z];
			const bottomRight = grid[x + step][z];
			const topLeft = grid[x][z + step];
			const topRight = grid[x + step][z + step];
	
			// Pop four available BasePart objects from the available pool
			const triangleA = available.pop() as BasePart;
			const triangleB = available.pop() as BasePart;
			const triangleC = available.pop() as BasePart;
			const triangleD = available.pop() as BasePart;
	
			// Create two triangles to form the current square in the grid
			const [ triangleAData, triangleBData ] = triangle(bottomLeft, bottomRight, topLeft, triangleA, triangleB);
			const [ triangleCData, triangleDData ] = triangle(topRight, bottomRight, topLeft, triangleC, triangleD);

			triangles.set(triangleA, triangleAData as [Vector3, CFrame]);
			triangles.set(triangleB, triangleBData as [Vector3, CFrame]);
			triangles.set(triangleC, triangleCData as [Vector3, CFrame]);
			triangles.set(triangleD, triangleDData as [Vector3, CFrame]);

			triangleList.push(triangleA);
			triangleList.push(triangleB);
			triangleList.push(triangleC);
			triangleList.push(triangleD);

			cFrameTriangleList.push(triangleAData[1] as CFrame);
			cFrameTriangleList.push(triangleBData[1] as CFrame);
			cFrameTriangleList.push(triangleCData[1] as CFrame);
			cFrameTriangleList.push(triangleDData[1] as CFrame);
		}
	}

	task.synchronize();

	//const triangleBasepartList = triangles.
	
	const s = os.clock()

	triangles.forEach((data, triangle) => {
		// const triangleWedge = TERRAIN_WEDGE_PART.Clone();
		// triangleWedge.Size = data[0];
		// triangleWedge.CFrame = data[1];

		// triangleWedge.Parent = game.GetService("Workspace");

		triangle.Size = data[0];
		triangle.CFrame = data[1];

		triangle.Color = biome === Biomes.FOREST ? Color3.fromRGB(33, 102, 33) : Color3.fromRGB(107, 153, 105);

		// shared_index["render_index"] = shared_index["render_index"] + 1;
		// if(shared_index["render_index"] % 10 === 0) {
		// 	task.wait(math.random() / 3)
		// }
	})

	print("Time to render: ", os.clock() - s)

	task.desynchronize();
}

export const GenerateChunkParallel = script as ModuleScript;