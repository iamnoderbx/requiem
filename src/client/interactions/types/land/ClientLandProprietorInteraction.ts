import { BaseEntity } from "client/entities/BaseEntity";
import { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, States, StoreSubscription } from "client/entities/player/ClientPlayerStates";
import { Interaction } from "client/interactions/InteractionController";
import { Plots } from "shared/Plots";
import Interactions from "shared/utilities/decorators/InteractionDecorators";
import { Memory } from "shared/utilities/memory.utilities";
import { PlayerActions, PlotActions, StableActions } from "shared/utilities/network/Events";

@Interactions.Interaction({ name: "Land Proprietor", description: "Press \"%s\" to view nearby land." })
export class ClientLandProprietorInteraction {

    @Interactions.Interacted()
    public onInteraction(interaction: Interaction) {
        const seed = interaction.getSeed();

        BaseEntity.resolveClientEntity().then((client) => {
            CURRENT_STORE_META.id = math.floor(seed + Plots.Random);

            client.network.action(PlayerActions.Plot, PlotActions.REQUEST, math.floor(seed))
            
            States.States.set("shopping", true);
            StoreSubscription.set(ClientStoreTypes.LAND_PROPRIETOR)

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