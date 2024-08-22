import { Keybinds } from "shared/Keybindings";
import { ClientPlayerEntity } from "../../ClientPlayerEntity";
import { PlotDataSerialized, PlotSharedSelectors } from "selectors/PlotSharedSelectors";
import { Plots } from "shared/Plots";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { Requiem } from "shared/Requiem";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { ClientPlotCamera } from "./ClientPlotCamera";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { States } from "../../ClientPlayerStates";
import { Blueprint } from "shared/Blueprint";
import { Memory } from "shared/utilities/memory.utilities";
import { Debug } from "shared/utilities/debug.utilities";
import { Assets } from "shared/types/Assets";
import { Bezier } from "shared/utilities/bezier/Bezier";
import { Geometry } from "shared/utilities/geometry.utilities";
import { ROOT_SCREEN_GUI } from "client/interfaces/CoreInterfaceProvider";
import Object from "@rbxts/object-utils";
import { ClientTerrainEditorTool } from "./tools/ClientTerrainEditorTool";

export const EditorToolSubscription : symbol = {} as symbol;
export const EditorToolState = Memory.subscription<number>(EditorToolSubscription, 0);

export type EditorPropertyValue = {
	enabled: boolean,
	type: "dropdown" | "number" | "seed",
	value : string | number | boolean | undefined,
	options?: Array<string>,

	suffix?: string,

	increments?: number,
	minimum?: number,
	maximum?: number,
}

export const EditorSelectionPropertiesSubscription : symbol = {} as symbol;
export const EditorSelectionPropertiesState = Memory.subscription<Record<string, EditorPropertyValue> | undefined>(EditorSelectionPropertiesSubscription);

export const EditorPropertiesVisibleSubscription : symbol = {} as symbol;
export const EditorPropertiesVisibleState = Memory.subscription<boolean>(EditorPropertiesVisibleSubscription, false);

type SnappingStructure = { adornments : Array<HandleAdornment>, faces : Vector3[], corners: CFrame[] }

export default class ClientPlotService {
	private plots: Plots.Plot[] = [];
	private isEditing: boolean = false;

	public plotEditing: Plots.Plot | undefined;
	public folders : Map<Plots.Plot, Folder> = new Map();

	private connections : Array<RBXScriptConnection> = [];
	private selection_connections : Array<RBXScriptConnection> = [];
	private widget_connections : Array<RBXScriptConnection> = [];
	
	private x_axis_widget = new Instance("Handles")
	private z_axis_widget = new Instance("Handles")

	private rotation_widget = new Instance("ArcHandles")
	private axis_bounds = new Instance("Part")

	private rotation_snap : number | undefined = 5;
	private move_snap : number | undefined = 0.2;
	private node_snapping : boolean = false;

	private selection : Model | undefined;

	private tool : number = 0;

	public isHoveringRotationWidget = false;
	private adornments : Array<HandleAdornment> = [];
	private cache_parts : Array<BasePart> = [];
	private node_snap_data : Map<Model, SnappingStructure> = new Map();

	private snap_position_override : Vector3 | undefined;

	// Path drawing tool
	private isPathDrawingEnabled : boolean = false;
	private isDrawingPath : boolean = false;
	private pathDrawingMarker : Assets["other"]["path_line"] | undefined;
	private pathDrawingConnections : Array<RBXScriptConnection> = [];
	private pathDrawingStorage : Instance[] = [];
	private pathPointMarkers : Array<Assets["other"]["path_line"]> = [];
	private pathPoints : Array<Vector3> = [];
	private pathBezierPoints : Array<Vector3> = [];

	private pathBezierInstances : Array<Instance> = [];
	private pathModelPoints : Map<Model, Array<Vector3>> = new Map();

	// Terrain Editor Tool
	private terrainEditorTool = new ClientTerrainEditorTool(this);

	constructor(private player: ClientPlayerEntity) { }

	private isBlueprintValidPlacement(model: Model) {
		// Get the bottom four corners where the model will be placed
		// Where origin is the center of the model.
		const [ origin, size ] = model.GetBoundingBox();

		// Get the corners of the model
		const topLeft = origin.mul(new CFrame(new Vector3(-size.X / 2, 0, size.Z / 2)));
		const topRight = origin.mul(new CFrame(new Vector3(size.X / 2, 0, size.Z / 2)));
		const bottomLeft = origin.mul(new CFrame(new Vector3(-size.X / 2, 0, -size.Z / 2)));
		const bottomRight = origin.mul(new CFrame(new Vector3(size.X / 2, 0, -size.Z / 2)));

		// Raycast down from each corner
		const corners = [topLeft, topRight, bottomLeft, bottomRight];

		const params = new RaycastParams()
		params.FilterDescendantsInstances = [model]
		params.FilterType = Enum.RaycastFilterType.Exclude

		const height = size.Y / 2;
		const expectedYPosition = origin.Y - height / 2;

		const isValidPosition = corners.every((corner) => {
			const ray = Workspace.Raycast(corner.Position, new Vector3(0, -1, 0).mul(height + 0.5), params);
			return ray !== undefined && (ray.Position.Y - expectedYPosition < 2);
		});

		return isValidPosition;
	}

	private getModelFromBasepart(part: BasePart, folder : Folder) {
		let model = part.Parent;
		while (model && !model.IsA("Model") && model.Parent !== folder) model = model.Parent;
		return model as Model | undefined;
	}

	private createNodesForSnappingOnModel(model : Model, color?: Color3) {
		if(this.node_snap_data.has(model)) return this.node_snap_data.get(model);

		const adornments : Array<SphereHandleAdornment> = [];
		let [ origin, size ] = model.GetBoundingBox();

		// Create a part under the model, for each center of edge.
		const holder = new Instance("Part")
		holder.Size = size;
		holder.CFrame = origin;
		
		holder.Transparency = 1;
		holder.Anchored = true;
		holder.CanCollide = false;
		holder.CanTouch = false;
		holder.CanQuery = false;

		this.cache_parts.push(holder);

		holder.Parent = model;

		const corners = this.getModelCorners(model);
		const faces = this.getModelFaces(model);

		const center_faces : Vector3[] = []

		// Create an adornment at a given world position.
		const createAdornment = (position: CFrame, color?: Color3) => {
			// Convert the corner world position to local position relative to the holder.
			const localPointSpace = holder.CFrame.Inverse().mul(position);
		
			const sphereAdornment = new Instance("SphereHandleAdornment");
			sphereAdornment.Adornee = holder;
			sphereAdornment.Radius = 0.055;
			sphereAdornment.Color3 = color ?? Color3.fromRGB(255, 255, 255);
			sphereAdornment.ZIndex = -1;
			sphereAdornment.AlwaysOnTop = true;

			// Set the CFrame to the calculated local space position.
			// Since the adornment is relative to the holder, we use the position directly.
			sphereAdornment.CFrame = new CFrame(localPointSpace.Position);
			sphereAdornment.Parent = holder;

			return sphereAdornment;
		};

		faces.forEach((face) => {
			const faceCenter = face.reduce((acc, corner) => acc.add(corner.Position), new Vector3(0, 0, 0)).div(face.size());
			center_faces.push(faceCenter);

			const sphereAdornment = createAdornment(new CFrame(faceCenter), Color3.fromRGB(255, 0, 0));

			adornments.push(sphereAdornment);
			this.adornments.push(sphereAdornment);
		});

		corners.forEach((corner) => {
			const sphereAdornment = createAdornment(corner, color);
		
			adornments.push(sphereAdornment);
			this.adornments.push(sphereAdornment);
		});

		this.node_snap_data.set(model, { adornments, faces: center_faces, corners });

		return { adornments, faces: center_faces, corners };
	}

	private getModelsWithinBoundingBox(model : Model, folder : Folder) {
		let [ origin, size ] = model.GetBoundingBox();
		size = size.add(new Vector3(1.5, 1.5, 1.5))

		let models : Array<Model> = [];
		
		let target_faces : Array<Vector3> = [];
		let model_faces : Array<Vector3> = [];

		const model_faces_struct = this.getModelFaces(model);
		model_faces_struct.forEach((face) => model_faces.push(face.reduce((acc, corner) => acc.add(corner.Position), new Vector3(0, 0, 0)).div(face.size())));

		Workspace.GetPartBoundsInBox(origin, size).forEach((part) => {
			const target = this.getModelFromBasepart(part, folder);

			if(target === model) return;
			if(target) {
				const { faces } = this.createNodesForSnappingOnModel(target, Color3.fromRGB(255, 145, 0))!
				models.push(target);

				faces.forEach((face) => target_faces.push(face));
			}
		});

		// Check if any cached models are no longer within the bounding box.
		// If they are, remove the adornments.
		this.node_snap_data.forEach((data, target) => {
			if(target === model) return;
			if(models.includes(target)) return;

			data.adornments.forEach((adornment) => adornment.Destroy());
			this.node_snap_data.delete(target);
		});

		// Get the two closest faces, one from the target model and one from the model being dragged.
		let closest_target_face : Vector3 | undefined;
		let closest_model_face : Vector3 | undefined;

		let closest_distance : number | undefined;

		target_faces.forEach((target_face) => {
			model_faces.forEach((model_face) => {
				const distance = target_face.sub(model_face).Magnitude;

				if(!closest_distance || distance < closest_distance) {
					closest_distance = distance;
					closest_target_face = target_face;
					closest_model_face = model_face;
				}
			});
		});

		const distance = closest_distance ?? 0;

		if(closest_distance && closest_target_face && closest_model_face && distance < 1) {
			return { closest_model_face, closest_target_face };
		}
	}

	private createDraggingModel(model : Model, setDragging?: (isDragging: boolean) => void) {
		const folder = this.folders.get(this.plotEditing!)!;

		const localPlayer = Players.LocalPlayer;
		const mouse = localPlayer.GetMouse()!

		mouse.Icon = "rbxasset://textures/advClosed-hand.png"

		// Make the model physicsless
		model.GetDescendants().forEach((part) => {
			if (!part.IsA("BasePart")) return;

			part.CanTouch = false;
			part.CanQuery = false;
			part.CanCollide = false;
			part.Massless = true;
		})

		const [ origin, size ] = model.GetBoundingBox();

		const hitbox = new Instance("Part")
		hitbox.Size = size;
		hitbox.CFrame = origin;
		hitbox.Transparency = 1;
		hitbox.CanCollide = false;
		hitbox.Name = "__hitbox";
		hitbox.Anchored = true;
		hitbox.Parent = model;

		model.Parent = folder;

		let yaw: number = 0;

		const highlight = new Instance("Highlight")
		highlight.Adornee = model;
		highlight.OutlineColor = Color3.fromRGB(25, 153, 255);
		highlight.OutlineTransparency = 0;
		highlight.FillTransparency = 1;

		highlight.Parent = model;

		// Get the height
		const dimensions = Blueprint.getBlueprintDimensions(model);
		const height = dimensions.Y;

		// Get the raycast params
		const params = new RaycastParams()
		params.FilterDescendantsInstances = [model]
		params.FilterType = Enum.RaycastFilterType.Exclude

		if(this.node_snapping) this.createNodesForSnappingOnModel(model);

		const onBlueprintPlaceAttempt = () => {
			highlight.Destroy();

			setDragging && setDragging(false), mouse.Icon = "";

			this.adornments.forEach((adornment) => adornment.Destroy());
			this.adornments = [];

			this.cache_parts.forEach((part) => part.Destroy());
			this.cache_parts = [];

			// Check if the blueprint is a valid placement
			const isValid = this.isBlueprintValidPlacement(model)
			if (!isValid) {
				const highlight = model.FindFirstChildWhichIsA("Highlight") as Highlight | undefined;
				if(highlight) highlight.Parent = undefined;

				Toasts.failed("You cannot place this blueprint here."), model.Destroy();
			}

			// Destroy the connections
			input.Disconnect();
			RunService.UnbindFromRenderStep("blueprint_drag")

			disableYawDynamicRotation();

			// Make the model physicsless
			model.GetDescendants().forEach((part) => {
				if (!part.IsA("BasePart")) return;

				part.CanQuery = true;
				part.CanCollide = true;
			})
		}

		const input = UserInputService.InputEnded.Connect(input => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1) onBlueprintPlaceAttempt();
		});

		const rotateYawBy = (amount: number) => {
			yaw += math.rad(amount);
			model.PivotTo(new CFrame(model.GetPivot().Position).mul(CFrame.Angles(0, yaw, 0)));

			if(model.Name === "Terrain") this.terrainEditorTool.onTerrainCFrameUpdated(model);
		}

		const disableYawDynamicRotation = () => {
			rotationDrag?.Disconnect()
			rotationDrag = undefined;

			UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
			ClientPlotCamera.setCameraRotationEnabled(true);

			UserInputService.MouseDeltaSensitivity = 1;
		}

		let rotationDrag: RBXScriptConnection | undefined;

		// Track rotation
		const rotation = UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.R) return rotateYawBy(90);

			if (input.KeyCode === Enum.KeyCode.LeftShift && !rotationDrag) {
				UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition;

				ClientPlotCamera.setCameraRotationEnabled(false);

				rotationDrag = UserInputService.InputChanged.Connect((input) => {
					if (input.UserInputType !== Enum.UserInputType.MouseMovement) return;

					// Check if the shift key is down
					const isShiftDown = UserInputService.IsKeyDown(Enum.KeyCode.LeftShift);

					if (!isShiftDown) return disableYawDynamicRotation();

					// Check if the mouse is moving left or right via delta.
					const delta = input.Delta;

					if (delta.X > 0) rotateYawBy(this.rotation_snap ?? 1);
					else if (delta.X < 0) rotateYawBy(this.rotation_snap ? -this.rotation_snap : -1);
				})
			}
		})

		RunService.BindToRenderStep("blueprint_drag", Enum.RenderPriority.Camera.Value - 1, () => {
			if (!model.Parent) return RunService.UnbindFromRenderStep("blueprint_drag");
			if(!this.isEditing) return RunService.UnbindFromRenderStep("blueprint_drag");

			if (rotationDrag) return UserInputService.MouseBehavior = Enum.MouseBehavior.LockCurrentPosition, UserInputService.MouseDeltaSensitivity = 0.3;
			else UserInputService.MouseBehavior = Enum.MouseBehavior.Default;

			// Get the mouse position in the world via raycasting
			const viewpoint = Workspace.CurrentCamera!.ScreenPointToRay(mouse.X, mouse.Y);

			// Get the position of the mouse in the world
			const ray = Workspace.Raycast(viewpoint.Origin, viewpoint.Direction.mul(1000), params);
			let position = ray?.Position ?? new Vector3(0, 0, 0);
			if(position && this.move_snap) position = new Vector3(math.floor(position.X / this.move_snap) * this.move_snap, position.Y, math.floor(position.Z / this.move_snap) * this.move_snap);

			if(this.node_snapping && !this.snap_position_override) {
				const results = this.getModelsWithinBoundingBox(model, folder);
				if(results && results.closest_model_face && results.closest_target_face) {
					// The results exist, now we need to snap the model from its center point
					// to match its relative face to the target target
					const relative_face = results.closest_model_face;
					const target_face = results.closest_target_face;

					const offset = target_face.sub(relative_face);
					const new_position = position.add(offset);
					
					if(!this.snap_position_override) this.snap_position_override = new_position;
				}
			} else if (this.node_snapping && this.snap_position_override) {
				const distanceFromSnap = position.sub(this.snap_position_override).Magnitude;
				if(distanceFromSnap > 3) {
					this.snap_position_override = undefined;
				}
			}

			// Check if the position is within the plot.
			const isWithinPlot = this.isVectorWithinPlot(this.plotEditing!, position)
			if (!isWithinPlot) {
				// Clamp the position axis to the plot boundaries.
				const center = this.plotEditing![Plots.Key.POSITION];
				const size = this.plotEditing![Plots.Key.SIZE];

				const halfSize = size / 2;

				const topLeft = new Vector3(center.X - halfSize, center.Y, center.Z + halfSize);
				const bottomRight = new Vector3(center.X + halfSize, center.Y, center.Z - halfSize);

				const clampedX = math.clamp(position.X, topLeft.X, bottomRight.X);
				const clampedZ = math.clamp(position.Z, bottomRight.Z, topLeft.Z);

				position = new Vector3(clampedX, position.Y, clampedZ);
			}

			model.PivotTo(new CFrame((this.snap_position_override ?? position).add(new Vector3(0, height / 2, 0)) ?? new Vector3(0, 0, 0)).mul(CFrame.Angles(0, yaw, 0)));
		})

		this.connections.push(input);
		this.connections.push(rotation);
		this.connections.push(rotationDrag!);

		return [input, rotation, rotationDrag];
	}

	public onBlueprintDragged = (blueprint: Blueprint.Type, setDragging: (isDragging: boolean) => void) => {
		const folder = this.folders.get(this.plotEditing!);
		if (!folder) return Toasts.failed("An error occured while attempting to edit: folder does not exist.");

		const model = blueprint[Blueprint.Key.MODEL].Clone();
		const [input, rotation, rotationDrag] = this.createDraggingModel(model, setDragging);
		return [input, rotation, rotationDrag];
	}

	private getBezierPathCurve() {
		if(!this.plotEditing) return;
		if(!this.pathPoints.size()) return;

		if(this.pathPoints.size() < 3) return;
		
		const steps = 2;
		const step = (1 / (steps * this.pathPoints.size()))

		const bezier = new Bezier(...this.pathPoints)
		const segments = bezier.GetPath(step, true)

		return segments
	}

	private connectPointsWithBeams(points : Array<Vector3>) {
		const attachments : Array<Attachment> = [];
		const beams : Array<Beam> = [];

		// Clear the previous path bezier instances.
		this.pathBezierInstances.forEach((instance) => instance.Destroy());
		this.pathBezierInstances = [];

		points.forEach((point) => {
			const attachment = new Instance("Attachment")
			attachment.Position = point;
			attachment.Parent = Workspace.Terrain

			attachments.push(attachment);
			this.pathBezierInstances.push(attachment);
		});

		for(let i = 0; i < attachments.size() - 1; i++) {
			const beam = new Instance("Beam")
			beam.Attachment0 = attachments[i];
			beam.Attachment1 = attachments[i + 1];
			beam.Transparency = new NumberSequence(0);
			beam.FaceCamera = true;
			beam.Width0 = 0.1;
			beam.Width1 = 0.1;
			beam.Color = new ColorSequence(Color3.fromRGB(255, 0, 0));
			beam.Parent = Workspace;

			this.pathBezierInstances.push(beam);
			beams.push(beam);
		}

		return [ attachments, beams ];
	};

	private onAttemptToDrawPath(startPos : Vector3, endPos : Vector3, old_model?: Model, material?: Enum.Material, color?: Color3, width?: number) {
		const folder = this.folders.get(this.plotEditing!)!;
		if(!folder) return;

		if(this.pathPoints.size() < 3) return;
		
		const model = old_model ?? new Instance("Model")
		model.Name = "Path"
		
		this.pathModelPoints.set(model, table.clone(this.pathPoints));

		if(!this.pathBezierPoints || !this.pathBezierPoints.size() || this.pathPoints.size() < 3) {
			const center = startPos.add(endPos).div(2);
			const size = startPos.sub(endPos).Magnitude;

			const path = new Instance("Part")
			path.Size = new Vector3(6, 0.125, size);
			path.Color = Color3.fromRGB(84, 69, 54);
			path.Material = Enum.Material.Slate;
			path.CFrame = new CFrame(center, endPos);
			path.Anchored = true;
			path.CanCollide = false;
			path.Parent = model;
		} else {
			// Create a path from the bezier.
			let lastPathPart : BasePart | undefined;

			for(let i = 0; i < this.pathBezierPoints.size() - 1; i++) {
				const point = this.pathBezierPoints[i];
				const nextPoint = this.pathBezierPoints[i + 1];

				const center = point.add(nextPoint).div(2);
				const size = point.sub(nextPoint).Magnitude;

				const path = new Instance("Part")
				path.Size = new Vector3(width ?? 6, 0.125 + math.random(900, 1000) / 100000, size);
				path.Color = color ?? Color3.fromRGB(84, 69, 54);
				path.Material = material ?? Enum.Material.Slate;
				path.CFrame = new CFrame(center, nextPoint);
				path.Anchored = true;
				path.CanCollide = false;
				path.Name = "path_part"
				path.Parent = model;

				if(lastPathPart) {
					Geometry.gapfill(lastPathPart, path);
				}

				lastPathPart = path;
			}
		}

		model.Parent = folder;

		this.pathDrawingStorage.forEach((instance) => instance.Destroy());
		this.pathDrawingStorage = [];

		this.pathPointMarkers.forEach((instance) => instance.Destroy());
		this.pathPointMarkers = [];

		this.pathPoints = [];
		this.isDrawingPath = false;

		this.pathBezierInstances.forEach((instance) => instance.Destroy());
		this.pathBezierInstances = [];
	}
	

	private addPointToPath(point : Vector3) {
		// Add a point to the path.
		this.pathPoints.push(point);
		
		// Get the last point marker.
		const lastPointMarker = this.pathPointMarkers[this.pathPointMarkers.size() - 1];
		if(!lastPointMarker) return;

		const beam = lastPointMarker.FindFirstChild("Beam") as Beam | undefined;

		// Create a new point marker.
		const newPointMarker = Requiem.Assets.other.path_line.Clone();
		newPointMarker.Parent = Workspace;
		newPointMarker.Position = point;

		// Set the current beam to the new point marker.
		const currentMarker = this.pathDrawingMarker!;
		const currentBeam = currentMarker.FindFirstChild("Beam") as Beam | undefined;
		if(currentBeam) {
			currentBeam.Attachment1 = newPointMarker.Attachment;
		}

		// Update the beam.
		if(beam) {
			beam.Attachment1 = newPointMarker.Attachment;
			beam.Attachment0 = lastPointMarker.Attachment;
		}

		// Update the last point marker beam if it exists.
		const lastBeam = lastPointMarker.FindFirstChild("Beam") as Beam | undefined;
		if(lastBeam) {
			lastBeam.Attachment1 = newPointMarker.Attachment;
		}

		// Create a new beam.
		const new_beam = new Instance("Beam")
		new_beam.Attachment0 = this.pathDrawingMarker!.Attachment;
		new_beam.Attachment1 = lastPointMarker.FindFirstChild("Attachment") as Attachment;
		new_beam.FaceCamera = true;
		new_beam.Width0 = 0.1;
		new_beam.Width1 = 0.1;
		new_beam.Color = new ColorSequence(Color3.fromRGB(255, 255, 255));
		new_beam.Parent = newPointMarker;

		this.pathPointMarkers.push(newPointMarker);
		this.pathDrawingStorage.push(newPointMarker);

		const points = this.getBezierPathCurve();
		if(points) this.pathBezierPoints = points;

		if(points) this.connectPointsWithBeams(points);
	}

	private onPathDrawingToolUpdate() {
		if(!this.pathDrawingMarker) return;

		const folder = this.folders.get(this.plotEditing!)!;
		const params = new RaycastParams()
		params.FilterDescendantsInstances = [ this.pathDrawingMarker, folder ]
		params.FilterType = Enum.RaycastFilterType.Exclude

		const mouse = Players.LocalPlayer.GetMouse();
		const ray = Workspace.CurrentCamera!.ScreenPointToRay(mouse.X, mouse.Y);
		const raycast = Workspace.Raycast(ray.Origin, ray.Direction.mul(2000), params);

		this.pathDrawingMarker.Position = raycast?.Position ?? new Vector3(0, 0, 0);

		if(!this.isDrawingPath) return;

		// Get the current beam
		const beam = this.pathDrawingMarker.FindFirstChild("Beam") as Beam | undefined;
		if(beam) {
			beam.Attachment1 = this.pathDrawingMarker.Attachment;
			beam.Attachment0 = this.pathPointMarkers[this.pathPointMarkers.size() - 1].Attachment;
		}

		// Get the last point placed.
		const lastPoint = this.pathPoints[this.pathPoints.size() - 1];
		if(!lastPoint) return;

		// Get the distance between the last point and the current point.
		const distance = this.pathDrawingMarker.Position.sub(lastPoint).Magnitude;
		if(distance > 10) this.addPointToPath(this.pathDrawingMarker.Position);
	}

	private enablePathDrawingTool() {
		this.pathDrawingMarker = Requiem.Assets.other.path_line.Clone();
		this.pathDrawingMarker.Parent = Workspace;

		this.isPathDrawingEnabled = true;

		// Reset any lingering path points.
		this.pathPoints = [];
		this.pathPointMarkers = [];

		let start_position : Vector3 | undefined;

		const input = UserInputService.InputBegan.Connect((input) => {
			if(input.UserInputType !== Enum.UserInputType.MouseButton1) return;

			const start_marker = this.pathDrawingMarker!.Clone();
			start_marker.Parent = Workspace;
			start_marker.CFrame = new CFrame(this.pathDrawingMarker!.Position);

			const beam = new Instance("Beam")
			beam.Attachment0 = this.pathDrawingMarker!.Attachment;
			beam.Attachment1 = start_marker.Attachment;
			beam.FaceCamera = true;
			beam.Width0 = 0.1;
			beam.Width1 = 0.1;
			beam.Color = new ColorSequence(Color3.fromRGB(255, 255, 255));
			beam.Parent = start_marker;

			this.pathPointMarkers.push(start_marker);

			this.pathDrawingStorage.push(start_marker);
			this.pathDrawingStorage.push(beam);

			// User is drawing a path.
			this.isDrawingPath = true;
			start_position = this.pathDrawingMarker!.Position;

			this.pathPoints.push(start_position);
		});

		const input_end = UserInputService.InputEnded.Connect((input) => {
			if(input.UserInputType !== Enum.UserInputType.MouseButton1) return;

			// User has finished drawing a path.
			this.isDrawingPath = false;
			this.onAttemptToDrawPath(start_position!, this.pathDrawingMarker!.Position);
		})

		this.pathDrawingConnections.push(input);
		this.pathDrawingConnections.push(input_end);
	}

	private disablePathDrawingTool() {
		this.isPathDrawingEnabled = false;

		this.pathDrawingMarker?.Destroy();
		this.pathDrawingMarker = undefined;

		this.pathDrawingConnections.forEach((connection) => connection.Disconnect());
		this.pathDrawingConnections = [];

		this.pathDrawingStorage.forEach((instance) => instance.Destroy());
		this.pathDrawingStorage = [];

		this.isDrawingPath = false;
	}

	private createAxisMovementHandles(model : Model) {
		// Get the models size.
		let [ origin, size ] = model.GetBoundingBox();

		if(this.rotation_widget.Parent) this.rotation_widget.Parent = undefined;

		this.widget_connections.forEach((connection) => connection.Disconnect());
		this.widget_connections = [];

		// Create a movement axis part.
		this.axis_bounds.Size = size
		this.axis_bounds.CFrame = model.GetPivot();
		
		// Create a X axis movement widget.
		this.x_axis_widget.Adornee = this.axis_bounds;
		this.x_axis_widget.Style = Enum.HandlesStyle.Movement;
		this.x_axis_widget.Visible = true;
		this.x_axis_widget.Color3 = Color3.fromRGB(255, 0, 0);
		this.x_axis_widget.Faces = new Faces(Enum.NormalId.Left, Enum.NormalId.Right);
		this.x_axis_widget.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

		// Create a Z axis movement widget.
		this.z_axis_widget.Adornee = this.axis_bounds;
		this.z_axis_widget.Style = Enum.HandlesStyle.Movement;
		this.z_axis_widget.Visible = true;
		this.z_axis_widget.Color3 = Color3.fromRGB(0, 0, 255);
		this.z_axis_widget.Faces = new Faces(Enum.NormalId.Front, Enum.NormalId.Back);
		this.z_axis_widget.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

		const leaveXAxis = this.x_axis_widget.MouseButton1Up.Connect((axis) => {
			this.isHoveringRotationWidget = false;
		});

		const clickedXAxis = this.x_axis_widget.MouseButton1Down.Connect(() => {
			this.isHoveringRotationWidget = true;
			origin = model.GetPivot();
		});

		const draggedXAxis = this.x_axis_widget.MouseDrag.Connect((axis, distance) => {
			const isNegative = axis === Enum.NormalId.Left ? -1 : 1;
			if(this.move_snap) distance = math.floor(distance / this.move_snap) * this.move_snap;

			model.PivotTo(origin.mul(new CFrame(isNegative * distance, 0, 0)));
			this.axis_bounds.CFrame = model.GetPivot();
		})

		const leaveZAxis = this.z_axis_widget.MouseButton1Up.Connect((axis) => {
			this.isHoveringRotationWidget = false;
		});

		const clickedZAxis = this.z_axis_widget.MouseButton1Down.Connect(() => {
			this.isHoveringRotationWidget = true;
			origin = model.GetPivot();
		})

		const draggedZAxis = this.z_axis_widget.MouseDrag.Connect((axis, distance) => {
			const isNegative = axis === Enum.NormalId.Front ? -1 : 1;
			if(this.move_snap) distance = math.floor(distance / this.move_snap) * this.move_snap;

			model.PivotTo(origin.mul(new CFrame(0, 0, isNegative * distance)));
			this.axis_bounds.CFrame = model.GetPivot();

			if(model.Name === "Terrain") this.terrainEditorTool.onTerrainCFrameUpdated(model);
		})

		this.widget_connections.push(leaveXAxis);
		this.widget_connections.push(clickedXAxis);
		this.widget_connections.push(draggedXAxis);

		this.widget_connections.push(leaveZAxis);
		this.widget_connections.push(clickedZAxis);
		this.widget_connections.push(draggedZAxis);
	}

	private createAxisRotationHandles(model : Model) {
		// Get the models size.
		let [ origin, size ] = model.GetBoundingBox();

		if(this.x_axis_widget.Parent) this.x_axis_widget.Parent = undefined;
		if(this.z_axis_widget.Parent) this.z_axis_widget.Parent = undefined;

		this.widget_connections.forEach((connection) => connection.Disconnect());
		this.widget_connections = [];

		// Create a rotational axis part.
		this.axis_bounds.Size = size
		this.axis_bounds.CFrame = model.GetPivot().add(new Vector3(0, -(size.Y / 2) + 2, 0));
		
		this.rotation_widget.Adornee = this.axis_bounds;
		this.rotation_widget.Visible = true;
		this.rotation_widget.Color3 = Color3.fromRGB(9, 227, 18)
		this.rotation_widget.Axes = new Axes(Enum.Axis.Y)
		this.rotation_widget.Parent = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

		const leave = this.rotation_widget.MouseButton1Up.Connect((axis) => {
			this.isHoveringRotationWidget = false;
		});

		const clicked = this.rotation_widget.MouseButton1Down.Connect(() => {
			this.isHoveringRotationWidget = true;
			origin = model.GetPivot();
		});

		const dragged = this.rotation_widget.MouseDrag.Connect((axis, angle) => {
			let rotation = CFrame.Angles(0, angle, 0);

			if(this.rotation_snap) {
				const snap = math.rad(this.rotation_snap);
				const snapAngle = math.floor(angle / snap) * snap;
				rotation = CFrame.Angles(0, snapAngle, 0);
			}

			model.PivotTo(origin.mul(rotation));
			this.axis_bounds.CFrame = model.GetPivot().add(new Vector3(0, -(size.Y / 2) + 2, 0));

			if(model.Name === "Terrain") this.terrainEditorTool.onTerrainCFrameUpdated(model);
		})

		this.widget_connections.push(leave);
		this.widget_connections.push(clicked);
		this.widget_connections.push(dragged);
	}

	public setMoveSnap(snap : number) {
		this.move_snap = snap === 0 ? undefined : snap;
	}

	public setRotationSnap(snap : number) {
		this.rotation_snap = snap === 0 ? undefined : snap;
	}

	public setNodeSnapping(enabled : boolean) {
		this.node_snapping = enabled;
		if(!enabled) {
			this.node_snap_data.forEach((data) => {
				data.adornments.forEach((adornment) => adornment.Destroy());
			});

			this.node_snap_data.clear();

			this.adornments.forEach((adornment) => adornment.Destroy());
			this.adornments = [];

			this.cache_parts.forEach((part) => part.Destroy());
			this.cache_parts = [];

			this.snap_position_override = undefined;
		}
	}

	private updateTool(tool : number, model?: Model, ignoreStateUpdate?: boolean) {
		this.tool = tool;

		if(tool === 1 && model) this.createAxisMovementHandles(model);
		if(tool === 2 && model) this.createAxisRotationHandles(model);
		if(tool === 3) print("Stair Creation Tool")

		if(tool === 4) this.enablePathDrawingTool();
		else if(tool !== 4 && this.isPathDrawingEnabled) this.disablePathDrawingTool();

		if(tool === 5 && !this.terrainEditorTool.isTerrainEditorEnabled()) {
			this.onBlueprintForceUnselection();
			this.terrainEditorTool.onTerrainEditorEnabled()
		}
		else if(tool !== 5 && this.terrainEditorTool.isTerrainEditorEnabled()) this.terrainEditorTool.onTerrainEditorDisabled();

		if(tool === 5 || tool === 0) {
			this.x_axis_widget.Parent = undefined;
			this.z_axis_widget.Parent = undefined;

			this.rotation_widget.Parent = undefined;
			this.axis_bounds.Parent = undefined;

			this.tool = 0;
		}

		if(!ignoreStateUpdate) EditorToolState.set(this.tool);
	}

	public updateSelectionProperty(property : string, value : EditorPropertyValue) {
		const model = this.selection;
		if(!model) return;

		if(model.Name === "Terrain") this.terrainEditorTool.updateTerrainProperty(model, property, value);

		if(property === "Stylization" && model.Name === "Path") {
			// Update the material of the path.
			model.GetChildren().forEach((part) => {
				if(part.IsA("BasePart")) {
					part.Material = value.value === "Muddy" ? Enum.Material.Slate : value.value === "Concrete" ? Enum.Material.Concrete : Enum.Material.Cobblestone;
					if(part.Material === Enum.Material.Slate) part.Color = Color3.fromRGB(84, 69, 54);
					if(part.Material === Enum.Material.Cobblestone) part.Color = Color3.fromRGB(145, 140, 135);
					if(part.Material === Enum.Material.Concrete) part.Color = Color3.fromRGB(125, 125, 125);
				}
			})
		} else if (property === "Thickness" && model.Name === "Path") {
			// Update the thickness of the path.
			const points = this.pathModelPoints.get(model)

			const material = model.FindFirstChildWhichIsA("Part")?.Material;
			const color = model.FindFirstChildWhichIsA("Part")?.Color;

			// Delete the previous path.
			model.GetChildren().forEach((part) => part.IsA("BasePart") && part.Destroy());

			if(!points) return;
			
			this.pathPoints = points;

			// Reconstruct the bezier.
			const bezier_points = this.getBezierPathCurve();
			if(!bezier_points) return;

			this.pathBezierPoints = bezier_points;

			// Create the new path.
			this.onAttemptToDrawPath(bezier_points[0], bezier_points[bezier_points.size() - 1], model, material, color, value.value as number);
		}
	};

	public setSelectionProperties(properties : Record<string, EditorPropertyValue>) {
		this.setEditorProperties(properties);
	}

	public createSelectionProperties(model : Model) {
		// Check if the model is a path.
		if(model.Name === "Path") {
			const part = model.FindFirstChild("path_part") as Part | undefined;
			if(!part) return;

			const current_material = part.Material === Enum.Material.Slate ? "Muddy" : part.Material === Enum.Material.Concrete ? "Concrete" : "Cobble";
			const current_width = part.Size.X;

			this.setEditorProperties({
				Thickness: { enabled: true, type: "number", value: current_width },
				Stylization: { enabled: true, type: "dropdown", value: current_material, options: ["Muddy", "Cobble", "Concrete"] },
			})
		} else if(model.Name === "Terrain") {
			this.terrainEditorTool.onTerrainCellSelected(model);
		}
	}

	private setEditorProperties(properties : Record<string, EditorPropertyValue> | undefined) {
		EditorSelectionPropertiesState.set(properties);
	}

	private onBlueprintUnselected(model : Model) {
		const highlight = model.FindFirstChild("selected_highlight") as Highlight | undefined;
		if(highlight) highlight.Parent = undefined;

		this.selection_connections.forEach((connection) => connection.Disconnect());
		this.selection_connections = [];

		this.widget_connections.forEach((connection) => connection.Disconnect());
		this.widget_connections = [];

		this.x_axis_widget.Parent = undefined
		this.z_axis_widget.Parent = undefined
		
		this.rotation_widget.Parent = undefined;

		this.axis_bounds.Parent = undefined;
		this.selection = undefined;

		if(model.Name === "Terrain") this.terrainEditorTool.onTerrainCellDeselected(model);
		this.setEditorProperties(undefined);
	}

	private onBlueprintSelected(model : Model) {
		if(model.FindFirstChild("selected_highlight")) return;
		
		const hover_highlight = model.FindFirstChild("hovering_highlight") as Highlight | undefined;
		if(hover_highlight) hover_highlight.Parent = undefined;

		const highlight = new Instance("Highlight")
		
		highlight.Adornee = model;
		highlight.OutlineColor = Color3.fromRGB(25, 153, 255);
		highlight.FillTransparency = 1;
		highlight.OutlineTransparency = 0;
		highlight.Name = "selected_highlight";

		highlight.Parent = model;

		this.selection = model;

		this.updateTool(this.tool, model);
		this.createSelectionProperties(model);
	}

	private onBlueprintForceUnselection() {
		if(this.selection) {
			this.onBlueprintUnselected(this.selection!);

			const highlight = this.selection.FindFirstChild("selected_highlight") as Highlight | undefined;
			if(highlight) highlight.Parent = undefined;

			this.selection = undefined;
			this.setEditorProperties(undefined);
		}
	}

	private getModelFaces(model: Model): Array<Array<CFrame>> {
		const corners = this.getModelCorners(model);
	
		//const topFace = [corners[0], corners[1], corners[3], corners[2]];
		//const bottomFace = [corners[4], corners[5], corners[7], corners[6]];
		const frontFace = [corners[0], corners[1], corners[5], corners[4]];
		const backFace = [corners[2], corners[3], corners[7], corners[6]];
		const leftFace = [corners[0], corners[2], corners[6], corners[4]];
		const rightFace = [corners[1], corners[3], corners[7], corners[5]];
	
		return [frontFace, backFace, leftFace, rightFace];
	}

	private getModelCorners(model : Model) {
		// Return all eight corners of the model.
		const [ origin, size ] = model.GetBoundingBox();

		const topTopLeft = origin.mul(new CFrame(-size.X / 2, size.Y / 2, size.Z / 2));
		const topTopRight = origin.mul(new CFrame(size.X / 2, size.Y / 2, size.Z / 2));
		const topBottomLeft = origin.mul(new CFrame(-size.X / 2, size.Y / 2, -size.Z / 2));
		const topBottomRight = origin.mul(new CFrame(size.X / 2, size.Y / 2, -size.Z / 2));

		const bottomTopLeft = origin.mul(new CFrame(-size.X / 2, -size.Y / 2, size.Z / 2));
		const bottomTopRight = origin.mul(new CFrame(size.X / 2, -size.Y / 2, size.Z / 2));
		const bottomBottomLeft = origin.mul(new CFrame(-size.X / 2, -size.Y / 2, -size.Z / 2));
		const bottomBottomRight = origin.mul(new CFrame(size.X / 2, -size.Y / 2, -size.Z / 2));

		return [topTopLeft, topTopRight, topBottomLeft, topBottomRight, bottomTopLeft, bottomTopRight, bottomBottomLeft, bottomBottomRight];
	}

	private isVectorWithinPlot(plot: Plots.Plot, vector: Vector3) {
		const center = plot[Plots.Key.POSITION];
		const size = plot[Plots.Key.SIZE]; // A number representing the size of the plot

		const halfSize = size / 2;
		const topLeft = new Vector3(center.X - halfSize, center.Y, center.Z + halfSize);
		const bottomRight = new Vector3(center.X + halfSize, center.Y, center.Z - halfSize);

		return vector.X >= topLeft.X && vector.X <= bottomRight.X && vector.Z >= bottomRight.Z && vector.Z <= topLeft.Z;
	}

	private isPlayerWithinPlot(plot: Plots.Plot) {
		const character = this.player.getCharacterModel()
		const root = character?.FindFirstChild("HumanoidRootPart") as Part | undefined;

		if (!root) return false;

		return this.isVectorWithinPlot(plot, root.Position);
	}

	private onEditModeEnabled = (plot: Plots.Plot) => {
		this.isEditing = true;
		this.plotEditing = plot;

		// Open the plot editor
		Toasts.info("Entering the plot editor.")

		ClientPlotCamera.bounds(plot[Plots.Key.POSITION], plot[Plots.Key.SIZE] / 1.75)
		ClientPlotCamera.enable();

		States.States.set("hide_leaderboard", true)
		States.States.set("hide_chat", true)
		States.States.set("hide_compass", true)

		// Set the players walkspeed to zero.
		const humanoid = this.player.getEntityHumanoid()
		humanoid.getStatistics()?.get("walkspeed")?.adjust("plot", 0, { Mode: StatisticModes.SET, Priority: 1000 })
		humanoid.getStatistics()?.get("jumppower")?.adjust("plot", 0, { Mode: StatisticModes.SET, Priority: 1000 })
		humanoid.getStatistics()?.get("fov")?.adjust("plot", 70, { Mode: StatisticModes.SET, Priority: 1000 })

		States.States.set("building", true)

		const folder = this.folders.get(plot)!;

		const params = new RaycastParams()
		params.FilterType = Enum.RaycastFilterType.Include

		const hover_highlight = new Instance("Highlight")
		hover_highlight.OutlineTransparency = 0;
		hover_highlight.OutlineColor = Color3.fromRGB(84, 179, 255);
		hover_highlight.FillTransparency = 1;
		hover_highlight.Name = "hovering_highlight";

		let hovered_model : Model | undefined;
		let selected_model : Model | undefined;

		// Track the mouse position for setting hover states.
		RunService.BindToRenderStep("editor_selector", Enum.RenderPriority.Camera.Value - 1, () => {
			if (!this.isEditing) return RunService.UnbindFromRenderStep("editor_selector");

			params.FilterDescendantsInstances = [ folder ]

			const mouse = Players.LocalPlayer.GetMouse();
			const ray = Workspace.CurrentCamera!.ScreenPointToRay(mouse.X, mouse.Y);
			const raycast = Workspace.Raycast(ray.Origin, ray.Direction.mul(2000), params);

			if((this.tool === 5 || this.tool === 4) && hover_highlight) hover_highlight.Parent = undefined;

			if(this.isPathDrawingEnabled) return this.onPathDrawingToolUpdate();
			if(this.terrainEditorTool.isTerrainEditorEnabled()) return this.terrainEditorTool.onTerrainEditorUpdate();

			if(this.tool === 5 || this.tool === 4) {
				if(hovered_model) this.onBlueprintUnselected(hovered_model);
				hovered_model = undefined;

				// User is hovering.
				hover_highlight.Parent = undefined;
				return;
			}

			let model = raycast && this.getModelFromBasepart(raycast.Instance as BasePart, folder);
			if(model?.FindFirstChild("selected_highlight")) return;

			// User is hovering.
			hover_highlight.Parent !== model ? hover_highlight.Adornee = model : undefined;
			hover_highlight.Parent !== model ? hover_highlight.Parent = model : undefined;
			
			hovered_model = model;
		});

		const input = UserInputService.InputBegan.Connect((input, processed) => {
			if(input.KeyCode === Enum.KeyCode.R) {
				this.tool += 1;
				this.updateTool(this.tool > 2 ? 1 : this.tool, this.selection);
			}

			if(input.UserInputType === Enum.UserInputType.MouseButton1) {
				if(this.isHoveringRotationWidget) return;
				if(this.tool === 5 || this.tool === 4) {
					if(hovered_model && hover_highlight.Parent) hover_highlight.Parent = undefined;
					return;
				}

				const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
				const mouse = Players.LocalPlayer.GetMouse();
				const interfacesAtMouse = playerGui.GetGuiObjectsAtPosition(mouse.X, mouse.Y)

				// Filter any interfaces that are either invisible, or have a parent which is of type ScreenGui
				const interfaces = interfacesAtMouse.filter((frame) => {
					return frame.Visible && frame.Parent?.IsA("ScreenGui") === false && frame.Parent?.Parent?.IsA("ScreenGui") === false;
				});
				if(interfaces.size() > 1) {
					if(hover_highlight) hover_highlight.Parent = undefined;
					return;
				}

				if(!hovered_model && selected_model) this.onBlueprintUnselected(selected_model);
				if(!hovered_model) return;

				if(selected_model) {
					let selected_highlight = selected_model.FindFirstChild("selected_highlight") as Highlight | undefined;
					if(selected_highlight) selected_highlight.Parent = undefined;
				}

				if(selected_model !== hovered_model) this.onBlueprintUnselected(hovered_model);

				selected_model = hovered_model;
				this.onBlueprintSelected(hovered_model);
			}
		})

		this.connections.push(input);
	}

	private onEditModeDisabled = (plot: Plots.Plot) => {
		this.isEditing = false;
		this.plotEditing = undefined;

		// Close the plot editor
		Toasts.info("Exiting the plot editor.")

		ClientPlotCamera.disable();

		States.States.set("hide_leaderboard", false)
		States.States.set("hide_chat", false)
		States.States.set("hide_compass", false)


		// Reset the players walkspeed
		const humanoid = this.player.getEntityHumanoid()

		humanoid.getStatistics()?.get("walkspeed")?.deleteStatistic("plot", { Mode: StatisticModes.SET, Priority: 1000 })
		humanoid.getStatistics()?.get("jumppower")?.deleteStatistic("plot", { Mode: StatisticModes.SET, Priority: 1000 })
		humanoid.getStatistics()?.get("fov")?.deleteStatistic("plot", { Mode: StatisticModes.SET, Priority: 1000 })

		States.States.set("building", false)

		RunService.UnbindFromRenderStep("editor_selector");
		RunService.UnbindFromRenderStep("blueprint_drag");

		this.x_axis_widget.Parent = undefined
		this.z_axis_widget.Parent = undefined

		this.axis_bounds.Parent = undefined
		this.rotation_widget.Parent = undefined;
		
		this.connections.forEach((connection) => connection?.Disconnect());
		this.connections = [];

		this.selection_connections.forEach((connection) => connection.Disconnect());
		this.selection_connections = [];

		this.widget_connections.forEach((connection) => connection.Disconnect());
		this.widget_connections = [];

		this.cache_parts.forEach((part) => part.Destroy());
		this.cache_parts = [];

		this.adornments.forEach((adornment) => adornment.Destroy());
		this.adornments = [];

		this.selection = undefined;
	}

	private onEditButtonPressed = () => {
		const plot = this.plots.find((plot) => this.isPlayerWithinPlot(plot));
		if (!plot) return Toasts.failed("You must be within a plot to open the editor.");

		if (this.isEditing) this.onEditModeDisabled(plot);
		else this.onEditModeEnabled(plot);
	}

	private drawPlotOutline(plot: Plots.Plot) {
		const center = plot[Plots.Key.POSITION];
		const size = plot[Plots.Key.SIZE]; // A number representing the size of the plot

		// Calculate half the size
		const halfSize = size / 2;

		// Get all the corners of the plot
		const topLeft = new Vector3(center.X - halfSize, center.Y, center.Z + halfSize);
		const topRight = new Vector3(center.X + halfSize, center.Y, center.Z + halfSize);
		const bottomLeft = new Vector3(center.X - halfSize, center.Y, center.Z - halfSize);
		const bottomRight = new Vector3(center.X + halfSize, center.Y, center.Z - halfSize);

		const drawLineFromPoints = (pointA: Vector3, pointB: Vector3) => {
			const part = Requiem.Assets.other.area_line.Clone()
			part.Anchored = true;
			part.Size = new Vector3(1, 1, pointA.sub(pointB).Magnitude);
			part.Position = pointA.add(pointB).div(2);
			part.CFrame = CFrame.lookAt(pointA, pointB).mul(new CFrame(0, 0, -part.Size.Z / 2));

			part.Name = "PlotLine";
			part.A.WorldPosition = pointA;
			part.B.WorldPosition = pointB;

			part.Parent = Workspace;
		}

		// Draw the lines
		drawLineFromPoints(topLeft, topRight);
		drawLineFromPoints(topRight, bottomRight);
		drawLineFromPoints(bottomRight, bottomLeft);
		drawLineFromPoints(bottomLeft, topLeft);
	}

	private onPlotsUpdated = (plots: PlotDataSerialized[]) => {
		plots.forEach((plot) => {
			const data = Plots.getDataFromId(plot.id);
			if (!data) return;

			if (plot.owner === Players.LocalPlayer.UserId) {
				this.drawPlotOutline(data);
			}

			const doesPlotExist = this.plots.find((v) => v[Plots.Key.POSITION] === data[Plots.Key.POSITION]);
			if (!doesPlotExist) this.plots.push(data);

			// Create the folder if it doesn't exist
			const folder = this.folders.get(data) ?? new Instance("Folder");
			if(!this.folders.get(data)) this.folders.set(data, folder);

			folder.Name = `Plot_${tostring(plot.id)}`;
			folder.Parent = Workspace;
		});
	}

	public initialize() {
		// Get the keybind service
		const keybinds = this.player.getKeybindService()
		const category = keybinds.getCategory(Keybinds.Category.Building)

		this.player.awaitBufferCreation(11).then(() => {
			const buffer = this.player.getBufferFromIndex(11);
			if (buffer) this.onPlotsUpdated(PlotSharedSelectors.getPlots(buffer));

			this.player.getBufferListeners().subscribe(11, (buffer) => {
				const plots = PlotSharedSelectors.getPlots(buffer);
				this.onPlotsUpdated(plots);
			})
		});

		category.pressed("Editor").Connect(() => {
			this.onEditButtonPressed();
		})


		this.axis_bounds.Anchored = true;
		this.axis_bounds.CanCollide = false;
		this.axis_bounds.CanQuery = false;
		
		this.axis_bounds.Transparency = 1;
		this.axis_bounds.Parent = Workspace

		Memory.subscribe<number>(EditorToolSubscription, (tool) => {
			this.updateTool(tool, this.selection, true);
		});

		Memory.subscribe<Record<string, EditorPropertyValue> | undefined>(EditorSelectionPropertiesSubscription, (properties) => {
			if(!properties) return EditorPropertiesVisibleState.set(false);
			else EditorPropertiesVisibleState.set(true);
		});
	}
}