import { Memory } from "shared/utilities/memory.utilities";
import useInterfaceStore from "./InterfaceStore";
import RoactHooked from "./vendors/RoactHooked";
//import RoactHooked from "./vendors/RoactHooked";

const refEquality = (a: unknown, b: unknown) => a === b;

export function useStateSelector<T, State extends Memory.Subscription<T>, Selected = T>(
    subscription : State,
	selector: (state: State) => Selected,
    ignoreDirectComparison: boolean = false,
	isEqual?: (selectedState: Selected | undefined, oldSelectedState: Selected | undefined) => boolean,
): Selected {
    if(isEqual === undefined) isEqual = refEquality;

    const [ _, forceRender ] = RoactHooked.useReducer((n : number) => {
        return n + 1;
    }, 0)

    const latestSelector = RoactHooked.useMutable<typeof selector>();

    const latestSelectedState = RoactHooked.useMutable<Selected>();
    const latestSelectedResult = RoactHooked.useMutable<T>();

    const result = selector(subscription);

    RoactHooked.useEffect(() => {
        latestSelector.current = selector;
        latestSelectedState.current = result;
    })

    RoactHooked.useEffect(() => {
        const checkForUpdates = (newStoreState : T) => {
            if(newStoreState === latestSelectedResult.current ) return false;

            const newSelectedState = latestSelector.current!(subscription);

            if (isEqual!(newSelectedState, latestSelectedState.current)) {
                return false
            }
            
            latestSelectedState.current = newSelectedState;
            return true
        }

        const shouldRerenderComponent = (newState : T) => {
            const updated = checkForUpdates(newState);
            if(updated) {
                task.spawn(forceRender)
            }
        }
        
        const subscript = Memory.changed(subscription, (newState) => {
            shouldRerenderComponent(newState);
        })

        let subscribe2 : (() => void) | undefined;

        if(ignoreDirectComparison) {
            subscribe2 = Memory.subscribe(subscription.getSymbol(), shouldRerenderComponent);
        }

        return (() => {
            subscript();
            subscribe2?.();
        })
    })
    
    return result
};