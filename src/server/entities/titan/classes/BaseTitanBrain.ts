import Object from "@rbxts/object-utils";
import { RunService } from "@rbxts/services";
import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

export namespace BaseTitanBrain {
    export type Brain = {
        rate : number, // The rate at which the brain processes
        processed: number, // The last time the brain was processed

        highest_priority : number // The highest heat map priority
        priority : number // The current priorities index
        priorities : Map<BasePlayerEntity, number>;
        
        connections : Array<() => void>,
        connectables : Map<string, Array<() => void>>,
    };

    let processor : RBXScriptConnection | undefined;
    const brains : Record<number, Brain> = {};
    
    function process() {
        for(const id of Object.keys(brains)) {
            const brain = brains[id];
            const since = tick() - brain.processed;
            if(since < brain.rate) continue;

            brain.processed = tick();
            for(const connection of brain.connections) connection();
        }

        if(Object.keys(brains).size() === 0) {
            processor!.Disconnect()
            processor = undefined;
        }
    }

    export function throttle(id : number, rate : number) {
        if(!brains[id]) throw "Brain does not exist!";
        brains[id].rate = rate;
    }
    
    export function connect(id : number, connection : () => void) {
        if(!brains[id]) throw "Brain does not exist!";
        brains[id].connections.push(connection);

        if(!processor) processor = RunService.Heartbeat.Connect(process);
    }

    export function get(id : number) {
        return brains[id];
    }

    export function invoke(id : number, str : string) {
        if(!brains[id]) throw "Brain does not exist!";
        
        if(!brains[id].connectables.has(str)) return;
        for(const connection of brains[id].connectables.get(str)!) connection();
    }

    export function connection(id : number, str : string, connection : () => void) {
        if(!brains[id]) throw "Brain does not exist!";
        
        if(!brains[id].connectables.has(str)) brains[id].connectables.set(str, []);
        brains[id].connectables.get(str)!.push(connection);
    }

    export function create(id : number) {
        if(brains[id]) throw "Brain already exists!";
        
        brains[id] = {
            rate: 0.5, priorities: new Map(),
            connections: [], processed: 0, priority: 0, highest_priority: -1,
            connectables: new Map(),
        };
    }    
}