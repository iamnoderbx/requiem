import Octree from "@rbxts/octo-tree";
import { Workspace } from "@rbxts/services";
import { Requiem } from "shared/Requiem";
import { BiomeVertex } from "./Vertex";

export class Wall {
	private distance_between_segments: number = 435.65 - 6
	
	private sine_amplitude = 0.3;
	private sine_frequency = 7;

	private circumference : number;
	private segment_count : number;

	private origin : Vector3 = new Vector3(0, 0, 0);
	
	private octree : Octree<Vector3> = new Octree();
	
	constructor(private radius : number, private back_step : number = 0) {
		this.circumference = 2 * math.pi * this.radius
		this.segment_count = math.floor(this.circumference / (this.distance_between_segments - this.back_step))
	}

	private sineWaveDisplacement(angle : number) {
		const randomFactor = new Random(angle).NextNumber()
		const variableAmplitude = this.sine_amplitude * randomFactor
		return variableAmplitude * math.sin(angle * this.sine_frequency)
	}

	public load(displacement_multiplier : number) {
		const angle_step = (2 * math.pi) / this.segment_count
		let previous : undefined | Vector3 = undefined

		for(let i = 0; i < this.segment_count; i++) {
			const angle = i * angle_step
			const displacement = this.sineWaveDisplacement(angle) * displacement_multiplier
			const radius = this.radius + displacement

			const x = this.origin.X + radius * math.cos(angle)
			const z = this.origin.Z + radius * math.sin(angle)

			const currentPosition = new Vector3(x, this.origin.Y, z)

			if(previous) {
				this.octree.CreateNode(previous, currentPosition)
			}

			previous = currentPosition
		}

		if(previous) {
			const first = new Vector3(this.origin.X + this.radius * math.cos(0), this.origin.Y, this.origin.Z + this.radius * math.sin(0))
			this.octree.CreateNode(previous, first)
		}
	}

	public render(position : Vector3, distance : number, rails: boolean = true) {
		// Render all nodes within the distance
		const nodes = this.octree.SearchRadius(position, distance);

		nodes.forEach((segment) => {
			const segment_position = segment.Position;
			const neighbor_position = segment.Object;

			const [ y, meta ] = BiomeVertex.getHeightAt(segment_position.X, segment_position.Z)
			const isBelowWaterLevel = y > 2.625

			const model = rails ? Requiem.Assets.other.Wall.Clone() : (isBelowWaterLevel ? Requiem.Assets.other.WallSinaGrate.Clone() : Requiem.Assets.other.WallSina.Clone())
			model.PivotTo(new CFrame(segment_position.add(neighbor_position).div(2), neighbor_position).mul(new CFrame(0, y, 0)))
			model.Parent = Workspace
		})
	}
}