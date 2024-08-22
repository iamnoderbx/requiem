import Object from "@rbxts/object-utils";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

import { NetworkBubble } from "server/network/NetworkBubble";
import { Entities } from "shared/EntitySignatures";

export namespace BaseTitanPriorities {
    export function getHighestTitanHeatmapPriority(priorities : Map<BasePlayerEntity, number>) {
        // Get the highest priority from the heat map
        let highest_priority = 0;
        let result : BasePlayerEntity | undefined = undefined;

        for(const key of Object.keys(priorities)) {
            if(priorities.get(key)! > highest_priority) {
                highest_priority = priorities.get(key)!;
                result = key;
            }
        }

        return {result, priority : highest_priority};
    }

    export function createTitanHeatmapPriority(callback : (root : BasePart, id : number) => number) : Map<BasePlayerEntity, number> {
        const players = BaseEntity.getEntitiesFromClassIdentifier<BasePlayerEntity>(Entities.Players.CLIENT);
        const map = new Map<BasePlayerEntity, number>();

        players.forEach(async player => {
            const character = player.getCharacter()
            const root = await character.getHumanoidRootPart()

            if(!root) return;
            map.set(player, callback(root, player.getEntityPointer()));
        })

        return map;
    }
}