export abstract class ComponentFunctionalities { abstract test() : void }

export abstract class ComponentInternalFunctions<T> {
    abstract getComponentData() : number
}

export type Constructor<T = {}> = new (...args: any[]) => T;

export default function EntityComponentMixin<TBase extends Constructor>(Base: TBase) : TBase {
    return class extends Base implements ComponentInternalFunctions<TBase> {
        public getComponentData() {
            return 1
        }
    };
}