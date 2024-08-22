import Object from "@rbxts/object-utils";
import { RunService } from "@rbxts/services";
import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { NetworkBubble } from "server/network/NetworkBubble";

export enum InitializationStatus {
    INITIALIZED,
    UNINITIALIZED
}

export abstract class BaseEntity {
    // All base entities must implement an initialize method.
    public abstract initialize(...args: unknown[]): any;
    public isInitialized: Promise<number>

    public status: InitializationStatus = InitializationStatus.UNINITIALIZED
    public static entities: Map<number, BaseEntity> = new Map()

    private cooldowns: Map<number, number> = new Map()

    // The network bubble is used to replicate the entity to the client
    protected network: NetworkBubble.Entity;
    private destroyedCallbacks: Array<() => void> = []

    constructor(public signature: number, protected components: ComponentWrapper.Entity, callback: (promise: Promise<unknown>) => void, localization?: Player) {
        this.network = new NetworkBubble.Entity(signature)
        BaseEntity.entities.set(this.network.getEntityPointer(), this)

        const casted = (this as unknown as { ____localized: boolean, ____server : boolean, instance: Instance })
        const isLocalizedEntity = casted.____localized
        const isServerEntity = casted.____server

        this.isInitialized = new Promise((resolved, rejected) => {
            try {
                const ordered = components.orderedComponents;
                ordered.forEach((symbol) => {
                    const component = components.getComponents()[symbol]
                    component.state.setEntityPointer(this.network.getEntityPointer())

                    this.network.addEntityState(component.state)
                })

                isLocalizedEntity === true && !this.network.getLocalized() && this.network.setLocalization(localization || casted.instance)
                isServerEntity === true && !this.network.getServer() && this.network.setServer()
                this.network.publish()

                // Render the entity at the next cycle
                task.spawn(() => {
                    RunService.Heartbeat.Wait()
                    resolved(1)

                    this.status = InitializationStatus.INITIALIZED
                })
            } catch (e) {
                rejected(e)
            }
        })

        callback(this.isInitialized)
    }

    onEntityDestroyed(callback : () => void) {
        this.destroyedCallbacks.push(callback)
    }

    destroy() {
        this.destroyedCallbacks.forEach((callback) => callback())
        this.destroyedCallbacks = []
        
        BaseEntity.entities.delete(this.network.getEntityPointer())

        this.network.destroy()
        this.components.destroy()

        rawset(this, "status", undefined)
        rawset(this, "isInitialized", undefined)
        rawset(this, "network", undefined)
        rawset(this, "components", undefined)
        rawset(this, "cooldowns", undefined)
        rawset(this, "destroyedCallbacks", undefined)
    }

    isEntityOnCooldown() {
        const stamp = tick()

        for (const [cooldown, length] of this.cooldowns) {
            if (stamp < length) return true
        }

        return false
    }

    hasEntityCooldown(cooldown: number) {
        return this.cooldowns.has(cooldown) && tick() < this.cooldowns.get(cooldown)!
    }

    setEntityCooldown(cooldown: number, length: number) {
        this.cooldowns.set(cooldown, tick() + length)
    }

    clearEntityCooldowns() {
        this.cooldowns.clear()
    }

    getNetwork() {
        return this.network
    }

    getEntityPointer() {
        return this.network.getEntityPointer()
    }

    getInitializationStatus() {
        return this.status
    }

    addComponent(component: ComponentWrapper.Data, index?: number) {
        this.components.addComponent(component);

        component.state.setEntityPointer(this.network.getEntityPointer())
        
        this.network.addEntityState(component.state)
        this.network.pushEntityState(component.state)
    }

    getComponent<T extends { Component: object }>(component: T) {
        return this.components.getComponent(component) as InstanceType<T['Component']>
    }

    getComponents() {
        return this.components.getComponents()
    }

    public static resolveEntityFromInstance<T extends BaseEntity>(instance: Instance): T | undefined {
        return BaseEntity.entities.get(instance.GetAttribute("id") as number) as unknown as T
    }

    public static getEntitiesFromClassIdentifier<T>(id: number) {
        let results: Array<defined> = [] // Fix: Explicitly cast the results array to type Array<defined>
        BaseEntity.entities.forEach((entity) => {
            if (entity.signature === id) {
                results.push(entity as unknown as defined) // Fix: Cast entity to type defined
            }
        })

        return results as Array<T> // Fix: Cast results to type Array<defined>
    }

    public static resolveEntityFromId<T extends BaseEntity>(id: number): T | undefined {
        return BaseEntity.entities.get(id) as unknown as T
    }
}