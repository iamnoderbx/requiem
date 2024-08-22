import Object from "@rbxts/object-utils";
import { Branches } from "shared/Branches";
import { String } from "shared/utilities/string.utilities";
import { Blueprint } from "shared/Blueprint";

export namespace BlueprintCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.
    export function get(ignorePushAll : boolean = false) {
        const results = Object.keys(Blueprint.BlueprintLookupEnum).map((key) => {
            return String.CapitalizeFirstLetter(string.lower(key as string))
        })

        !ignorePushAll && results.push("@all")

        return results
    }

    export function parse(sender : Player, message : string) {
        if (message === "@all") {
            return BlueprintCommandType.get(true)
        }
        
        return BlueprintCommandType.get().filter((str) => {
            return string.sub(string.lower(str), 1, message.size()) === string.lower(message);
        })
    }
}