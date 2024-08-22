import Object from "@rbxts/object-utils"
import { ReplicatedStorage, RunService } from "@rbxts/services"
import { BaseEntity } from "client/entities/BaseEntity"
import { Listeners } from "shared/utilities/decorators/EntityListensFor"
import { NetworkEvent } from "shared/utilities/network/Events"
import { TeamUtilities } from "shared/types/Teams"
import { Memory } from "shared/utilities/memory.utilities"
import { NetworkEntity } from "./NetworkEntity"

export namespace NetworkBubble {
    export const Reliable = ReplicatedStorage.WaitForChild("Reliable") as RemoteEvent
    const EntityCacheMap = new Map<number, BaseEntity>();
    
    const ContainerCacheMap = new Map<number, Map<number, buffer>>()
    const NetworkEntityMap = new Map<number, NetworkEntity>()

    export type RawEntityState = {
        buffer : buffer, id: number, pointer : number
    }

    export type RawEntityDataType = {
        id : number, states: Array<RawEntityState>, signature: number,
    }

    export function listen(code : number, listener: (buffer : buffer) => void) {
        Reliable.OnClientEvent.Connect((event : NetworkEvent, id : number, buffer : buffer) => {
            if(event !== NetworkEvent.Replicator) return
            if(id === code) listener(buffer)
        })
    }

    export function post(code : number, ...args : unknown[]) {
        Reliable.FireServer(NetworkEvent.Replicator, code, args)
    }

    export type ContainerDataCell = {
        buffer : buffer,
        id: number,
    }

    export type ContainerDataType = {
        data: Array<ContainerDataCell>,
        data_ids: number,
        id: number,
        replicationType: number,
        unique_id: string,
    }

    export function addNetworkEntityClass(entity : NetworkEntity) {
        NetworkEntityMap.set(entity.id, entity)
    }

    // States are assigned to entities and are used to store data
    export const RawEntityPopulation : Map<number, RawEntityDataType> = new Map()
    const EntityCreatedHook = new Instance("BindableEvent")

    const onEntityCreated = (entity : RawEntityDataType, from : number = -1) => {
        const EntityClass = Listeners.GetEntityClass(entity.signature);
        if(EntityClass) {

            if(RawEntityPopulation.has(entity.id)) return;
            if(EntityCacheMap.has(entity.id)) return;

            const _entity = new EntityClass(entity);
            EntityCacheMap.set(entity.id, _entity as BaseEntity);

            return _entity;
        }
    }

    export const getEntities = () => {
        const entities = new Array<BaseEntity>()

        EntityCacheMap.forEach((entity) => {
            entities.push(entity)
        })

        return entities
    }

    const onContainerInformationUpdated = (...args : unknown[]) => {
        const packed = args[0] as Array<unknown>;
        const code = packed[0] as number;

        if(code === 2) {
            // Updated an existing Container
            const id = packed[1] as number;
            const unique_id = packed[2] as string;
            const cell_id = packed[3] as number;
            const data = packed[4] as ContainerDataCell;

            if(!ContainerCacheMap.has(id)) {
                ContainerCacheMap.set(id, new Map())
            }

            if(ContainerCacheMap.get(id)?.has(cell_id)) {
                if(buffer.tostring(data.buffer) === buffer.tostring(ContainerCacheMap.get(id)!.get(cell_id)!)) return;
            }

            ContainerCacheMap.get(id)?.set(cell_id, data.buffer)
            Memory.getSubscription(unique_id as unknown as symbol)?.set(ContainerCacheMap.get(id))
        } else if (code === 1) {
            // Created a new Container with id:
            const id = packed[1] as number;
            const unique_id = packed[2] as string;
            const data = packed[3] as ContainerDataCell;

            if(!ContainerCacheMap.has(id)) {
                ContainerCacheMap.set(id, new Map())
            }

            if(ContainerCacheMap.get(id)?.has(data.id)) {
                if(buffer.tostring(data.buffer) === buffer.tostring(ContainerCacheMap.get(id)!.get(data.id)!)) return;
            }
            
            ContainerCacheMap.get(id)?.set(data.id, data.buffer)

            Memory.getSubscription(unique_id as unknown as symbol)?.set(ContainerCacheMap.get(id))
        } else if (code === 0) {
            // Container registration first time.
            const data = packed[1] as ContainerDataType[];
            data.forEach((data) => {
                if(!ContainerCacheMap.has(data.id)) {
                    ContainerCacheMap.set(data.id, new Map())
                };

                data.data.forEach((cell) => {
                    if(ContainerCacheMap.get(data.id)?.has(cell.id)) {
                        if(buffer.tostring(cell.buffer) === buffer.tostring(ContainerCacheMap.get(data.id)!.get(cell.id)!)) return;
                    }
                    
                    ContainerCacheMap.get(data.id)?.set(cell.id, cell.buffer)
                })
                
                if(Memory.getSubscription(data.unique_id as unknown as symbol)) {
                    Memory.getSubscription(data.unique_id as unknown as symbol)!.set(ContainerCacheMap.get(data.id))
                } else {
                    new Memory.Subscription(data.unique_id as unknown as symbol, ContainerCacheMap.get(data.id))
                }
            })
        }
    }

    const formatEntityStates = (data : RawEntityDataType) => {
        const casted = data as unknown as {id : number, states : Array<{
            properties: Array<RawEntityState>
        }>, signature : number}

        const formattedStates = new Array<RawEntityState>()
        const states = casted.states // as Array<{buffer : buffer, id: number, pointer: number}>

        states.forEach((state) => state.properties.forEach((property) => {
            formattedStates.push({
                id: property.id, pointer: property.pointer, buffer: property.buffer,
            })
        }))

        data.states = formattedStates
    }

    export const awaitEntity = <T>(id : number) : Promise<T | undefined> => {
        return new Promise((resolve, reject) => {
            let hasBeenResolved = false

            const connection = EntityCreatedHook.Event.Connect((data : RawEntityDataType) => {
                if(tonumber(data.id) === tonumber(id) || getEntity(id)) {
                    hasBeenResolved = true
                    connection.Disconnect()

                    resolve(getEntity(id) as T)
                }
            })

            task.spawn(() => {
                Reliable.FireServer(NetworkEvent.EntityRequest, id)
                const s = tick()

                while(!hasBeenResolved) {
                    task.wait(0.5)

                    if(tick() - s > 15) return

                    if(hasBeenResolved) break
                    if(getEntity(id)) {
                        hasBeenResolved = true
                        resolve(getEntity(id) as T)
                    }
                } 
            })

            // If the entity has not been resolved in 2 seconds, disconnect.
            // Will garbage collect the connection & prevent memory leaks.
            task.delay(15, () => {
                if(!hasBeenResolved) {
                    connection.Disconnect()
                    reject("Failed to await for entity creation!")
                }
            })
        })
    }

    export const getEntity = (id : number) => {
        return EntityCacheMap.get(id)
    }

    export const getEntitiesFrom = (signature : number) : Array<BaseEntity> => {
        const entities = new Array<BaseEntity>()

        EntityCacheMap.forEach((entity) => {
            if(entity.data.signature === signature) entities.push(entity)
        })

        return entities
    }

    export const Bubble = class {
        constructor() {
            // Our client network bubble, send information
            // to the server first, then the server will send back states.
            Reliable.FireServer(NetworkEvent.EntityPopulation)

            Reliable.OnClientEvent.Connect((event : NetworkEvent, ...args : unknown[]) => {
                if(event !== NetworkEvent.EntityPopulation) return
                //listener.Disconnect()

                const entities = args[0] as Record<number, RawEntityDataType>

                // Filter the states to proper format for raw data.
                for(const [ id, data ] of Object.entries(entities)) {
                    formatEntityStates(data)
                }


                const created : {onEntityCreated : (entity : unknown) => void}[] = []
                const newEntities = new Map<number, RawEntityDataType>()

                // Populate
                for(const [ _id, data ] of Object.entries(entities)) {
                    const id = data.id
                    if(RawEntityPopulation.has(tonumber(id)!)) continue
                    //RawEntityPopulation.set(tonumber(id) as number, data)

                    // Create the entity
                    const _created = onEntityCreated(data, 1) as {onEntityCreated? : () => void} | undefined
                    if(_created && _created.onEntityCreated) created.push(_created as {onEntityCreated : () => void})

                    // Trigger the hook.
                    newEntities.set(tonumber(id) as number, data)
                }

                task.spawn(() => {
                    RunService.Heartbeat.Wait()

                    newEntities.forEach((data, id) => {
                        RawEntityPopulation.set(id, data)
                    })

                    created.forEach((entity) => {
                        if(entity.onEntityCreated) entity.onEntityCreated(entity)
                    })
                })
            })
        }
    }

    export const Entities = class {
        constructor() {
            Reliable.OnClientEvent.Connect(async (event : NetworkEvent, ...args : unknown[]) => {
                const signature = args[0] as number
                const entity = tonumber(args[1]) as number

                if(event === NetworkEvent.Container) {
                    onContainerInformationUpdated(args)
                    return
                }

                if(event === NetworkEvent.EntityAction) {
                    const entityId = args[1] as number
                    const entity = EntityCacheMap.get(entityId)

                    if(!entity) return

                    const action = args[2] as number
                    const listeners = entity.network.getActionListeners()

                    if(!listeners.has(action)) return

                    listeners.get(action!)?.forEach((listener) => {
                        listener(args[3] as unknown[])
                    })

                    return
                }

                if(event === NetworkEvent.EntityCreation) {
                    const _entity = {states : args[2] as Array<RawEntityState>, id: entity, signature}
                    
                    formatEntityStates(_entity)
                    
                    const created = onEntityCreated(RawEntityPopulation.get(entity) as RawEntityDataType || _entity, 2)
                    EntityCreatedHook.Fire(RawEntityPopulation.get(entity) as RawEntityDataType || _entity)

                    RawEntityPopulation.set(entity, _entity)

                    if(created) {
                        const _created = created as {onEntityCreated : (entity : unknown) => void}
                        if(_created.onEntityCreated) _created.onEntityCreated(created)
                    }

                    return
                }   

                if(event !== NetworkEvent.EntityStateUpdate) return

                const changes = args[2] as Array<{ id: number, buffer: buffer, signature : number, pointer : number }>
                if(!RawEntityPopulation.has(entity)) {
                    await new Promise<void>((resolve, reject) => {
                        let hasBeenResolved = false

                        const connection = EntityCreatedHook.Event.Connect((data : RawEntityDataType) => {
                            if(data.id === entity) {
                                hasBeenResolved = true

                                connection.Disconnect()
                                
                                // Merge the changes
                                task.wait()
                                resolve()
                            }
                        })

                        // Wait for the entity to be created
                        //Reliable.FireServer(NetworkEvent.EntityPopulation)
                        Reliable.FireServer(NetworkEvent.EntityRequest, entity)

                        // If the entity has not been resolved in 15 seconds, disconnect.
                        // Will garbage collect the connection & prevent memory leaks.
                        task.delay(5, () => {
                            if(!hasBeenResolved) {
                                connection.Disconnect()
                                reject()
                            }
                        })

                    }).catch(() => warn("[CRITICAL] Failed to resolve entity creation"))
                }

                const data = RawEntityPopulation.get(entity) as RawEntityDataType
                if(!data) {
                    warn("Failed to resolve entity data for", entity, "with", changes)
                    warn("------ Debug Trace ------ ")

                    RawEntityPopulation.forEach((data, id) => {
                        warn("Entity", id, "has data", data)
                    })

                    warn("------ Debug Trace ------ ")

                    return
                }

                // Merge the changes
                for(const change of changes) {

                    if(change.pointer === undefined) continue;
                    const pointer = change.pointer - 1

                    const didExist = data.states[pointer] !== undefined;
                    
                    if(!data.states[pointer]) data.states[pointer] = { pointer, id: change.id, buffer: change.buffer }
                    data.states[pointer].buffer = change.buffer

                    const EntityClass = (Listeners.GetEntityClass(entity) || EntityCacheMap.get(entity)) as unknown as { new(data : RawEntityDataType) : void } & {__listeners : Map<number, TypedPropertyDescriptor<() => void>[]>, __creations: Array<(buffer : buffer) => void>};
                    if(!EntityClass) continue

                    const entityNetwork = NetworkEntityMap.get(entity);
                    if(entityNetwork && !didExist) {
                        entityNetwork.getCreations().get(change.pointer - 1)?.forEach((creation) => {
                            creation(change.buffer)
                        })
                    }

                    if(!EntityCacheMap.has(entity)) continue;
                    if(!EntityCacheMap.get(entity)?.__listeners) continue;
                    
                    EntityCacheMap.get(entity)?.__listeners.get(change.pointer - 1)?.forEach((listener) => {
                        const listenerWithBuffer : {["value"]: ((buffer : buffer) => void)} = listener as unknown as {["value"]: ((buffer : buffer) => void)}
                        listenerWithBuffer.value(change.buffer)
                    })
                }
            })

            // Our client network bubble, send information
            // to the server first, then the server will send back states.
            Reliable.FireServer(NetworkEvent.Container)
        }
    } 
}