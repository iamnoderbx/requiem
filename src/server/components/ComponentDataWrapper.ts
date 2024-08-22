import Object from "@rbxts/object-utils"
import { ComponentMiddleware } from "./ComponentMiddleware"
import { NetworkBubble } from "server/network/NetworkBubble"
import ComponentListeners from "./ComponentListeners"

export type ComponentData<T> = {
    get() : T
}

export type Component = {
    readonly Symbol : any, // 
    readonly Component : ComponentWrapper.Data
}

// Create a number range type


export namespace ComponentWrapper {
    // This is a map that stores all the symbols and their data
    const Symbols = new Map<symbol, ComponentWrapper.Data[]>()

    // This is the base class for all components
    export abstract class Data {
        public abstract get() : any
        public abstract rewrite(...args : unknown[]) : void

        public abstract readonly state : NetworkBubble.State
        protected abstract readonly buffer : buffer;

        public middleware : ComponentMiddleware = new ComponentMiddleware()
        public listeners : ComponentListeners = new ComponentListeners()
        
        constructor(private readonly symbol : symbol) {
            // if symbol does not exist in map, create it
            if(!Symbols.has(symbol)) {
                Symbols.set(symbol, [])
            }
            
            // add the symbol to array
            Symbols.get(symbol)!.push(this)
        }

        destroy() {
            
        }

        /** @hidden */
        public getSymbol() {
            return this.symbol
        }
    }

    export type ComponentMap = { [ componentName: symbol ]: ComponentWrapper.Data };
    export type ComponentNameMap = { [ componentName: string ]: ComponentWrapper.Data };
    
    export class Entity {
        private readonly components: ComponentMap = {};
        public orderedComponents : symbol[] = []
        
        constructor(components: ComponentWrapper.Data[]) {
            components.forEach((component, index) => {
                this.components[component.getSymbol()] = component

                this.orderedComponents[index] = component.getSymbol()
            })
        }

        destroy() {
            Object.values(this.components).forEach(component => {
                component.state.destroy()
            })
        }

        addComponent(component : ComponentWrapper.Data, index?: number) {
            this.components[component.getSymbol()] = component

            if(index) this.orderedComponents[index] = component.getSymbol()
            else this.orderedComponents.push(component.getSymbol())
        }

        getComponent<T>(component : T) {
            const symbol = ((component as Component).Symbol) as symbol
            return this.components[symbol] as ComponentWrapper.Data
        }

        public getComponents() {
            return this.components
        }
    }

    export const getComponentsWithSymbol = (symbol : symbol) : ComponentWrapper.Data[] => {
        return Symbols.get(symbol) || []
    }
}
