import { Players, Workspace } from "@rbxts/services";
import { Debug } from "./debug.utilities";

export namespace Hitbox {
    export function Capsule(
        position : Vector3, 
        direction : Vector3, 
        length : number, 
        radius : number, 
        filter: Instance[],
        exclude : boolean = false,
    ) : RaycastResult | undefined {
        const params = new RaycastParams()
        
        if(exclude) params.FilterType = Enum.RaycastFilterType.Exclude
        else params.FilterType = Enum.RaycastFilterType.Include

        params.FilterDescendantsInstances = filter

        const sphere = Workspace.Spherecast(position, radius, direction.mul(length), params)
        return sphere
    }

    export function Ray(
        position : Vector3, 
        direction : Vector3,
        length : number,
        filter: Instance[]
    ) : RaycastResult | undefined {
        const params = new RaycastParams()
        params.FilterType = Enum.RaycastFilterType.Exclude
        params.FilterDescendantsInstances = filter

        const results = Workspace.Raycast(position, direction.mul(length), params)
        return results
    }

    export function Line(
        start : Vector3, 
        ending : Vector3,
        filter: Instance[],
        length : number = 500,
    ) : RaycastResult | undefined {
        const params = new RaycastParams()
        params.FilterType = Enum.RaycastFilterType.Exclude
        params.FilterDescendantsInstances = filter

        const direction = (ending.sub(start).Unit).mul(length)
        const results = Workspace.Raycast(start, direction, params)

        return results
    }

    export function DistanceFromGround(
        position : Vector3, 
        filter: Instance[]
    ) : number | undefined {
        const params = new RaycastParams()
        params.FilterType = Enum.RaycastFilterType.Exclude
        params.FilterDescendantsInstances = filter

        const results = Workspace.Raycast(position, new Vector3(0, -1, 0).mul(500), params)
        return results ? results.Distance : undefined
    }

    export function Ground(
        position : Vector3,  
        filter: Instance[],
        distance : number = 4,
    ) : RaycastResult | undefined {
        
        const params = new RaycastParams()
        params.FilterType = Enum.RaycastFilterType.Exclude
        params.FilterDescendantsInstances = filter

        const results = Workspace.Raycast(position, new Vector3(0, -1, 0).mul(distance), params)
        return results
    }

    export function Mouse(
        filter: Instance[]
    ) : RaycastResult | undefined {
        const params = new RaycastParams()
        params.FilterType = Enum.RaycastFilterType.Exclude
        params.FilterDescendantsInstances = filter

        const mouse = Players.LocalPlayer!.GetMouse();
        const results = Workspace.Raycast(mouse.UnitRay.Origin, mouse.UnitRay.Direction.mul(5000), params)
        
        return results
    }

    export function SphereCollider(
        position : Vector3, 
        radius : number, 
    ) {
        const object = new Instance("Part")
        object.Size = new Vector3(radius, radius, radius)
        object.Position = position
        object.Anchored = true
        object.CanCollide = false
        object.Transparency = 0.5
        object.Shape = Enum.PartType.Ball
        object.Name = "Collider"
        object.Parent = Workspace

        return object
    }
    
    export function GetModelFromResults(results : RaycastResult, filter : Instance[]) {
        for (let i = 0; i < filter.size(); i++) {
            if(results.Instance.IsDescendantOf(filter[i])) {
                return filter[i]
            }
        }
        return undefined
    }
}