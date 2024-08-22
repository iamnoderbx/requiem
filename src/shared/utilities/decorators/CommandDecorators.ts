import { NetworkEvent } from "../network/Events"

export enum Permission {
    Owner,
    Lore,
    Admin,
    Moderator,
    Officer,
    Player,
}

export type ValidArgumentTypes = string | string[] | EnumItem | EnumItem[] | Instance | Instance[]

export type ClientCommandStructure = {
    name: string,
    description: string,
    permission: Permission[],
    arguments: { name: string, description: string, type: ValidArgumentTypes }[]
}[]

export type CommandStructure = {
    name: string,
    description: string,
    permission: Permission[],
    arguments: { name: string, description: string, type: ArgumentType }[]

    execute: (self: unknown, interaction: CommandInteraction, ...args: unknown[]) => void
}

export type CommandBufferStructure = [
    string, string, Permission[], [string, string, ValidArgumentTypes][]
]

export enum CommandResponse {
    Success = "Success",
    Failure = "Failure",
    Dropped = "Dropped",
}

export class CommandInteraction {
    private resolve! : (value: string | Promise<string>) => void
    private reject! : (reason?: any) => void

    private resolver : Promise<string>

    constructor(private sender : Player, callback : (promise : Promise<string>) => void) {
        this.resolver = new Promise<string>((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        });

        task.delay(1, () => {
            this.drop()
        })

        callback(this.resolver)
    }

    drop() {
        this.reject()
        return CommandResponse.Dropped
    }

    getSender() {
        return this.sender
    }

    reply(message : string) {
        this.resolve(message)
        return CommandResponse.Success
    }

    error(message : string) {
        this.reject(message)
        return CommandResponse.Failure
    }
}

type ArgumentRegistration = { name: string; description: string; } & { type: ArgumentType }

export interface ArgumentType {
    get: () => ValidArgumentTypes;
    parse: (sender : Player, message : string) => unknown;
}

export const CUSTOM_SPECIFIERS = [
    "@everyone",
    "@me",
    "@others",
    "@radius-",
]

export default abstract class Commands {
    static registry: CommandBufferStructure[] = []
    static argument_registry : Map<unknown, {name : string, description: string, type: ArgumentType}[]> = new Map()
    static guard_registry : Map<unknown, Permission[]> = new Map()
    static func_registry : Map<unknown, (self: unknown, interaction: CommandInteraction) => void> = new Map()

    static execute_registry : Map<string, (self: unknown, interaction: CommandInteraction, ...args: unknown[]) => void> = new Map()
    static command_map : Map<string, CommandStructure> = new Map()

    public static Arguments(args: ArgumentRegistration[]): (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<(interaction: CommandInteraction) => CommandResponse>) => void {
        return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<(interaction: CommandInteraction) => CommandResponse>) {
            if(!Commands.argument_registry.has(target)) Commands.argument_registry.set(target, [])
            args.forEach(arg => Commands.argument_registry.get(target)?.push({
                name: arg.name,
                description: arg.description,
                type: arg.type
            }))
            
            const method = descriptor.value;
            Commands.func_registry.set(target, method)
        };
    }

    public static Guard(permission: Permission[]): (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => CommandResponse>) => void | TypedPropertyDescriptor<() => CommandResponse> {
        return function (target: unknown, propertyKey: string, descriptor: TypedPropertyDescriptor<() => void>) {
            // Return the modified descriptor
            if(!Commands.guard_registry.has(target)) Commands.guard_registry.set(target, [])
            permission.forEach(perm => Commands.guard_registry.get(target)?.push(perm))

            return descriptor;
        };
    }

    public static Command(command: { name: string, description: string }) {
        return function <T extends { new(...args: any[]): {} }>(constructor: T) {
            const _args = Commands.argument_registry.get(constructor) ?? [];
            const guard = Commands.guard_registry.get(constructor) ?? [];

            const __newClass = class extends constructor {
                constructor(...args: any[]) {
                    super(...args as unknown[])
                }
            }

            // Add the command to the registry
            Commands.registry.push([
                command.name,
                command.description,
                guard,
                _args.map(arg => [arg.name, arg.description, arg.type.get()]),
            ])

            Commands.command_map.set(command.name, {
                name: command.name,
                description: command.description,
                permission: guard,
                arguments: _args,
                execute: Commands.func_registry.get(constructor)!
            })

            // Add the command to the execute registry
            Commands.execute_registry.set(command.name, Commands.func_registry.get(constructor)!)
            return __newClass
        }
    }

    public static getCommands() {
        return Commands.registry
    }
}