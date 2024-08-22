import Roact from "@rbxts/roact";
import RoactHooked from "./vendors/RoactHooked";


const vendors = script.Parent!.FindFirstChild("vendors")!;
const hooks_vendor = vendors.FindFirstChild("RoactHooked") as ModuleScript;
const roact_vendor = vendors.FindFirstChild("Roact") as ModuleScript;

const hooks = require(hooks_vendor) as { default: typeof RoactHooked};
const roact = require(roact_vendor) as { default: typeof import("@rbxts/roact");};

export const InterfaceContext = roact.default.createContext(undefined);

export default function useInterfaceStore() {
    return hooks.default.useContext(InterfaceContext)
}