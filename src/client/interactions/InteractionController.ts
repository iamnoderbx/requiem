import Object from "@rbxts/object-utils";
import Octree, { Node } from "@rbxts/octo-tree";
import { CollectionService, Players, RunService, Workspace } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { ClientPlayerEntity } from "client/entities/player/ClientPlayerEntity";
import { States } from "client/entities/player/ClientPlayerStates";
import { InteractionEvent } from "client/interfaces/routes/interactions.route";
import { NetworkBubble } from "client/network/ClientBubbles";
import { Keybinds } from "shared/Keybindings";
import Interactions, { InteractionStructure } from "shared/utilities/decorators/InteractionDecorators";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { NetworkEvent } from "shared/utilities/network/Events";

export class Interaction {
    constructor(private data : InteractionStructure, private part : BasePart) {}

    public server() {
        NetworkBubble.post(NetworkEvent.Interaction, this.part, this.data.name)
    }
    
    public getPart() {
        return this.part
    }

    public getSeed() {
        return this.part.GetAttribute("seed") as number ??
            this.part.Parent!.GetAttribute("seed") as number ??
            this.part.Parent!.Parent!.GetAttribute("seed") as number ?? 0
    }
}

@Controller()
export class InteractionServiceRunner {
    private octree : Octree<{part : BasePart, interaction : InteractionStructure}> = new Octree();
    private current : BasePart | undefined;
    private interaction : InteractionStructure | undefined;

    constructor() {}

    public getInteractionOctree() {
        return this.octree
    }

    private onInteractionAdded(part : BasePart) {
        const typeIs = part.GetAttribute("Type") as string
        if(!typeIs) return

        // Get the interaction type data.
        const interaction = Interactions.getInteraction(typeIs);
        if(!interaction) return

        // Add the interaction to the octree.
        const node = this.octree.CreateNode(part.Position, { part, interaction })
        
        if(part.IsA("Seat")) {
            part.GetPropertyChangedSignal("Occupant").Connect(() => {
                this.octree.ChangeNodePosition(node, part.Position)
            })
        }
    }

    public async initialize() {
        const onHideInteractions = () => {
            InteractionEvent.Fire()
            this.current = undefined
        }
        
        const getInteractionKeybinds = () => {
            const [ success, client ] =  BaseEntity.resolveClientEntity().await() as LuaTuple<[boolean, ClientPlayerEntity?]>
            if(!success || !client) return $tuple();

            const keybinding = client.getKeybindService()
            const category = keybinding.getCategory(Keybinds.Category.General)

            return $tuple(category.getKeyCode("Interact"), category)
        }

        const [ keybinds, category ] = getInteractionKeybinds()
        if(!keybinds || !category) return
        
        category.pressed("Interact").Connect(() => {
            if(!this.interaction || !this.current) return;

            this.interaction.execute(this.interaction, new Interaction(this.interaction, this.current))
        })

        RunService.RenderStepped.Connect(() => {
            const camera = Workspace.CurrentCamera;
            if(!camera) return onHideInteractions();

            const client = Players.LocalPlayer
            const character = client?.Character;

            if(!character) return onHideInteractions();

            const root = character.FindFirstChild("HumanoidRootPart") as BasePart;
            if(!root) return onHideInteractions();

            if(States.isCategoryBusy(States.Types.BUSY)) return onHideInteractions();
            if(States.isCategoryBusy(States.Types.COMBAT)) return onHideInteractions();
            if(States.isCategoryBusy(States.Types.MOUNTS)) return onHideInteractions();
            if(States.isCategoryBusy(States.Types.MISCELLANEOUS)) return onHideInteractions();

            const octree = this.getInteractionOctree()
            const nearby = octree.SearchRadius(root.Position, 7.5)
            if(nearby.size() === 0) return onHideInteractions();

            // Ensure the player is looking the nearby parts, filter the ones that are not in the camera view.
            const filtered = nearby.filter((node) => {
                const part = node.Object.part;

                if(part.FindFirstChild("__HIDDEN")) {
                    const object = part.FindFirstChild("__HIDDEN") as ObjectValue;
                    if(object.Value && object.Value.Parent !== undefined) {
                        return false;
                    }
                }

                const direction = (part.Position.sub(root.CFrame.Position)).Unit
                const dot = direction.Dot(camera.CFrame.LookVector)

                return dot > 0.3;
            })

            const viewportSize = camera.ViewportSize
            const center = new Vector2(viewportSize.X / 2, viewportSize.Y / 2)

            let closest : {part : BasePart, interaction : InteractionStructure, distance : number} | undefined;
            
            for (const index of Object.keys(filtered)) {
                const node = filtered[index - 1] as Node<{part : BasePart, interaction : InteractionStructure}>
                const part = node.Object.part

                const [ screenPosition ] = camera.WorldToScreenPoint(part.Position)
                const screenPoint = new Vector2(screenPosition.X, screenPosition.Y)
                const distance = (screenPoint.sub(center)).Magnitude

                if(!closest || distance < closest.distance) {
                    closest = { part: node.Object.part, interaction: node.Object.interaction, distance }
                }
            }

            if(!closest) return onHideInteractions()
            if(this.current === closest.part) return

            const keybind = keybinds[0];

            this.interaction = closest.interaction
            this.current = closest.part;
            InteractionEvent.Fire(closest.part, closest.interaction, keybind)
        })

        CollectionService.GetTagged("Interaction").forEach((instance) => {
            if(!instance.IsA("BasePart")) return
            this.onInteractionAdded(instance)
        })

        CollectionService.GetInstanceAddedSignal("Interaction").Connect((instance) => {
            if(!instance.IsA("BasePart")) return
            this.onInteractionAdded(instance)
        })
    }
}