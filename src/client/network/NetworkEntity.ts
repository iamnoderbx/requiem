import { NetworkEvent, GearActions } from "shared/utilities/network/Events";
import { NetworkBubble } from "./ClientBubbles";

export class NetworkEntity {
    private __listeners : Map<GearActions, Array<(args : unknown[]) => void>> = new Map()
    private __creations : Map<number, ((buffer : buffer) => void)[]> = new Map();

    constructor(public id : number) {
        NetworkBubble.addNetworkEntityClass(this)
    }

    public getCreations() {
        return this.__creations;
    }

    public getActionListeners() {
        return this.__listeners;
    }

    public listen<T>(action: number, callback: (args : T) => void) {
        const listeners = this.__listeners.get(action) || []
        listeners.push(callback as unknown as (args : unknown[]) => void)
        this.__listeners.set(action, listeners)

        return () => {
            const listeners = this.__listeners.get(action)
            
            if(listeners) {
                const index = listeners.indexOf(callback as unknown as (args : unknown[]) => void)
                if(index !== -1) {
                    listeners.remove(index)
                }
            }
        }
    }

    public onBufferAdded(index : number, callback : (buffer : buffer) => void) {
        if(!this.__creations.get(index)) this.__creations.set(index, [])
        this.__creations.get(index)!.push(callback)
    }

    public action(action : number, ...args : unknown[]) {
        print("Firing action", action, args)
        NetworkBubble.Reliable.FireServer(NetworkEvent.EntityAction, this.id, action, args)
    }
}