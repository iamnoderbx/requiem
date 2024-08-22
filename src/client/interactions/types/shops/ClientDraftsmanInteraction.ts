import { BaseEntity } from "client/entities/BaseEntity";
import { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, States, StoreSubscription } from "client/entities/player/ClientPlayerStates";
import { Interaction } from "client/interactions/InteractionController";
import Interactions from "shared/utilities/decorators/InteractionDecorators";
import { Memory } from "shared/utilities/memory.utilities";
import { PlayerActions, StoreActions } from "shared/utilities/network/Events";

@Interactions.Interaction({ name: "Draftsman", description: "Press \"%s\" to purchase blueprints." })
export class ClientDraftsmanInteraction {

    @Interactions.Interacted()
    public onInteraction(interaction: Interaction) {
        print("Interacted with draftsman")

        const part = interaction.getPart();
        const position = part.Position;

        const seed = position.X + position.Y + position.Z;
        const storeType = part.Parent!.GetAttribute("store") as number;
        
        BaseEntity.resolveClientEntity().then((client) => {
            CURRENT_STORE_META.id = math.floor(seed);

            client.network.action(PlayerActions.Stores, StoreActions.REQUEST, math.floor(seed), storeType)
            
            States.States.set("shopping", true);
            StoreSubscription.set(ClientStoreTypes.DRAFTSMAN)

            const connection = client.getEntityCharacter().getCharacterMoved(10).then(() => {
                store();

                CURRENT_STORE_META.id = 0;
				
                States.States.set("shopping", false);
                StoreSubscription.set(ClientStoreTypes.NONE)
                
            }).catch((e) => warn(e))

            // Subscribe to the store
            const store = Memory.subscribe(ClientStoreSubscription, () => {
                connection.cancel();
            })
        })
    }

}