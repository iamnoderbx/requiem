
export namespace StylizedBlockGeneration {
	export type StylizedTerrainSettings = {
		RockColor : Color3,
		OffsetColor: boolean,
		Layers: number,
		
		RecursionDepth: number,
		MinimumDimensions : number,
		ExtrusionPercentage : number,
		BoundingPercentage : number,
		Seed: number,

		GrassColor: Color3,
		Grass: boolean,
		Overhang: number,
		Thickness: number,
		FoilagePercentage: number,

		Offset?: Vector3,
	}

	type TerrainAccessoryProxy = {
		Size : Vector3,
		Position : Vector3,
		CFrame : CFrame,
		Parent: BasePart | undefined,
	}

	function IsPointInVolume(point : Vector3, volumeCenter : CFrame, volumeSize : Vector3) {
		const volumeSpacePoint = volumeCenter.PointToObjectSpace(point);
		return volumeSpacePoint.X >= -volumeSize.X / 2
			&& volumeSpacePoint.X <= volumeSize.X / 2
			&& volumeSpacePoint.Y >= -volumeSize.Y / 2
			&& volumeSpacePoint.Y <= volumeSize.Y / 2
			&& volumeSpacePoint.Z >= -volumeSize.Z / 2
			&& volumeSpacePoint.Z <= volumeSize.Z / 2
	}

	function IsPartInBoundry(part : TerrainAccessoryProxy | BasePart, boundryPart : TerrainAccessoryProxy | BasePart, addedZone : Vector3 | undefined) {
		for(let x = -1; x <= 1; x += 2) {
			for(let z = -1; z <= 1; z += 2) {
				for(let y = -1; y <= 1; y += 2) {
					const corner = part.Position
						.add(part.CFrame.RightVector.mul(x).mul(part.Size.X / 2))
						.add(part.CFrame.UpVector.mul(y).mul(part.Size.Y / 2))
						.add(part.CFrame.LookVector.mul(z).mul(part.Size.Z / 2))

					if(!IsPointInVolume(corner, boundryPart.CFrame, boundryPart.Size.add(addedZone ?? new Vector3()))) {
						return false;
					}
				}
			}
		}

		return true;
	}

	function GetRandomPointAlongRandomEdge(
		random : Random, 
		pointA : Vector3, 
		pointB : Vector3, 
		pointC : Vector3, 
		pointD : Vector3, 
		edgeToAvoid : number | undefined
	) {
		const getRandomPointOnEdge = (p1 : Vector3, p2 : Vector3) => {
			const t = random.NextNumber();
			return p1.Lerp(p2, t);
		}

		let edgeIndex = random.NextInteger(1, 4);

		if(edgeToAvoid) {
			if(edgeToAvoid === 1) edgeToAvoid = 3;
			else if(edgeToAvoid === 2) edgeToAvoid = 4;
			else if(edgeToAvoid === 3) edgeToAvoid = 1;
			else if(edgeToAvoid === 4) edgeToAvoid = 2;
		}

		const getRandomEdgeExceptAvoiding = () : number => {
			let edge = random.NextInteger(1, 4);
			if(edge === edgeToAvoid) return getRandomEdgeExceptAvoiding();
			return edge;
		}

		if(edgeToAvoid) edgeIndex = getRandomEdgeExceptAvoiding();

		let randomPoint! : Vector3;

		if(edgeIndex === 1) randomPoint = getRandomPointOnEdge(pointA, pointB);
		else if(edgeIndex === 2) randomPoint = getRandomPointOnEdge(pointB, pointC);
		else if(edgeIndex === 3) randomPoint = getRandomPointOnEdge(pointC, pointD);
		else if(edgeIndex === 4) randomPoint = getRandomPointOnEdge(pointD, pointA);

		return $tuple(randomPoint, edgeIndex);
	}

	function UpdateBlockTerrainAccessories(
		random : Random, 					// Random number generator
		base : BasePart | TerrainAccessoryProxy,// Base part to generate the terrain on
		state : StylizedTerrainSettings, 	// Terrain settings
		accessories : Model | undefined, 	// Model to add the terrain accessories to
		recursion_depth : number = 0, 		// Recursion depth/level
		edgeToAvoid : number | undefined, 	// Edge to avoid
		parents : (TerrainAccessoryProxy | BasePart)[]	// Parent parts
	) {
		const base_distance = base.Size.Magnitude;

		let accessory_model = accessories ?? base.Parent?.FindFirstChild("Accessories") as Model ?? new Instance("Model");

		if((accessory_model.Parent !== undefined) && recursion_depth === 0) {
			accessory_model.ClearAllChildren()
		} else if(accessory_model.Parent === undefined) {
			accessory_model.Name = "Accessories";
			accessory_model.Parent = base.Parent;
		}

		// Split the main part in to banding layers.
		const bottom = base.Position.sub(new Vector3(0, base.Size.Y / 2, 0));

		// Get the top four corners of the top face of the main part.
		const lastHandfulOfPoints: Vector3[] = []

		// BasePart & Edge
		const newly_added: [TerrainAccessoryProxy, number][] = []

		for(let i = 0; i < state.Layers; i++) {
			// Get the height of the layer
			const height = bottom.Y + (base.Size.Y / state.Layers) * i;
			const vector = new Vector3(base.Position.X, height, base.Position.Z).sub(new Vector3(0, 5, 0))

			// Get all corners to create edges
			const cornerA = vector.add(new Vector3(base.Size.X / 2, 0, base.Size.Z / 2));
			const cornerB = vector.add(new Vector3(base.Size.X / 2, 0, -base.Size.Z / 2));
			const cornerC = vector.add(new Vector3(-base.Size.X / 2, 0, -base.Size.Z / 2));
			const cornerD = vector.add(new Vector3(-base.Size.X / 2, 0, base.Size.Z / 2));

			const getRandomPointAlongEdge = (depth : number = 0) : LuaTuple<[Vector3, number]> => {
				const [ point, edge ] = GetRandomPointAlongRandomEdge(random, cornerA, cornerB, cornerC, cornerD, edgeToAvoid);
				if(depth > 3) return $tuple(point, edge);

				let isPointInLastThreePoints = false;

				for(const lastPoint of lastHandfulOfPoints) {
					const lastPointYRemoved = new Vector3(lastPoint.X, 0, lastPoint.Z);
					const pointYRemoved = new Vector3(point.X, 0, point.Z);

					if(lastPointYRemoved.sub(pointYRemoved).Magnitude < base_distance / 5) {
						isPointInLastThreePoints = true;
						break;
					}
				}

				if(isPointInLastThreePoints) return getRandomPointAlongEdge(depth + 1);

				if(lastHandfulOfPoints.size() > (state.Layers / 2)) lastHandfulOfPoints.shift();

				lastHandfulOfPoints.push(point);
				return $tuple(point, edge);
			}

			const [ point, edge ] = getRandomPointAlongEdge();

			// Get the distance between the point and the bottom of the base part
			const distance = (vector.Y - bottom.Y)
			const position = point;

			if (distance < 5) continue;

			const accessory_proxy : TerrainAccessoryProxy = {
				Size: new Vector3(), CFrame: new CFrame(), Position: new Vector3(),
				Parent: undefined,
			}

			accessory_proxy.Size = new Vector3(
				((base.Size.X / 1.5) + random.NextInteger(-base.Size.X / 3, base.Size.X / 3)) * (state.ExtrusionPercentage / 100), 
				distance, 
				(base.Size.Z / 1.5 + random.NextInteger(-base.Size.X / 3, base.Size.X / 3)) * (state.ExtrusionPercentage / 100)
			)

			if(accessory_proxy.Size.X < state.MinimumDimensions) accessory_proxy.Size = new Vector3(accessory_proxy.Size.X + state.MinimumDimensions, accessory_proxy.Size.Y, accessory_proxy.Size.Z);
			if(accessory_proxy.Size.Z < state.MinimumDimensions) accessory_proxy.Size = new Vector3(accessory_proxy.Size.X, accessory_proxy.Size.Y, accessory_proxy.Size.Z + state.MinimumDimensions);
			if(accessory_proxy.Size.Y < state.MinimumDimensions) accessory_proxy.Size = new Vector3(accessory_proxy.Size.X, accessory_proxy.Size.Y + state.MinimumDimensions, accessory_proxy.Size.Z);

			accessory_proxy.Position = new Vector3(position.X, bottom.Y + distance / 2, position.Z).add(new Vector3(random.NextNumber() / 10, 0, random.NextNumber() / 10)).add(state.Offset ?? new Vector3(0, 0, 0));
			accessory_proxy.CFrame = new CFrame(accessory_proxy.Position);

			// Check if the accessory proxy is within the main part
			const bounding_box_size = base.Size.mul(state.BoundingPercentage / 100);
			if(!(accessory_proxy === parents[0]) && IsPartInBoundry(accessory_proxy, parents[0], bounding_box_size)) continue;

			parents.push(accessory_proxy)
			newly_added.push([accessory_proxy, edge])
		}

		// Loop through all newly added parts
		for (const [_, newly_added_part] of pairs(newly_added)) {
			const accessory = newly_added_part[0];
			const edge = newly_added_part[1];

			let isSafeBounds = true;

			//Loop through all parents.
			for (const parent of parents) {
				if (parent !== accessory) {
					if (IsPartInBoundry(accessory, parent, undefined)) {
						isSafeBounds = false;
						break;
					}
				}
			}

			if(!isSafeBounds) {
				parents.pop();
				continue;
			}


			// Check if the recursion depth is greater then 0
			// If the recursion depth is greater then 0, then we can add more accessories to the accessory
			if(state.RecursionDepth && state.RecursionDepth > 0 && isSafeBounds) {
				if(recursion_depth < state.RecursionDepth) {
					UpdateBlockTerrainAccessories(random, accessory, state, accessory_model, recursion_depth + 1, edge, parents);
				}
			}
		}

		return parents;
	}

	function AddGrassLayerToMainPart(main : BasePart, state : StylizedTerrainSettings, accessories : Model) {
		const height = state.Thickness;
		const overhang = state.Overhang;

		const size = new Vector3(main.Size.X + overhang, height, main.Size.Z + overhang);
		const position = main.Position.add(new Vector3(0, main.Size.Y / 2 + height / 2, 0));

		const grass = new Instance("Part");
		grass.Size = size
		grass.Position = position
		grass.Anchored = true
		grass.Color = state.GrassColor
		grass.Material = Enum.Material.Grass
		grass.Name = "Grass"
		grass.Parent = accessories
	}

	function CreateRockDressingPart(state : StylizedTerrainSettings) {
		const main = new Instance("Part");
		main.Color = state.RockColor;
		main.Anchored = true;
		main.Material = Enum.Material.Slate;
		main.Name = "Rock";

		return main;
	}

	export function CreateBaseRockFormation(size : Vector3, position : Vector3) {
		const rock = new Instance("Part")
		rock.Size = size;
		rock.Position = position;
		rock.Anchored = true;
		rock.Material = Enum.Material.Slate;
		rock.Name = "Rock";
		rock.Color = Color3.fromRGB(100, 100, 100);


		return rock;
	}

	export function CreateStylizedRockFormation(state : StylizedTerrainSettings, base : BasePart, group : Model) {
		const random = new Random(math.clamp(math.floor(base.Position.X) + math.floor(base.Position.Y) + math.floor(base.Position.Z) + (state.Seed * 5), -100000, 100000));
		const valid_accessories = UpdateBlockTerrainAccessories(random, base, state, undefined, 0, undefined, [ base ])

		const updateTerrainColor = (part : BasePart) : void => {
			// We're offsetting the color. We'll offset the value of the hsv.
			if(state.OffsetColor) {
				const [ h, s, v ] = Color3.toHSV(state.RockColor);
				const offset = random.NextNumber(-0.1, 0.1);
				
				part.Color = Color3.fromHSV(h, s, v + offset);
			}
		}

		updateTerrainColor(base);

		valid_accessories.forEach(accessory => {
			if(accessory === base) return;

			const part = CreateRockDressingPart(state);
			part.Size = accessory.Size;
			part.Position = accessory.Position;

			updateTerrainColor(part);
			
			const shouldDressWithGrass = state.Grass && random.NextInteger(1, 100) <= state.FoilagePercentage;
			if(shouldDressWithGrass && part !== base) {
				AddGrassLayerToMainPart(part, state, group.WaitForChild("Accessories") as Model);
			} else if(part !== base) {
				part.Size = part.Size.mul(1.05);
			}

			part.Parent = group.WaitForChild("Accessories") as Model;
		})

		if(state.Grass) {
			AddGrassLayerToMainPart(base, state, group.WaitForChild("Accessories") as Model);
		}
	}
}
