import { ReplicatedStorage } from "@rbxts/services";

const rbxts_include = ReplicatedStorage.WaitForChild("rbxts_include");
const node_modules = rbxts_include?.WaitForChild("node_modules");

const rbxts = node_modules.WaitForChild("@rbxts");
const roact = rbxts?.WaitForChild("roact");

export default require(roact?.WaitForChild("src") as ModuleScript) as typeof import("@rbxts/roact");