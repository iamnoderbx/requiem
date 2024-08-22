import { BaseEntity } from "client/entities/BaseEntity";
import { CURRENT_STORE_META, ClientStoreSubscription, ClientStoreTypes, States, StoreSubscription } from "client/entities/player/ClientPlayerStates";
import { Interaction } from "client/interactions/InteractionController";
import { HorseStableWorldObject } from "client/world/HorseStableWorldObject";
import Interactions from "shared/utilities/decorators/InteractionDecorators";
import { World } from "shared/utilities/decorators/WorldDecorators";
import { Memory } from "shared/utilities/memory.utilities";
import { PlayerActions, StableActions } from "shared/utilities/network/Events";

export const ClientStablemenInteractionData = {
    stable: undefined,
} as { stable: HorseStableWorldObject | undefined };

@Interactions.Interaction({ name: "Stablemen", description: "Press \"%s\" to shop." })
export class ClientSaddleInteraction {

    @Interactions.Interacted()
    public onInteraction(interaction: Interaction) {
        const part = interaction.getPart();
        const position = part.Position;

        const seed = position.X + position.Y + position.Z;
        BaseEntity.resolveClientEntity().then((client) => {
            CURRENT_STORE_META.id = math.floor(seed);
            client.network.action(PlayerActions.Stable, StableActions.REQUEST, math.floor(seed))

            States.States.set("shopping", true);
            StoreSubscription.set(ClientStoreTypes.STABLE)
            
            ClientStablemenInteractionData.stable = World.GetObjectFromInstance<HorseStableWorldObject>(part.Parent!);

            const connection = client.getEntityCharacter().getCharacterMoved(10).then(() => {
                store();

                States.States.set("shopping", false);
                StoreSubscription.set(ClientStoreTypes.NONE)

                CURRENT_STORE_META.id = 0;
            }).catch((e) => warn(e))

            // Subscribe to the store
            const store = Memory.subscribe(ClientStoreSubscription, () => {
                connection.cancel();
            })
        })
    }

}