import { Permission } from "./CommandDecorators";

export type InteractionStructure = {
    name: string,
    description?: string,
    permission: Permission[],
    execute: (self: unknown, ...args: unknown[]) => void
}

export default abstract class Interactions {
    static guard_registry : Map<unknown, Permission[]> = new Map()
    static func_registry : Map<unknown, (self: unknown) => void> = new Map()

    static execute_registry : Map<string, (self: unknown, ...args: unknown[]) => void> = new Map()
    static interaction_map : Map<string, InteractionStructure> = new Map()

    public static getInteraction(name: string) {
        return Interactions.interaction_map.get(name)
    }

    public static Interacted(): (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<(interaction : unknown) => void>) => void {
        return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => void>) {
            const method = descriptor.value;
            Interactions.func_registry.set(target, method)
        };
    }

    public static Interaction(interaction: { name: string, description?: string }) {
        return function <T extends { new(...args: any[]): {} }>(constructor: T) {
            const guard = Interactions.guard_registry.get(constructor) ?? [];

            const __newClass = class extends constructor {
                constructor(...args: any[]) {
                    super(...args as unknown[])
                }
            }

            Interactions.interaction_map.set(interaction.name, {
                name: interaction.name,
                description: interaction.description,
                permission: guard,
                execute: Interactions.func_registry.get(constructor)!
            })

            // Add the interaction to the execute registry
            Interactions.execute_registry.set(interaction.name, Interactions.func_registry.get(constructor)!)
            return __newClass
        }
    }

    public static Guard(permission: Permission[]): (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => void>) => void | TypedPropertyDescriptor<() => void> {
        return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => void>) {
            // Return the modified descriptor
            if(!Interactions.guard_registry.has(target)) Interactions.guard_registry.set(target, [])
            permission.forEach(perm => Interactions.guard_registry.get(target)?.push(perm))

            return descriptor;
        };
    }
}