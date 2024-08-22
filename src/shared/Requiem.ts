import { ReplicatedStorage } from "@rbxts/services";
import { Assets } from "./types/Assets";
import CommandDecorators from "./utilities/decorators/CommandDecorators"

export namespace Requiem {
    export const Assets : Assets = ReplicatedStorage.WaitForChild("assets") as unknown as Assets;
    export const Commands = CommandDecorators;
}