export namespace StringCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.
    export function get() {
        return "string"
    }

    export function parse(sender : Player, message : string) {
        return message
    }
}