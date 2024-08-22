export namespace NumberCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.
    export function get() {
        return "number"
    }

    export function parse(sender : Player, message : string) {
        return tonumber(message)
    }
}