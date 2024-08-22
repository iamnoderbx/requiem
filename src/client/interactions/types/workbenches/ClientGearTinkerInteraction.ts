import { BaseEntity } from "client/entities/BaseEntity";
import { ClientMenuSubscription, ClientMenuTypes, ClientStoreSubscription, MenuSubscription } from "client/entities/player/ClientPlayerStates";
import { Interaction } from "client/interactions/InteractionController";
import Interactions from "shared/utilities/decorators/InteractionDecorators";
import { Memory } from "shared/utilities/memory.utilities";

@Interactions.Interaction({ name: "Tinkering Station", description: "Press \"%s\" to adjust gear." })
export class ClientGearTinkerInteraction {

    @Interactions.Interacted()
    public onInteraction(interaction: Interaction) {
        BaseEntity.resolveClientEntity().then((client) => {
			MenuSubscription.set(ClientMenuTypes.GEAR);

			// Subscribe to the store
			const connection = client.getEntityCharacter().getCharacterMoved(10).then(() => {
                store();

				MenuSubscription.set(ClientMenuTypes.NONE);
            }).catch((e) => warn(e))

            const store = Memory.subscribe(ClientMenuSubscription, () => {
                connection.cancel()
            })
		})
    }

}