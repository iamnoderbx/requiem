import { Players } from "@rbxts/services";
import { BaseEntity } from "server/entities/BaseEntity";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { ArgumentType } from "shared/utilities/decorators/CommandDecorators";

export namespace PlayerCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.
    export function get() {
        return Players;
    }

    export function parse(sender : Player, message : string) {
        const getArrayResults = () => {
            switch(message) {
                case "@everyone": return Players.GetPlayers();
                case "@me": return [sender];
                case "@others": return Players.GetPlayers().filter(plr => plr !== sender);
            }

            return Players.GetPlayers().filter((plr) => {
                return string.sub(string.lower(plr.Name), 1, message.size()) === string.lower(message);
            })
        };

        const results = getArrayResults();
        return results.map(plr => {
            return BaseEntity.resolveEntityFromInstance<BasePlayerEntity>(plr);
        });
    }
}