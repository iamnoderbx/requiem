import { CollectionService, Players, ReplicatedFirst } from "@rbxts/services";
import { NetworkBubble } from "client/network/ClientBubbles";
import { ClientPlayerEntity } from "./player/ClientPlayerEntity";
import { NetworkEntity } from "client/network/NetworkEntity";
import { Memory } from "shared/utilities/memory.utilities";
import { Keybinds } from "shared/Keybindings";

export class BaseEntity {
    public network: NetworkEntity

    private static entityModelCache: Map<number, Instance> = new Map()
    public __listeners: Map<number, ({ ['value']: (buffer: buffer) => void })[]> = new Map()

    private cooldowns: Map<number, number> = new Map()

    constructor(public data: NetworkBubble.RawEntityDataType, private onEntityCreated?: () => void) {
        this.network = new NetworkEntity(data.id)
    }

    protected createBufferSynchronizers(index: number, callback: (reader: buffer) => unknown, writer: Memory.Subscription<unknown>) {
        let hook : ((map : Keybinds.Map) => void) | undefined

        const buffer = callback(this.getBufferFromIndex(index))
        writer.set(buffer)

        this.getBufferListeners().subscribe(index, (buffer: buffer) => {
            writer.set(callback(buffer))
            if (hook) hook(writer.get() as Keybinds.Map)
        })

        return {
            hook: ((callback : (map : Keybinds.Map) => void) => {
                hook = callback
                callback(writer.get() as Keybinds.Map)
            })
        }
    }

    public awaitBufferCreation(index: number) {
        if (this.data.states[index]) return Promise.resolve(this.data.states[index].buffer)

        return new Promise<buffer>((resolve) => {
            this.network.onBufferAdded(index, (buffer) => {
                resolve(buffer)
            })
        })
    }

    public createImmutableMap<T>(data: T): T {
        return data;
    }

    public getBufferListeners() {
        return {
            subscribe: (index: number, callback: (buffer: buffer) => void) => {
                if(!this.__listeners.has(index)) this.__listeners.set(index, [])
                
                const current = this.__listeners.get(index) as ({ ['value']: (buffer: buffer) => void })[]
                current.push({ value: callback })

                this.__listeners.set(index, current)

                return () => this.__listeners.delete(index)
            }
        }
    }

    protected awaitBufferFromIndex(index: number) {
        return new Promise<buffer>((resolve) => {
            this.network.onBufferAdded(index, (buffer) => {
                resolve(buffer)
            })
        })
    }

    protected isBufferAlive(index: number) {
        return this.data.states[index]
    }

    public getBufferFromIndex(index: number): buffer {
        return this.data.states[index].buffer
    }

    protected isEntityOnCooldown() {
        const stamp = tick()

        for (const [cooldown, length] of this.cooldowns) {
            if (stamp < length) return true
        }

        return false
    }

    protected hasEntityCooldown(cooldown: number) {
        return this.cooldowns.has(cooldown) && tick() < this.cooldowns.get(cooldown)!
    }

    protected setEntityCooldown(cooldown: number, length: number) {
        this.cooldowns.set(cooldown, tick() + length)
    }

    public static getEntityFromSignature<T extends BaseEntity>(typeIs: number) {
        const entities = NetworkBubble.getEntities();
        return entities.filter((entity) => entity.data.signature === typeIs)[0] as T
    }

    public static doesEntityInstanceExist(instance: Instance) {
        const id = instance.GetAttribute("id") as number;
        const entity = NetworkBubble.getEntity(id);

        if (!entity) return false;
        return true;
    }

    public static async resolveEntityFromInstance<T>(instance: Instance) {
        const id = instance.GetAttribute("id") as number;
        const entity = NetworkBubble.getEntity(id);

        if (!entity) {
            const res = await NetworkBubble.awaitEntity<T>(id);
            return res as T
        } else {
            return entity as T
        }

    }

    public static async getEntityFromIdentifier<T>(number: number) {
        const entity = NetworkBubble.getEntity(number);
        if (entity) return entity as T;

        return await NetworkBubble.awaitEntity(number) as T;
    }

    public static getEntitiesFromExcept(entities: BaseEntity[], except: BaseEntity[]) {
        return entities.filter((entity) => !except.includes(entity))
    }

    public static getEntitiesFrom(entities: BaseEntity[]) {
        return (entities.map((entity) => BaseEntity.resolveEntityInstance<Model>(entity) as Model)
            .filter((entity): entity is Model => entity !== undefined) as Model[])
    }

    public static async resolveClientEntity() {
        const player = Players.LocalPlayer;
        const result = await BaseEntity.resolveEntityFromInstance<ClientPlayerEntity>(player);
        return result;
    }

    public static getEntityInstances() {
        const models = CollectionService.GetTagged("entity")
        return models;
    }

    public static async awaitResolveEntityInstance<T>(entity: BaseEntity) {
        const __entity = BaseEntity.resolveEntityInstance<T>(entity);
        if (__entity) return __entity;

        const id = entity.data.id;

        const entityResult = await NetworkBubble.awaitEntity<T>(id) as BaseEntity;
        let model = BaseEntity.resolveEntityInstance<T>(entityResult);

        while (!model) {
            model = BaseEntity.resolveEntityInstance<T>(entityResult);
            wait(0.1)
            warn("Awaiting for entity model!")
        }

        return model;
    }

    public static resolveEntityInstance<T>(entity: BaseEntity) {
        if (BaseEntity.entityModelCache.has(entity.data.id))
            return BaseEntity.entityModelCache.get(entity.data.id) as T;

        const models = CollectionService.GetTagged("entity")
        const entityModel = models.find((model) => model.GetAttribute("id") === entity.data.id)

        if (entityModel) BaseEntity.entityModelCache.set(entity.data.id, entityModel)
        return entityModel as T | undefined;
    }
}