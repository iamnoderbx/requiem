import { CollectionService } from "@rbxts/services";

export function EntityListensFor(event: RBXScriptSignal) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const construct =  class extends constructor {
            constructor(...args: any[]) {
                super(...args as unknown[]);
            }
        }
        
        event.Connect((...args : unknown[]) => {
            new construct(...args as unknown[])
        });
        
        return construct
    }
}

const taggedEntityConstructors = new Map<string, { new(...args: any[]): {} }>()

export function EntityTaggedWith(tag: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const construct =  class extends constructor {
            constructor(...args: any[]) {
                super(...args as unknown[]);
            }
        }
        
        const casted = (constructor as typeof constructor & {____tag: string})
        casted.____tag = tag

        const castedConstruct = (construct as typeof construct & {____tag: string})
        castedConstruct.____tag = tag

        taggedEntityConstructors.set(tag, construct)

        return construct
    }
}

export function IgniteTaggedEntities() {
    CollectionService.GetInstanceAddedSignal("entity").Connect((instance) => {
        const tag = instance.GetAttribute("type") as string | undefined
        if(!tag) return;
    
        if(taggedEntityConstructors.has(tag)) {
            new (taggedEntityConstructors.get(tag) as { new(...args: any[]): {} })(instance)
        }
    })
    
    CollectionService.GetTagged("entity").forEach((instance) => {
        const tag = instance.GetAttribute("type") as string | undefined
        if(!tag) return;
    
        if(taggedEntityConstructors.has(tag)) {
            new (taggedEntityConstructors.get(tag) as { new(...args: any[]): {} })(instance)
        }
    })
}


export function EntityIsServerOnly() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const construct = class extends constructor {
            constructor(...args: any[]) {
                super(...args as unknown[]);
            }
        }
        
        const casted = (constructor as typeof constructor & {____server: boolean})
        casted.____server = true

        const castedConstruct = (construct as typeof construct & {____server: boolean})
        castedConstruct.____server = true

        return construct
    }
}


export function EntityIsLocalized(enumeration : number) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const construct = class extends constructor {
            constructor(...args: any[]) {
                super(...args as unknown[]);
            }
        }
        
        const casted = (constructor as typeof constructor & {____localized: boolean})
        casted.____localized = true

        const castedConstruct = (construct as typeof construct & {____localized: boolean})
        castedConstruct.____localized = true

        return construct
    }
}


// (target: ClientPlayerEntity, propertyKey: "onNumberChanged", descriptor: TypedPropertyDescriptor<() => void>) => void | TypedPropertyDescriptor<() => void>

export const DecoratorSubscriptions = new Map<number, Map<number, TypedPropertyDescriptor<() => void>[]>>() 

export function subscribe(id: number) {
    return function (target: {data : {id: number}, __listeners: Map<number, TypedPropertyDescriptor<() => void>[]>}, propertyKey: string, descriptor: TypedPropertyDescriptor<() => void>) {
        if(!target.__listeners) {
            target.__listeners = new Map()
        }

        if(!target.__listeners.has(id)) {
            target.__listeners.set(id, [])
        }

        target.__listeners.get(id)!.push(descriptor)
    }
}

export namespace Listeners {
    const classes = new Map<number, { new(...args: any[]): {} }>()

    export function EntityReplicatedWith(enumeration : number) {
        return function <T extends { new(...args: any[]): {} }>(constructor: T) {
            const construct =  class extends constructor {
                constructor(...args: any[]) {
                    super(...args as unknown[]);
                }
            }

            classes.set(enumeration, construct)
            return construct
        }
    }

    export function GetEntityClass(enumeration : number) {
        return classes.get(enumeration)
    }
}