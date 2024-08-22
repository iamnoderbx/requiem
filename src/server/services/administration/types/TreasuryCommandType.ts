import Object from "@rbxts/object-utils"
import { Locations } from "shared/types/Locations"
import { Treasury } from "shared/types/Treasury"
import { String } from "shared/utilities/string.utilities"

export namespace TreasuryCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.

    export function get() {
        return Object.keys(Treasury.Type).map((key) => {
            return String.CapitalizeFirstLetter(string.lower(key as string))
        })
    }

    export function parse(sender : Player, message : string) {
        return TreasuryCommandType.get().filter((str) => {
            return string.sub(string.lower(str), 1, message.size()) === string.lower(message);
        })
    }
}