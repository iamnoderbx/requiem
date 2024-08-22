import { ComponentWrapper } from "./ComponentDataWrapper";

export default class ComponentListeners {
    private listeners : Map<string, (...args: any[]) => any> = new Map()

    public subscribe(event: string, callback: (...args: any[]) => any) {
        this.listeners.set(event, callback)
    }

    /** @hidden */
    execute(method : string, ...args : unknown[]) {
        if(this.listeners.size() === 0) return

        this.listeners.forEach((callback, event) => {
            if(method !== event) return
            callback(...args)
        })
    }
}

export function AttachSubscriptionListener() {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value as (...args: any[]) => any;

        descriptor.value = function (...args: unknown[]) {
            const _self = args[0] as ComponentWrapper.Data

            const results = originalMethod(...args)
            _self.listeners.execute(propertyKey, _self.get())

            return results;
        };

        return descriptor;
    };
}