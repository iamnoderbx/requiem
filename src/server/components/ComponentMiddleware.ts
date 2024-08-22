import { NetworkBubble } from "server/network/NetworkBubble";
import { ComponentWrapper } from "./ComponentDataWrapper";

export class ComponentMiddleware {
    private middleware : ((...args : any[]) => void)[] = []

    public apply<T>(middleware : (...args : T[]) => void) : void {
        this.middleware.push(middleware)
    }
    
    /** @hidden */
    execute(...args : unknown[]) {
        if(this.middleware.size() === 0) return
        for(const middleware of this.middleware) {
            middleware(...args)
        }
    }
}

export function AttachMiddlewareListener() {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value as (...args: any[]) => any;

        descriptor.value = function (...args: unknown[]) {
            const _self = args[0] as ComponentWrapper.Data

            const createArrayCloneOfBuffer = (state : NetworkBubble.State) => {
                return state.getProperties().map(property => {
                    const newBuffer = buffer.create(buffer.len(property.buffer))
                    buffer.copy(newBuffer, 0, property.buffer, 0, buffer.len(property.buffer))

                    return newBuffer
                })
            }
            
            const former = createArrayCloneOfBuffer(_self.state)

            const results = originalMethod(...args)
            const pointer = _self.state.getEntityPointer()

            _self.middleware.execute(_self.get())
            if(pointer === undefined) return results

            const _entity = NetworkBubble.Entities.get(pointer)
            if(!_entity) return results

            const current = createArrayCloneOfBuffer(_self.state)
            const changes = current.map((_buffer, index) => {
                if(buffer.tostring(_buffer) === buffer.tostring(former[index])) return undefined

                return { 
                    id: _self.state.getEntityPointer()!,
                    buffer: _buffer, 
                    pointer: _self.state.getStatePointer(),
                }
            })
            
            NetworkBubble.merge(_entity, former, current, changes)

            return results;
        };

        return descriptor;
    };
}