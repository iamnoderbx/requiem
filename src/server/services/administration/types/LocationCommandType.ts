import Object from "@rbxts/object-utils"
import { Locations } from "shared/types/Locations"
import { String } from "shared/utilities/string.utilities"

export namespace LocationCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.

    export function get() {
        return Object.keys(Locations).map((key) => {
            return String.CapitalizeFirstLetter(string.lower(key as string))
        })
    }

    export function parse(sender : Player, message : string) {
        return LocationCommandType.get().filter((str) => {
            return string.sub(string.lower(str), 1, message.size()) === string.lower(message);
        })
    }
}