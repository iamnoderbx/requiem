export namespace AnimalColorCommandType {
    // If the return type is an instance, the client will
    // get all children of that instance and return it.
    export function get() {
        return ["white", "black", "grey", "brown"]
    }

    export function parse(sender : Player, message : string) {
        return AnimalColorCommandType.get().filter((str) => {
            return string.sub(string.lower(str), 1, message.size()) === string.lower(message);
        })
    }
}