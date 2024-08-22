import { Players, RunService, TweenService, Workspace } from "@rbxts/services";
import { Hitbox } from "./hitbox.utilities";

export namespace Physics {
    export function VelocityCollisionChecks(humanoidRootPart : BasePart, callback : (distance : number) => void) {
        const connection = RunService.RenderStepped.Connect(() => {
            const velocity = humanoidRootPart.AssemblyLinearVelocity;
            const magnitude = velocity.Magnitude;

            if(magnitude < 0.1) return

            const ray = Hitbox.Capsule(humanoidRootPart.Position, velocity.Unit, magnitude, 1, [humanoidRootPart.Parent as Model], true)
            if(!ray) return

            const distance = ray.Distance;
            if(distance) callback(distance)
        })

        return () => {
            connection.Disconnect()
        }
    }

    export function RotationStabalizer(humanoidRootPart : BasePart) {
        const gyro = new Instance("BodyGyro")
        gyro.MaxTorque = new Vector3(math.huge, 0,  math.huge)

        gyro.P = 1000
        gyro.D = 10
        gyro.CFrame = humanoidRootPart.CFrame
        
        gyro.Parent = humanoidRootPart

        return gyro
    }

    export function RestoreTargetPhysics(humanoidRootPart : BasePart) {
        humanoidRootPart.Parent?.GetDescendants().forEach((basePart) => {
            if(!basePart.IsA("BasePart")) return
            basePart.CustomPhysicalProperties = undefined;
        })
    }

    export function RestoreClientPhysics() {
        let humanoidRootPart = Players.LocalPlayer.Character
            && Players.LocalPlayer.Character.FindFirstChild("HumanoidRootPart") as BasePart

        if(!humanoidRootPart) return
        RestoreTargetPhysics(humanoidRootPart)
    }

    export function RemoveTargetPhysics(humanoidRootPart : BasePart) {
        humanoidRootPart.Parent?.GetDescendants().forEach((basePart) => {
            if(!basePart.IsA("BasePart")) return

            let setPhysicalProperties = new PhysicalProperties(0.01, 0, 1)
            basePart.CustomPhysicalProperties = setPhysicalProperties
        })
    }

    export function RemoveClientPhysics() {
        let humanoidRootPart = Players.LocalPlayer.Character
            && Players.LocalPlayer.Character.FindFirstChild("HumanoidRootPart") as BasePart

        if(!humanoidRootPart) return
        RemoveTargetPhysics(humanoidRootPart)
    }

    export function RemoveGravityForce(humanoidRootPart : BasePart, additional : number = 0, d: number = 200, p : number = 1000) {
        const bodyPosition = new Instance("BodyPosition")
        bodyPosition.MaxForce = new Vector3(0, 10000, 0)
        bodyPosition.Position = humanoidRootPart.Position.add(new Vector3(0, additional, 0))
        bodyPosition.D = d
        bodyPosition.P = p
        bodyPosition.Parent = humanoidRootPart

        return bodyPosition
    }
    
    export function ReduceAirResistance(humanoidRootPart : BasePart, amount : number) {
        const mass = GetTargetMass(humanoidRootPart, true)
        if(!mass) return

        const gravity = Workspace.Gravity;

        const force = new Instance("BodyForce")
        force.Name = "__REDUCED_GRAVITY"

        force.Force = new Vector3(0, mass * (gravity - (gravity * amount)), 0)
        force.Parent = humanoidRootPart

        return force;
    }

    export function GetTargetMass(humanoidRootPart : BasePart, useGetMass : boolean = false) {
        let mass = 0;
        let model = humanoidRootPart.Parent;
        if (!model) return

        model.GetDescendants().forEach((part) => {
            if(!part.IsA("BasePart")) return;
            if((part as BasePart).Massless) return;

            if(useGetMass) mass += (part as BasePart).GetMass()
            else mass += (part as BasePart).AssemblyMass
        })

        return mass
    }

    export function ApplyBodyVelocityToTargetVector(humanoidRootPart : BasePart, vector : Vector3, power : number, tween : TweenInfo | void, velocity : BodyVelocity | void) {
        if(!humanoidRootPart) return

        let lookVector = (vector.sub(humanoidRootPart.Position)).Unit
        let mass = GetTargetMass(humanoidRootPart)

        if(!mass) return
        //RemoveTargetPhysics(humanoidRootPart)

        let bodyVelocity = velocity || new Instance("BodyVelocity")
        let directionVector = lookVector.mul(power)

        bodyVelocity.Velocity = directionVector
        bodyVelocity.MaxForce = new Vector3(mass * power, mass * power, mass * power)
        bodyVelocity.Parent = humanoidRootPart

        if (tween) { 
            bodyVelocity.MaxForce = new Vector3(0, 0, 0);
            TweenService.Create(bodyVelocity, tween, {MaxForce: new Vector3(mass * power, mass * power, mass * power)}).Play()
        }

        return bodyVelocity
    }

    export function ApplyVelocityToTargetVector(humanoidRootPart : BasePart, vector : Vector3, power : number, tween : TweenInfo | void, velocity : LinearVelocity | void) {
        if(!humanoidRootPart) return

        let lookVector = (vector.sub(humanoidRootPart.Position)).Unit
        let mass = GetTargetMass(humanoidRootPart)

        if(!mass) return
        RemoveTargetPhysics(humanoidRootPart)

        let linearVelocity = velocity || new Instance("LinearVelocity")
        let directionVector = lookVector.mul(power)

        linearVelocity.VelocityConstraintMode = Enum.VelocityConstraintMode.Vector
        linearVelocity.VectorVelocity = directionVector
        linearVelocity.Attachment0 = humanoidRootPart.FindFirstChild("Attachment") as Attachment || new Instance("Attachment", humanoidRootPart)

        if(!velocity) {
            linearVelocity.Parent = humanoidRootPart
        }

        if (tween) { 
            linearVelocity.MaxForce = 0;
            TweenService.Create(linearVelocity, tween, {MaxForce: mass * power}).Play()
        } else {
            linearVelocity.MaxForce = mass * power
        }

        return linearVelocity
    }

    export function ApplyClientVelocityToVector(vector : Vector3, power : number, tween : TweenInfo | void, velocity : LinearVelocity | void) {
        let humanoidRootPart = Players.LocalPlayer.Character
            && Players.LocalPlayer.Character.FindFirstChild("HumanoidRootPart") as BasePart

        if(!humanoidRootPart) return

        return ApplyVelocityToTargetVector(humanoidRootPart, vector, power, tween, velocity)
    }
}