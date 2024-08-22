type ConstructorType = { new(...args: any[]): {} }

const controllers = new Map<string, ConstructorType>();
const __ignitedControllers = new Map<unknown, ConstructorType>();

export function Controller() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        const construct = class extends constructor {
            constructor(...args: any[]) {
                super(...args as unknown[]);
            }
        }

        controllers.set(tostring(constructor), construct)

        return construct
    }
}

export function getController<T>(controller: T) {
    return __ignitedControllers.get(controller) as InstanceType<T>
}

export function __igniteControllers() {
    for(const [_, controller] of controllers) {
        debug.profilebegin("Ignite Controller: " + tostring(controller))
        const cont = new controller()
        __ignitedControllers.set(controller, cont as ConstructorType)
    
        const __casted = (cont as unknown as {initialize: (self : ConstructorType) => void})
        if(__casted.initialize) {
            __casted.initialize(cont as ConstructorType)
        }
        debug.profileend()
    }
}