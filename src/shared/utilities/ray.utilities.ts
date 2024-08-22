import { Workspace } from "@rbxts/services";

export namespace Raycasting {
    export function getCharacterDistanceFromGround() {
        const character = game.GetService("Players").LocalPlayer.Character;
        if(!character) return 0;
        if(!character.PrimaryPart) return 0;

        const ignore = new RaycastParams()
        ignore.FilterType = Enum.RaycastFilterType.Exclude
        ignore.FilterDescendantsInstances = [character]

        const results = Workspace.Raycast(character.PrimaryPart.Position, new Vector3(0, -1, 0).Unit.mul(1000), ignore);
        if (!results) return 1000;

        return results.Distance;
    }

    export function isCharacterIndoors() {
        const character = game.GetService("Players").LocalPlayer.Character;
        if(!character) return false;
        if(!character.PrimaryPart) return false;

        const ignore = new RaycastParams()
        ignore.FilterType = Enum.RaycastFilterType.Exclude
        ignore.FilterDescendantsInstances = [character]

        const results = Workspace.Raycast(character.PrimaryPart.Position, new Vector3(0, 1, 0).Unit.mul(30), ignore);
        if (!results) return false;

        if(results.Material === Enum.Material.Grass) return false;

        return true;
    }

    export function isSpaceAvailableInfront(space : number, distance : number) {
        const character = game.GetService("Players").LocalPlayer.Character;
        if(!character) return false;
        if(!character.PrimaryPart) return false;

        const ignore = new RaycastParams()
        ignore.FilterType = Enum.RaycastFilterType.Exclude
        ignore.FilterDescendantsInstances = [character]

        const lookVector = character.PrimaryPart.CFrame.LookVector.mul(distance);
        const results = Workspace.Spherecast(character.PrimaryPart.Position.add(new Vector3(0, space, 0)), space, lookVector, ignore);

        if(!results) return true;
        return false
    }
}