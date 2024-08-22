import ignite from "shared/utilities/framework/ignite";
import { NetworkBubble } from "./network/ClientBubbles";
import { __igniteControllers } from "shared/utilities/decorators/ServiceControllers";
import { __igniteWorldObjects } from "shared/utilities/decorators/WorldDecorators";

ignite(script.Parent!)

// Create a new bubble
new NetworkBubble.Bubble()
new NetworkBubble.Entities()

// Ignite the controllers
__igniteControllers()
__igniteWorldObjects()