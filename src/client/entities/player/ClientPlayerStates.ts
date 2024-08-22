import Object from "@rbxts/object-utils";
import { Memory } from "shared/utilities/memory.utilities";

export const ClientStoreSubscription : unique symbol = {} as never
export const CURRENT_STORE_META = {id: 0}

export const StoreInventorySubscription = Memory.createEmptySubscription("stores");
export const StoreSubscription = Memory.subscription<number>(ClientStoreSubscription)

// Set the store subscription to 0
StoreSubscription.set(0)

export enum ClientStoreTypes { NONE = 0, STABLE = 1, LAND_PROPRIETOR = 2, DRAFTSMAN = 3, }

export namespace States {
    // Create a memory object with a blocking state
    export const States = Memory.create({
        // Combat States
        blocking : false,
        swinging : false,
        lunging : false,

        // Gear States
        holstering : false,
        holstered : false,
        wallrunning : false,
        dashing : false,

        // Horse States
        summoning : false,
        riding: false,

        // Miscellaneous States
        shopping: false,

        // Building States
        building: false,

        // Hide Interface Stages
        hide_leaderboard: false,
        hide_chat: false,
        hide_compass: false,
    })

    // Create a list of categories
    export enum Types { BUSY, COMBAT, GEAR, MOUNTS, MISCELLANEOUS }

    // Create a map of categories to subscriptions
    const categories = new Map<Types, Memory.Subscription<boolean>[]>();
    
    // Initialize the BUSY category with an empty list
    categories.set(Types.BUSY, [
        States.subscription("holstering"),
        States.subscription("wallrunning"),
        States.subscription("summoning"),
        States.subscription("riding"),
        States.subscription("shopping"),
        States.subscription("building"),
    ]);

    // Initialize the COMBAT category with the blocking subscription
    categories.set(Types.COMBAT, [
        States.subscription("blocking"),
        States.subscription("swinging"),
        States.subscription("lunging"),
    ]);

    categories.set(Types.GEAR, [
        States.subscription("holstered"),
        States.subscription("wallrunning"),
        States.subscription("dashing"),
    ])

    categories.set(Types.MOUNTS, [
        States.subscription("summoning"),
        States.subscription("riding"),
    ])

    categories.set(Types.MISCELLANEOUS, [
        States.subscription("shopping"),
        States.subscription("building"),
    ])

    export function isCategoryBusy(category: Types) {
        for (const subscription of categories.get(category)!) {
            if (subscription.get() === true) {
                return true;
            }
        }

        return false;
    }

    export function isAnyCategoryBusy() {
        for (const category of Object.keys(categories)) {
            if (isCategoryBusy(category)) {
                return true;
            }
        }

        return false;
    }

    export function isClientBusy() {
        return isCategoryBusy(Types.BUSY);
    }

    export function addStateToCategory(category: Types, subscription: Memory.Subscription<boolean>) {
        const subscriptions = categories.get(category) || [];
        subscriptions.push(subscription);
        categories.set(category, subscriptions);
    }
}

export default States.States;