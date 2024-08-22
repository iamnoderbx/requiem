import { Assets } from "shared/types/Assets";
import ClientPlotService, { EditorPropertyValue } from "../ClientPlotService";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Requiem } from "shared/Requiem";

export class ClientTerrainEditorTool {
	private isEnabled: boolean = false;
	private isDrawingTerrain : boolean = false;

	private connections : Array<RBXScriptConnection> = [];
	private height_connections : Array<RBXScriptConnection> = [];

	private marker : Assets["other"]["path_line"] | undefined = undefined;
	private markers : Array<Assets["other"]["path_line"]> = [];

	private height_axis_widget : Handles = new Instance("Handles");
	private axis_bounds : BasePart = new Instance("Part");

	private width_axis_widget : Handles = new Instance("Handles");
	private depth_axis_widget : Handles = new Instance("Handles");

	private height : number = 10;

	private outlineAttachments : Array<Attachment> = [];
	private outlineBeams : Array<Beam> = [];

	private start : Vector3 | undefined = undefined;
	private selectedTerrainModel : Model | undefined = undefined;

	private maximum_bands : number = 7;
	
	constructor(private clientPlotService : ClientPlotService) {
		this.height_axis_widget.Style = Enum.HandlesStyle.Resize;
		this.height_axis_widget.Color3 = Color3.fromRGB(0, 255, 18);
		this.height_axis_widget.Faces = new Faces(Enum.NormalId.Top);

		this.width_axis_widget.Style = Enum.HandlesStyle.Resize;
		this.width_axis_widget.Color3 = Color3.fromRGB(255, 0, 0);
		this.width_axis_widget.Faces = new Faces(Enum.NormalId.Left, Enum.NormalId.Right);

		this.depth_axis_widget.Style = Enum.HandlesStyle.Resize;
		this.depth_axis_widget.Color3 = Color3.fromRGB(0, 18, 255);
		this.depth_axis_widget.Faces = new Faces(Enum.NormalId.Front, Enum.NormalId.Back);

		this.axis_bounds.Anchored = true;
		this.axis_bounds.CanCollide = false;
		this.axis_bounds.CanQuery = false;

		this.axis_bounds.Transparency = 1;
	}
	
	private getModelPivotPoint(model : Model) {
		const stone = model.FindFirstChild("Stone") as Part | undefined;
		if(stone) return $tuple(stone.CFrame, stone.Size);

		return model.GetBoundingBox();
	}

	private getRandomExcludingCenter(rng : Random, min: number, max: number, exclusionZone: number): number {
		// Split the range into two segments excluding the center zone [-exclusionZone, exclusionZone]
		const lowerRangeMax = -exclusionZone;
		const upperRangeMin = exclusionZone;
	
		// Ensure there's a valid range on both sides of the exclusion zone
		if (min > lowerRangeMax || max < upperRangeMin) {
			return rng.NextNumber(min, max);
		}
	
		// Randomly choose one of the two segments
		const useLowerRange = rng.NextNumber(0, 1) < 0.5;
	
		if (useLowerRange) {
			// If using the lower range, adjust max to the lower range max
			return rng.NextNumber(min, lowerRangeMax);
		} else {
			// If using the upper range, adjust min to the upper range min
			return rng.NextNumber(upperRangeMin, max);
		}
	}

	private clearTerrainAccessories(model : Model) {
		const folder = model.FindFirstChild("Accessories") as Folder | undefined;
		if(folder) folder.GetChildren().forEach((child) => child.Destroy());
	}

	private redrawTerrainAccessories(model : Model) {
		let folder = model.FindFirstChild("Accessories") as Folder | undefined;
		if(folder) folder.GetChildren().forEach((child) => child.Destroy());

		if(!folder) {
			folder = new Instance("Folder");
			folder.Name = "Accessories";
			folder.Parent = model;
		}

		// The central stone model.
		const stone = model.FindFirstChild("Stone") as Part | undefined;
		if(!stone) return;

		const total_height = stone.Size.Y;
		const bottom = stone.Position.add(new Vector3(0, -total_height / 2, 0));

		const [ overhang_percent, seed, bands, recursion, rotation, foilage, down_weight ] = this.getTerrainModelProperties(model);

		const stone_rng = stone.Position.X + stone.Position.Y + stone.Position.Z + stone.Size.X + stone.Size.Y + stone.Size.Z;

		let seed_offset = 0;
		let rng = new Random(seed + stone_rng + seed_offset);

		const createStonePart = () => {
			const rng_color = math.random(80, 115)
			const stone_color = Color3.fromRGB(rng_color, rng_color, rng_color);

			const base = new Instance("Part");
			base.Anchored = true;
			base.Color = stone_color
			base.Material = Enum.Material.Slate;
			base.Name = "Stone";

			return base
		}

		const raw_band_vectors = new Array<Vector3>();

		for (let i = 0; i < bands; i++) {
			// Split the height into bands.
			const band_height = total_height / bands;
			const band_position = band_height * i;

			// Create a band vector.
			const band_vector = bottom.add(new Vector3(0, band_position, 0));
			raw_band_vectors.push(band_vector);
		}

		// Get the distance between the two corners of the stone.
		const cornerA = new Vector3(stone.Size.X / 2, 0, stone.Size.Z / 2);
		const cornerB = new Vector3(-stone.Size.X / 2, 0, -stone.Size.Z / 2);

		// Get the other two corners.
		const cornerC = new Vector3(stone.Size.X / 2, 0, -stone.Size.Z / 2);
		const cornerD = new Vector3(-stone.Size.X / 2, 0, stone.Size.Z / 2);

		// Get the distance between the two corners.
		const distance_2 = cornerC.sub(cornerD).Magnitude;
		const distance_1 = cornerA.sub(cornerB).Magnitude;

		const distance = (distance_1 + distance_2) / 2;
		const overhang = distance * (overhang_percent / 100);

		// Create new stone parts for each band.
		raw_band_vectors.forEach((band_vector) => {
			const band_stone = createStonePart();

			// Calculate a random height offset of the band.
			const height_offset = rng.NextNumber(-5, 5);

			// Calculate a random band position from the center.
			// However the origin of the band must be within the stone.
			const band_x = this.getRandomExcludingCenter(rng, -(stone.Size.X / 2), (stone.Size.X / 2), 15);
			const band_z = this.getRandomExcludingCenter(rng, -(stone.Size.Z / 2), (stone.Size.Z / 2), 15);

			let band_position = band_vector.add(new Vector3(band_x, 0, band_z));

			const band_width = rng.NextNumber((stone.Size.X / 1.5), (stone.Size.X / 2) + overhang);
			const band_depth = rng.NextNumber((stone.Size.Z / 1.5), (stone.Size.Z / 2) + overhang);

			const random_rotation = rng.NextNumber(-rotation, rotation);

			// Distance from ground
			const distance = band_position.Y - bottom.Y;

			band_stone.Size = new Vector3(band_width, distance + 15, band_depth);
			band_stone.Position = band_position.add(new Vector3(0, (height_offset - (distance / 2)), 0)).sub(new Vector3(0, -down_weight, 0));
			band_stone.CFrame = band_stone.CFrame.mul(CFrame.Angles(0, math.rad(random_rotation), 0));

			band_stone.Parent = folder;

			const shouldAddGrass = rng.NextNumber(0, 100) < foilage;
			if(shouldAddGrass) {
				const grass = band_stone.Clone();
				grass.Size = new Vector3(band_width + 0.2, 1, band_depth + 0.2);
				grass.Position = band_stone.Position.add(new Vector3(0, band_stone.Size.Y / 2, 0));
				grass.Color = Color3.fromRGB(63, 111, 66);
				grass.Material = Enum.Material.Grass;
				grass.Name = "Grass";
				grass.Parent = folder;
			}
		})
	}
	
	private getTerrainModelProperties(model : Model) {
		const overhang = (model.GetAttribute("Overhang") ?? 50) as number;
		const seed = (model.GetAttribute("Seed") ?? 1 )as number;
		const bands = (model.GetAttribute("Bands") ?? 0) as number;
		const recursion = (model.GetAttribute("Recursion") ?? 0) as number;
		const rotation = (model.GetAttribute("Rotation") ?? 0) as number;
		const foilage = (model.GetAttribute("Foilage") ?? 50) as number;
		const down_weight = (model.GetAttribute("Weight") ?? -5) as number;

		return $tuple(overhang, seed, bands, recursion, rotation, foilage, down_weight);
	}

	public onTerrainCellSelected(model : Model) {
		if(this.selectedTerrainModel === model) return;
		this.selectedTerrainModel = model;

		const stone = model.FindFirstChild("Stone") as Part | undefined;
		if(!stone) return;

		const [ overhang, seed, bands, recursion, rotation, foilage, down_weight ] = this.getTerrainModelProperties(model);

		this.clientPlotService.setSelectionProperties({
			["Overhang"]: { enabled: true, type: "number", value: overhang, increments: 10, minimum: 10, maximum: 100, suffix: " percent" },
			["Seed"]:  { enabled: true, type: "number", value: seed, increments: 1, minimum: 1, maximum: 100, suffix: "" },
			["Bands"]: { enabled: true, type: "number", value: bands, increments: 1, minimum: 0, maximum: this.maximum_bands, suffix: " bands"},
			["Recursion"]: { enabled: true, type: "number", value: recursion, increments: 1, minimum: 0, maximum: 3, suffix: " depth"},
			["Rotation"]: { enabled: true, type: "number", value: rotation, increments: 5, minimum: 0, maximum: 360, suffix: " degrees"},
			["Foilage"]: { enabled: false, type: "number", value: foilage, increments: 10, minimum: 10, maximum: 100, suffix: " percent"},
			["Weight"]: { enabled: false, type: "number", value: down_weight, increments: 5, minimum: -20, maximum: 0, suffix: " studs"},
		})

		// Get the models size.
		let [ pivot, size ] = this.getModelPivotPoint(model)

		// Create a movement axis part.
		this.axis_bounds.Size = size
		this.axis_bounds.CFrame = pivot;
		this.axis_bounds.Parent = Workspace

		let previous_distance : number = 0;

		const displayAxisWidget = (widget : Handles) => {
			widget.Adornee = this.axis_bounds;
			widget.Visible = true;
			widget.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
		}

		displayAxisWidget(this.height_axis_widget);
		displayAxisWidget(this.width_axis_widget);
		displayAxisWidget(this.depth_axis_widget);

		const createDetectionConnections = (widget : Handles) => {
			const leaving = widget.MouseButton1Up.Connect((axis) => {
				this.clientPlotService.isHoveringRotationWidget = false;
				previous_distance = 0;
			});
	
			const clicked = widget.MouseButton1Down.Connect(() => {
				this.clientPlotService.isHoveringRotationWidget = true;
				previous_distance = 0;

				this.clearTerrainAccessories(model);
			});

			this.height_connections.push(leaving);
			this.height_connections.push(clicked);
		}

		const updateDimensionsOfModel = (axis : Enum.NormalId, distance : number) => {
			let delta_distance = distance - previous_distance;
			let resizeDirection = Vector3.FromNormalId(axis);

			const stone = model.FindFirstChild("Stone") as Part | undefined;
			if(!stone) return;

			const grass = model.FindFirstChild("Grass") as Part | undefined;

			if(resizeDirection.X === -1 || resizeDirection.Y === -1 || resizeDirection.Z === -1) {
				stone.Size = stone.Size.add(resizeDirection.mul(-1).mul(delta_distance))
			} else {
				stone.Size = stone.Size.add(resizeDirection.mul(delta_distance))
			}

			stone.CFrame = stone.CFrame.mul(new CFrame(resizeDirection.mul(delta_distance / 2)));
			previous_distance = distance;

			if(grass) {
				grass.Size = new Vector3(stone.Size.X + 0.2, 1, stone.Size.Z + 0.2);
				grass.Position = stone.Position.add(new Vector3(0, stone.Size.Y / 2, 0));
			}

			let [ update_origin, updated_size ] = this.getModelPivotPoint(model)

			this.axis_bounds.Size = updated_size
			this.axis_bounds.CFrame = update_origin

			this.clearTerrainAccessories(model);
			this.redrawTerrainAccessories(model);
		};

		createDetectionConnections(this.height_axis_widget)
		createDetectionConnections(this.width_axis_widget)
		createDetectionConnections(this.depth_axis_widget)

		const draggedXAxis = this.width_axis_widget.MouseDrag.Connect((axis, distance) => updateDimensionsOfModel(axis, distance));
		const draggedYAxis = this.height_axis_widget.MouseDrag.Connect((axis, distance) => updateDimensionsOfModel(axis, distance));
		const draggedZAxis = this.depth_axis_widget.MouseDrag.Connect((axis, distance) => updateDimensionsOfModel(axis, distance));

		this.height_connections.push(draggedYAxis);
		this.height_connections.push(draggedXAxis);
		this.height_connections.push(draggedZAxis);
	}

	public onTerrainCellDeselected(model : Model) {
		this.height_axis_widget.Visible = false;
		this.axis_bounds.Parent = undefined;

		this.width_axis_widget.Visible = false;
		this.depth_axis_widget.Visible = false;
		
		this.height_connections.forEach((connection) => connection.Disconnect());
		this.height_connections = [];

		this.selectedTerrainModel = undefined;
	}

	public updateTerrainProperty(model : Model, property : string, value : EditorPropertyValue) {
		const stone = model.FindFirstChild("Stone") as Part | undefined;
		if(!stone) return;

		if(model.Name !== "Terrain") return;

		// Get all of the properties.
		// overhang, seed, bands, recursion
		model.SetAttribute(property, value.value);
		this.redrawTerrainAccessories(model);
	}

	private onTerrainCreation(startPos : Vector3, endPos : Vector3) {
		const folder = this.clientPlotService.folders.get(this.clientPlotService.plotEditing!)!;

		this.cleanMarkerConnections();

		const model = new Instance("Model");
		model.Name = "Terrain";

		// Create the terrain
		const center = startPos.add(endPos).div(2);
		
		// Get the size of the part that will be created
		const size = endPos.sub(startPos).Abs();
		
		const rng_color = math.random(80, 115)
		const stone_color = Color3.fromRGB(rng_color, rng_color, rng_color);

		// Get the height position of the lower point
		const height = startPos.Y < endPos.Y ? startPos.Y : endPos.Y;
		const difference = math.abs(startPos.Y - endPos.Y);

		// Create the base of the terrain
		const base = new Instance("Part");
		base.Size = new Vector3(size.X, this.height + difference, size.Z);
		base.Position = new Vector3(center.X, 0, center.Z).add(new Vector3(0, height + ((this.height + difference) / 2), 0));
		base.Anchored = true;
		base.Color = stone_color
		base.Material = Enum.Material.Slate;
		base.Name = "Stone";
		base.Parent = Workspace;

		// Add a one stud thick layer on top of the base for grass
		const grass = base.Clone();
		grass.Size = new Vector3(size.X + 0.2, 1, size.Z + 0.2);
		grass.Position = base.Position.add(new Vector3(0, (difference + this.height) / 2, 0));
		grass.Color = Color3.fromRGB(63, 111, 66);
		grass.Material = Enum.Material.Grass;
		grass.Name = "Grass";
		grass.Parent = Workspace;

		// Create the terrain model
		grass.Parent = model;
		base.Parent = model;

		model.Parent = folder;
	}

	private cleanMarkerConnections() {
		this.outlineAttachments.forEach((attachment) => attachment.Destroy());
		this.outlineAttachments = [];

		this.outlineBeams.forEach((beam) => beam.Destroy());
		this.outlineBeams = [];

		this.markers.forEach((marker) => marker.Destroy());
		this.markers = [];

		this.start = undefined;
	}

	private cleanTerrainEditor() {
		this.connections.forEach((connection) => connection.Disconnect());
		this.connections = [];

		this.cleanMarkerConnections()

		if(this.marker) this.marker.Destroy();
		this.marker = undefined;

		this.isDrawingTerrain = false;
	}

	private createOutlineBeams(startPos : Vector3, endPos : Vector3) {
		// Two attachments of the corners that align the two editing locations
		const cornerA = new Vector3(startPos.X, startPos.Y, endPos.Z);
		const cornerB = new Vector3(endPos.X, startPos.Y, startPos.Z);

		// Create the attachments for the outline beams
		const attachmentA = new Instance("Attachment");
		attachmentA.Position = cornerA;
		attachmentA.Parent = Workspace.Terrain

		const attachmentB = new Instance("Attachment");
		attachmentB.Position = cornerB;
		attachmentB.Parent = Workspace.Terrain

		const attachmentC = new Instance("Attachment");
		attachmentC.Position = startPos;
		attachmentC.Parent = Workspace.Terrain

		const attachmentD = new Instance("Attachment");
		attachmentD.Position = endPos;
		attachmentD.Parent = Workspace.Terrain

		this.outlineAttachments.push(attachmentA);
		this.outlineAttachments.push(attachmentB);
		this.outlineAttachments.push(attachmentC);
		this.outlineAttachments.push(attachmentD);

		// Four beams for each side of the editing location
		for (let i = 0; i < 4; i++) {
			const beam = new Instance("Beam");
			beam.Attachment0 = this.outlineAttachments[i];
			beam.Attachment1 = this.outlineAttachments[(i + 1) % 4];
			beam.FaceCamera = true;
			beam.Width0 = 0.1;
			beam.Width1 = 0.1;
			beam.Color = new ColorSequence(Color3.fromRGB(255, 255, 255));
			beam.Parent = this.outlineAttachments[i];
			this.outlineBeams.push(beam);
		}
	}

	private updateOutlineBeams(startPos : Vector3, endPos : Vector3) {
		const cornerA = new Vector3(startPos.X, startPos.Y, endPos.Z);
		const cornerB = new Vector3(endPos.X, startPos.Y, startPos.Z);

		this.outlineAttachments[0].Position = startPos;
		this.outlineAttachments[1].Position = cornerA;
		this.outlineAttachments[2].Position = endPos;
		this.outlineAttachments[3].Position = cornerB;

		for (let i = 0; i < 4; i++) {
			this.outlineBeams[i].Attachment0 = this.outlineAttachments[i];
			this.outlineBeams[i].Attachment1 = this.outlineAttachments[(i + 1) % 4];
		}
	}

	public onTerrainEditorEnabled() {
		this.marker = Requiem.Assets.other.path_line.Clone();
		this.marker.Parent = Workspace;

		this.isEnabled = true;

		let start_position : Vector3 | undefined;

		const input = UserInputService.InputBegan.Connect((input) => {
			if(input.UserInputType !== Enum.UserInputType.MouseButton1) return;
			
			const start_marker = this.marker!.Clone();
			start_marker.Parent = Workspace;
			start_marker.CFrame = new CFrame(this.marker!.Position);

			this.markers.push(start_marker);

			const beam = new Instance("Beam")
			beam.Attachment0 = this.marker!.Attachment;
			beam.Attachment1 = start_marker.Attachment;
			beam.FaceCamera = true;
			beam.Width0 = 0.1;
			beam.Width1 = 0.1;
			beam.Color = new ColorSequence(Color3.fromRGB(255, 0, 0));
			beam.Parent = start_marker;

			// User is drawing a path.
			this.isDrawingTerrain = true;

			this.start = this.marker!.Position;
			start_position = this.start

			this.createOutlineBeams(start_position, this.marker!.Position);
		});

		const input_end = UserInputService.InputEnded.Connect((input) => {
			if(input.UserInputType !== Enum.UserInputType.MouseButton1) return;

			// User has finished drawing a path.
			this.isDrawingTerrain = false;

			if(!this.start || !this.marker) return;
			this.onTerrainCreation(this.start!, this.marker!.Position);
		})

		this.connections.push(input);
		this.connections.push(input_end);
	}

	public onTerrainCFrameUpdated(model : Model) {
		if(this.axis_bounds && this.axis_bounds.Parent === Workspace) {
			let [ update_origin, updated_size ] = this.getModelPivotPoint(model);

			this.axis_bounds.Size = updated_size
			this.axis_bounds.CFrame = update_origin
		}

		this.clearTerrainAccessories(model);
		this.redrawTerrainAccessories(model);
	}
	
	public onTerrainEditorDisabled() {
		this.isEnabled = false;
		this.cleanTerrainEditor();
	}

	public onTerrainEditorUpdate() {
		// Runs every frame.
		if(!this.marker) return;

		const isShiftHeld = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) || UserInputService.IsKeyDown(Enum.KeyCode.RightShift);

		const folder = this.clientPlotService.folders.get(this.clientPlotService.plotEditing!)!;

		const params = new RaycastParams()
		params.FilterDescendantsInstances = isShiftHeld ? [ this.marker, folder ] : [ this.marker ]
		params.FilterType = Enum.RaycastFilterType.Exclude

		const mouse = Players.LocalPlayer.GetMouse();
		const ray = Workspace.CurrentCamera!.ScreenPointToRay(mouse.X, mouse.Y);
		const raycast = Workspace.Raycast(ray.Origin, ray.Direction.mul(2000), params);

		this.marker.Position = raycast?.Position ?? new Vector3(0, 0, 0);
		
		if(!this.start || !this.isDrawingTerrain) return;
		this.updateOutlineBeams(this.start, this.marker.Position);
	}

	public isTerrainEditorEnabled() {
		return this.isEnabled;
	}
}