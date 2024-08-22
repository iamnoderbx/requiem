import { BaseEntity } from "server/entities/BaseEntity";
import { BaseHorseEntity } from "server/entities/animals/BaseHorseEntity";
import { Interaction, InteractionState } from "server/interactions/InteractionServiceRunner";
import Interactions from "shared/utilities/decorators/InteractionDecorators";

@Interactions.Interaction({ name: "Mount"})
export class ClientSaddleInteraction {
    @Interactions.Guard([])
    @Interactions.Interacted()
    public onInteraction(interaction : Interaction) {
        const player = interaction.getPlayer()

        const part = interaction.getPart()
        const horse = BaseEntity.resolveEntityFromInstance<BaseHorseEntity>(part.Parent!)

        if(!horse) return player.error("Failed to mount, this is not a horse.")
        horse.mount(player)

        interaction.setInteractionState(InteractionState.HIDDEN, true)
        horse.onceHorseUnmounted(() => {
            interaction.setInteractionState(InteractionState.HIDDEN, false)
        })
    }
}