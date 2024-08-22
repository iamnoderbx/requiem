import Object from "@rbxts/object-utils";

export namespace Memory {
    const subscriptions : Map<symbol, Subscription<unknown>> = new Map();
    const subscriptionCallbacks : Map<symbol, ((value : unknown) => void)[]> = new Map();

    const subscriptionListerners : Map<Subscription<unknown>, ((value : unknown) => void)[]> = new Map();
    const storages : Map<symbol, unknown> = new Map();

    export class Memory<T extends Record<string, unknown>> {
        private data: { [K in keyof T]?: Subscription<T[K]> } = {};

        constructor(private initialData: T) {
            // Initialize subscriptions for each key in initialData
            for(const key of Object.keys(initialData)) {
                this.data[key as keyof T] = new Subscription<T[keyof T]>({} as symbol, initialData[key as keyof T]);
            }
        }

        public initial() : T {
            return this.initialData
        }

        public get<K extends keyof T>(key: K) : T[K] {
            return ((this.data[key] as Subscription<T[K]>).get()) as T[K];
        }

        public subscription(key: keyof T) : Subscription<T[keyof T]> {
            return (this.data[key] as Subscription<T[keyof T]>);
        }

        public set<K extends keyof T>(key: K, value: T[K]) {
            if (!this.data[key]) {
                this.data[key] = new Subscription<T[K]>({} as symbol, value);
            } else {
                this.data[key]!.set(value);
            }
        }
    }

    export function post() {

    }

    export function createHashmap() {
        const symbol = {} as symbol;
        storages.set(symbol, new Map());

        return symbol;
    }
    
    export function store(symbol : symbol, key : unknown, value : unknown) {
        const storage = storages.get(symbol) as Map<unknown, unknown>;
        storage.set(key, value);
    }

    export function retrieve<T>(symbol : symbol, key : unknown) {
        const storage = storages.get(symbol) as Map<unknown, unknown>;
        return storage.get(key) as T;
    }

    export function retrieveAll(symbol : symbol) {
        return storages.get(symbol) as Map<unknown, unknown>;
    }

    export class Subscription<T> {
        private value: T | undefined;

        constructor(private symbol: symbol, initialValue?: T) {
            this.value = initialValue;
        }

        set(value: T) {
            this.value = value;

            const callbacks = subscriptionCallbacks.get(this.symbol);
            const listeners = subscriptionListerners.get(this);

            if (listeners) {
                listeners.forEach((callback) => {
                    callback(value);
                });
            }

            if (callbacks) {
                callbacks.forEach((callback) => {
                    callback(value);
                });
            }
        }

        getSymbol() {
            return this.symbol;
        }

        get() {
            return this.value;
        }
    }

    export function changed<T>(subscription : Memory.Subscription<T>, callback : (value : T) => void) {
        const listeners = subscriptionListerners.get(subscription) || [];
        listeners.push(callback as (value : unknown) => void);
        subscriptionListerners.set(subscription, listeners);

        return () => {
            const listeners = subscriptionListerners.get(subscription);

            if (listeners) {
                const index = listeners.indexOf(callback as (value : unknown) => void);

                if (index !== -1) {
                    listeners.remove(index);
                }
            }
        };
    }

    export function subscribe<T>(symbol : symbol, callback : (value : T) => void) {

        const callbacks = subscriptionCallbacks.get(symbol) || [];
        callbacks.push(callback as (value : unknown) => void);

        subscriptionCallbacks.set(symbol, callbacks);

        return () => {
            const callbacks = subscriptionCallbacks.get(symbol);

            if (callbacks) {
                const index = callbacks.indexOf(callback as (value : unknown) => void);

                if (index !== -1) {
                    callbacks.remove(index);
                }
            }
        };
    }

    export function subscription<T>(symbol : symbol, initial?: T) {
        const sub = new Subscription<T>(symbol, initial);
        subscriptions.set(symbol, sub);
        
        return sub;
    }

    export function createEmptySubscription<T>(symbol : symbol | string) {
        if(subscriptions.has(symbol as symbol)) {
            return subscriptions.get(symbol as symbol) as Subscription<T>;
        }
        
        return subscription<T>(symbol as symbol);
    }

    export function getSubscription<T>(symbol : symbol | string) {
        return subscriptions.get(symbol as symbol) as Subscription<T>;
    }

    export function create<T extends Record<string, unknown>>(data : T) {
        return new Memory<T>(data);
    }
}