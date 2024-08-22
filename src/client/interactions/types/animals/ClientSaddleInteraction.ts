import { Interaction } from "client/interactions/InteractionController";
import Interactions from "shared/utilities/decorators/InteractionDecorators";

@Interactions.Interaction({ name: "Mount", description: "Press \"%s\" to mount." })
export class ClientSaddleInteraction {

    @Interactions.Interacted()
    public onInteraction(interaction: Interaction) {
        interaction.server()
    }

}