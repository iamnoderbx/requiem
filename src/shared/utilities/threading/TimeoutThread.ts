import { setTimeout } from "@rbxts/set-timeout";

export namespace TimeoutThread {
    const threads = new Map<number, Map<string, Promise<boolean>>>();
    
    export const create = (key : number, index : string, lifetime : number) => {
        if (!threads.has(key)) {
            threads.set(key, new Map<string, Promise<boolean>>());
        }

        const thread = threads.get(key)!;
        const exists = thread.get(index);

        if(exists) exists.cancel();
        if(exists) thread.delete(index);
        
        const promise = new Promise<boolean>((resolve) => {
            const id = setTimeout(() => {
                if(thread.get(index) !== promise) return;

                thread.delete(index);
                resolve(true);
            }, lifetime);
            
            return () => {
                id();
            }
        });

        thread.set(index, promise);

        return promise;
    }

    export const cancel = (key : number, index : string) => {
        if (!threads.has(key)) return;

        const thread = threads.get(key)!;
        const exists = thread.get(index);

        if(exists) exists.cancel();
        if(exists) thread.delete(index);
    }
}