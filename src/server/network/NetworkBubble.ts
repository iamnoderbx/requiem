import { Players, ReplicatedStorage } from "@rbxts/services";
import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { NetworkEvent } from "shared/utilities/network/Events";

export namespace NetworkBubble {
    const Reliable = new Instance("RemoteEvent")
    Reliable.Name = "Reliable"
    Reliable.Parent = ReplicatedStorage

    export const Entities : Map<number, Entity> = new Map();
    export const Containers : Container<ComponentWrapper.Data>[] = [];

    export enum ReplicationType {
        PUBLIC,
        PRIVATE
    }
    
    let EntityPointers : number[] = [];
    let EntitySizePointer : number = 1;

    let ContainerSizePointer : number = 0;

    export class Replicator {
        constructor(private id : number) {

        }

        listen(callback : (player : Player, args : unknown[]) => void) {
            Reliable.OnServerEvent.Connect((player : Player, ...args : unknown[]) => {
                debug.profilebegin("Replicator.listen " + this.id)

                const [ event, id, buffer ] = args as [ NetworkEvent, number, unknown[] ]
                if(event === NetworkEvent.Replicator) {
                    if(id !== this.id) return debug.profileend()

                    callback(player, buffer)
                }

                debug.profileend()
            })
        }

        send(player : Player, buffer : buffer) {
            debug.profilebegin("Replicator.send " + this.id)

            Reliable.FireClient(player, NetworkEvent.Replicator, this.id, buffer)

            debug.profileend()
        }

        post(buffer : buffer) {
            debug.profilebegin("Replicator.post " + this.id)

            Reliable.FireAllClients(NetworkEvent.Replicator, this.id, buffer)

            debug.profileend()
        }
    }

    export class Container<T extends ComponentWrapper.Data> {
        private data : T[] = [];

        private id : number = ContainerSizePointer;
        private unique_id : string = "undefined";

        private data_ids: number = 0;
        private replicationType : ReplicationType = ReplicationType.PUBLIC;

        constructor() {
            Containers.push(this)
            ContainerSizePointer++;
        }

        get() {
            return this.data;
        }

        add(_data : T) {
            debug.profilebegin("Container.add " + this.id)

            let data = _data as T & {id?: number}
            data.id = this.data_ids;

            data.listeners.subscribe("rewrite", (...args : unknown[]) => {
                debug.profilebegin("Container.rewrite " + this.id)
                Reliable.FireAllClients(NetworkEvent.Container, 2, this.id, this.unique_id, data.id, data, args)
                debug.profileend()
            })

            this.data_ids++;

            this.data.push(data);
            Reliable.FireAllClients(NetworkEvent.Container, 1, this.id, this.unique_id, data)
            debug.profileend()
        }

        remove(data : T) {
            this.data = this.data.filter(d => d !== data);
        }

        setReplicationType(replicationType : ReplicationType) {
            this.replicationType = replicationType;
            return this;
        }

        setReplicationIdentifier(identifier : string) {
            this.unique_id = identifier;
            return this;
        }
    }

    // States are assigned to entities and are used to store data
    export class State {
        private entity : number | undefined;
        private signature : number | undefined;

        private properties : Property[] = []
        private length : number = 0;

        private pointer : number = 0;

        createProperty(buffer : buffer, id?: number) {
            this.length += 1;

            if(id) this.properties[id] = createProperty(this.signature!, id, buffer)
            else this.properties.push(createProperty(this.signature!, this.length - 1, buffer))
            
            return this.length - 1;
        }

        destroy() {
            this.properties = [];
            
            rawset(this, "properties", undefined);
            rawset(this, "entity", undefined);
            rawset(this, "signature", undefined);
            rawset(this, "length", undefined);
            rawset(this, "pointer", undefined);
        }

        overrideProperty(id : number, buffer : buffer) {
            if(!this.properties[id]) this.createProperty(buffer, id);

            this.properties[id].buffer = buffer;
        }

        getProperties() {
            return this.properties;
        }

        getEntityPointer() : number | undefined {
            return this.entity;
        }

        setEntityPointer(entity : number) {
            this.entity = entity;
        }

        setEntitySignature(signature : number) {
            this.signature = signature;
        }

        getEntitySignature() : number | undefined {
            return this.signature;
        }

        setStatePointer(pointer : number) {
            this.pointer = pointer;
        }

        getStatePointer() {
            return this.pointer
        }
    }

    // Properies are assigned to states and are used to store data
    export interface Property { signature: number, id: number, buffer : buffer, pointer : number }

    export function createProperty(signature : number, id : number, buffer : buffer, pointer : number = 0) : Property {
        return { signature, id, buffer, pointer }
    }

    export class Entity {
        // This is a private field that is only used to store the value in a buffer
        private id : number = NetworkBubble.Entity.getNewEntityId();
        public states : State[] = []

        private localized : Player | undefined;

        public isLocalized : boolean = false;
        public isServerOnly : boolean = false;

        private actionListeners : Map<number, (...args : unknown[]) => void> = new Map();

        // Find the first available entity id
        public static getNewEntityId() : number {
            if(EntityPointers.size() === 0) return 0;
            if(EntityPointers.size() === EntitySizePointer) {
                EntitySizePointer++;

                return EntitySizePointer;
            }

            let id = 1;
            while(EntityPointers.includes(id)) id++;
            return id;
        }

        // An entity with no states is useless & therefor will not replicate
        constructor(private signature : number) {
            // Populate the entity pointers array with this entity's id
            EntityPointers.push(this.id);
        }

        listen(action : number, callback : (...args : unknown[]) => void) {
            this.actionListeners.set(action, callback);
        }

        action(action : number, ...args : unknown[]) {
            debug.profilebegin("Entity.action " + this.id + " " + action)
            if(this.isLocalized) {
                if(this.localized && this.localized.IsA("Player")) {
                    Reliable.FireClient(this.localized, NetworkEvent.EntityAction, this.signature, this.id, action, args)
                }
            } else if (!this.isServerOnly) {
                Reliable.FireAllClients(NetworkEvent.EntityAction, this.signature, this.id, action, args)
            }
            debug.profileend()
        }

        getActionListeners() {
            return this.actionListeners;
        }

        pushEntityState(state : State) {
            debug.profilebegin("Entity.pushEntityState " + this.id)
            if(this.isLocalized) Reliable.FireClient(this.localized!, NetworkEvent.EntityStateUpdate, this.signature, this.id, state.getProperties())
            else if(!this.isServerOnly) Reliable.FireAllClients(NetworkEvent.EntityStateUpdate, this.signature, this.id, state.getProperties())
            debug.profileend()
        }

        addEntityState(state : State) {

            debug.profilebegin("Entity.addEntityState " + this.id)

            state.setEntitySignature(this.signature);
            this.states.push(state);
            
            // Update the state properties.
            state.getProperties().forEach(property => {
                property.signature = this.signature;

                property.id = this.getEntityPointer()
                property.pointer = this.states.size()

                state.setStatePointer(property.pointer)
            })

            debug.profileend()

            //Reliable.FireAllClients(NetworkEvent.EntityStateUpdate, this.signature, this.id, state.getProperties())
        }

        requested(player : Player) {
            debug.profilebegin("Entity.requested " + this.id)
            Reliable.FireClient(player, NetworkEvent.EntityCreation, this.signature, this.id, this.states)
            debug.profileend()
        }

        publish() {
            debug.profilebegin("Entity.publish " + this.id)
            Entities.set(this.id, this);

            if(this.isLocalized) {
                if(this.localized && this.localized.IsA("Player")) {
                    Reliable.FireClient(this.localized, NetworkEvent.EntityCreation, this.signature, this.id, this.states)
                }
            } else if(!this.isServerOnly) {
                Reliable.FireAllClients(NetworkEvent.EntityCreation, this.signature, this.id, this.states)
            }

            debug.profileend()
        }

        destroy() {
            // Remove this entity from the entity pointers array
            EntityPointers = EntityPointers.filter(entityId => entityId !== this.id);

            // Remove this entity from the entities map
            Entities.delete(this.id);

            rawset(this, "localized", undefined);
            rawset(this, "isLocalized", undefined);
            rawset(this, "actionListeners", undefined);
            rawset(this, "signature", undefined);
            rawset(this, "states", undefined);
            rawset(this, "id", undefined);
        }

        getEntityPointer() : number {
            return this.id;
        }

        getEntitySignature() : number {
            return this.signature;
        }

        setServer() {
            this.isServerOnly = true;
        }

        getServer() {
            return this.isServerOnly
        }

        getLocalized() : Player | undefined {
            return this.localized;
        }

        setLocalization(instance : Instance) {
            if(instance.IsA("Player")) {
                this.localized = instance as Player;
            } else if (instance.IsA("Model")) {
                this.localized = Players.GetPlayerFromCharacter(instance as Model);
            }

            this.isLocalized = true;
        }
    }

    type BufferChangeMap = ({
        id: number;
        buffer: buffer;
    } | undefined)[]

    export const merge = (entity : Entity, former : buffer[], current : buffer[], changes: BufferChangeMap) => {
        debug.profilebegin("NetworkBubble.merge " + entity.getEntityPointer())
        if(entity.isLocalized) {
            if(!entity.getLocalized()) return
            
            Reliable.FireClient(entity.getLocalized()!, NetworkEvent.EntityStateUpdate, entity.getEntitySignature(), entity.getEntityPointer(), changes)
            return
        }

        if(entity.isServerOnly) return

        Reliable.FireAllClients(
            NetworkEvent.EntityStateUpdate, 
            entity.getEntitySignature(), 
            entity.getEntityPointer(), 
            changes
        )
        debug.profileend()
    }

    Reliable.OnServerEvent.Connect((player : Player, ...args : unknown[]) => {
        const [ event ] = args as [ NetworkEvent ]

        if(event === NetworkEvent.EntityRequest) {
            
            const entityId = (tonumber(args[1]) as number)
            debug.profilebegin("NetworkBubble.EntityRequest")
            
            if(!entityId) return debug.profileend()
            if(!Entities.has(entityId)) return debug.profileend()

            const entity = Entities.get(entityId) as Entity
            Reliable.FireClient(player, NetworkEvent.EntityCreation, entity.getEntitySignature(), entity.getEntityPointer(), entity.states)
            
            return debug.profileend();
        }

        if(event === NetworkEvent.Container) {
            debug.profilebegin("NetworkBubble.Container")

            Reliable.FireClient(player, NetworkEvent.Container, 0, Containers)
            
            debug.profileend()

            return;
        }

        if(event === NetworkEvent.EntityAction) {
            const entity = Entities.get((tonumber(args[1]) as number))
            // Check if the entity exists
            if(!entity) return

            // Check if the entity is localized to the player
            if(entity && entity.getLocalized() && entity.getLocalized() !== player) return
            if(entity && entity.isLocalized && !entity.getLocalized()) return

            // Check if the entity has the action listener
            const listeners = entity.getActionListeners()
            const action = (tonumber(args[2]) as number)

            // Check if the action exists
            if(!listeners.has(action)) return

            // Remove the entity id and action id from the args
            let argsCopy: defined[] = [...args[3] as defined[]]; // Explicitly type argsCopy as defined[]

            // Call the action listener
            listeners.get(action)!(...argsCopy);
            return
        }

        debug.profilebegin("NetworkBubble.EntityPopulation")

        // Check if the event is not an entity population event
        if(event !== NetworkEvent.EntityPopulation) return

        // Filter all entities that are not localized to the player.
        const filteredEntities : Entity[] = []

        // Iterate through all entities and filter out the ones that are not localized to the player
        Entities.forEach(entity => {
            if(entity.getLocalized() && entity.getLocalized() !== player) return
            if(entity && entity.isLocalized && !entity.getLocalized()) return
            if(entity && entity.isServerOnly) return

            filteredEntities.push(entity)
        })

        Reliable.FireClient(player, NetworkEvent.EntityPopulation, filteredEntities)
        
        debug.profileend()

        // Throttle for a second & send the player the entities again
        //task.delay(1, () => Reliable.FireClient(player, NetworkEvent.EntityPopulation, filteredEntities))
    })
}