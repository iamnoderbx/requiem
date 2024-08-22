import { CollectionService } from "@rbxts/services";

type ConstructorType = { new(...args: any[]): {} }

const objects = new Map<string, ConstructorType>();
const active = new Map<Instance, unknown>();

export namespace World {
    export function Object(tag : string) {
        return function <T extends { new(...args: any[]): {} }>(constructor: T) {
            const construct = class extends constructor {
                constructor(...args: any[]) {
                    super(...args as unknown[]);
                }
            }
    
            objects.set(tag, construct)
            return construct
        }
    }

    export function GetObjectFromInstance<T>(instance : Instance) : T {
        return active.get(instance) as unknown as T;
    }
}

export function __igniteWorldObjects() {
    const construct = (cons : ConstructorType, object : Instance) => {
        const classIs = new cons(object) as {initialize?: (self : ConstructorType) => void, destroy?: (self : ConstructorType) => void};
        if(classIs.initialize) classIs.initialize(classIs as ConstructorType);

        active.set(object, classIs);

        object.AncestryChanged.Connect(() => {
            if(object.Parent === undefined) {
                if(classIs.destroy) classIs.destroy(classIs as ConstructorType);
            }
        })
    }

    for (const [tag, constructor] of objects) {
        const objects = CollectionService.GetTagged(tag);

        for (const object of objects) {
            construct(constructor, object);
        }

        CollectionService.GetInstanceAddedSignal(tag).Connect((object) => {
            construct(constructor, object);
        })

        CollectionService.GetInstanceRemovedSignal(tag).Connect((object) => {
            if(active.has(object)) {
                const classIs = active.get(object) as {destroy?: () => void};
                if(classIs.destroy) classIs.destroy();

                active.delete(object);
            }
        })
    }
}