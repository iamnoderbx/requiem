import { Workspace } from "@rbxts/services"

export namespace Debug {
    const Debuggers : Instance[] = [];
    export function Point(
        position : Vector3, 
        color : Color3 = Color3.fromRGB(255, 0, 0),
        duration : number = 120,
        size : number = 0.3
    ) {
        const part = new Instance("Part")
        part.Position = position
        part.Anchored = true
        part.CanCollide = false
        //part.CanQuery = false
        part.Size = new Vector3(size, size, size)
        part.Color = color
        part.Name = "Debugger"
        part.Parent = Workspace

        Debuggers.push(part)

        task.delay(duration, () => part.Destroy())
        return part
    }

    export function Plane(
        Position: Vector3,
        Width: Vector3,
    ) {
        const plane = new Instance("Part")
        plane.Size = new Vector3(Width.X, 0.1, Width.Z)
        plane.Position = Position
        plane.Anchored = true
        plane.Color = new Color3(math.random(), math.random(), math.random())
        plane.Parent = Workspace

        return plane
    }

    export function Pole(
        Position: Vector3,
        Color: Color3 = Color3.fromRGB(255, 0, 0)
    ) {
        const pole = new Instance("Part")
        const thickness = math.random(5, 15) / 10

        pole.Size = new Vector3(thickness, 2000, thickness)
        pole.Position = Position
        pole.Anchored = true
        pole.Color = Color
        pole.Transparency = 0.3
        pole.Parent = Workspace

        return pole
    }

    export function Line(
        attachment0: Attachment,
        attachment1: Attachment,
        color : Color3 = Color3.fromRGB(255, 0, 0)
    ) {
        const beam = new Instance("Beam")
        beam.Attachment0 = attachment0
        beam.Attachment1 = attachment1
        beam.FaceCamera = true
        beam.Transparency = new NumberSequence(0)
        beam.Color = new ColorSequence(color)
        beam.Width0 = 0.1
        beam.Width1 = 0.1
        beam.Segments = 20

        beam.Parent = Workspace

        return beam
    }

    export function GetDebuggers() {
        return Debuggers
    }

    export function Attachment(
        position : Vector3,
        parent : Instance = Workspace.Terrain!
    ) {
        const attachment = new Instance("Attachment")
        attachment.Parent = parent
        attachment.WorldPosition = position
        
        return attachment
    }
}