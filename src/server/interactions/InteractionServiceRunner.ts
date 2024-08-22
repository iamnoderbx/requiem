import { EntityPermissionComponent } from "server/components/Commands/CommandPlayerLevelComponent";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { NetworkBubble } from "server/network/NetworkBubble";
import { Permission } from "shared/utilities/decorators/CommandDecorators";
import Interactions from "shared/utilities/decorators/InteractionDecorators";
import { Controller } from "shared/utilities/decorators/ServiceControllers";
import { NetworkEvent } from "shared/utilities/network/Events";

export enum InteractionState {
    HIDDEN = "__hidden",
}

export class Interaction {
    constructor(private player : BasePlayerEntity, private part : BasePart) {}

    getPlayer() {
        return this.player
    }

    getPart() {
        return this.part
    }

    setInteractionState(state : InteractionState, value : boolean) {
        if(state === InteractionState.HIDDEN) {
            const obj = (this.part.FindFirstChild("__HIDDEN") ?? new Instance("ObjectValue")) as ObjectValue
            if(value) {
                obj.Name = "__HIDDEN"
                obj.Value = this.player.getInstance()
            }

            if(!value) obj.Destroy()
            else obj.Parent = this.part
        }  
    }
}

@Controller()
export default class InteractionServiceRunner {
    private network! : NetworkBubble.Replicator
    public initialize() { 
        this.network = new NetworkBubble.Replicator(NetworkEvent.Interaction)

        this.network.listen((client, args : unknown[]) => {
            const [ part, name ] = args as [ BasePart, string ]
            const interaction = Interactions.getInteraction(name);

            if(!interaction) {
                return warn(`Interaction ${name} not found`)
            }

            const player = BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(client)
            if(!player) return

            if(interaction.permission && interaction.permission.size() > 0) {
                const permission = player?.getComponent(EntityPermissionComponent).get() ?? Permission.Player;
                if(!interaction.permission.includes(permission)) return player.error("You do not have permission to interact with this object.")
            }

            interaction.execute(interaction, new Interaction(player, part))
        })
    }
}
