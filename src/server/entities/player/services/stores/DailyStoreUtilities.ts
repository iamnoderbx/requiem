import { DataStoreService, MemoryStoreService, Workspace } from "@rbxts/services";
import { StorePublicComponent } from "server/components/Store/StorePublicComponent";
import { NetworkBubble } from "server/network/NetworkBubble";

export namespace DailyStoreUtilities {
	// Create a datastore service for the stores
	export const StoreDatastoreService = DataStoreService.GetDataStore("stores");
	export const MemoryStoreHashmap = MemoryStoreService.GetHashMap("stores");

	export const StoreGlobalOffset = 236235;

	export const stores = new NetworkBubble.Container<StorePublicComponent.Component>()
		.setReplicationType(NetworkBubble.ReplicationType.PUBLIC)
		.setReplicationIdentifier("stores")

	/**
     * Creates a store key from the seed. Dynamically generated from the seed.
     * Will be different every day.
     * 
     * @param seed The seed of the store
     * @returns number
     * 
     * @author NodeSupport
     */
    export function getStoreKeyFromSeed(seed: number) {
        // Get the date, month, and year
        const date = tonumber(os.date("%j", Workspace.GetServerTimeNow()))!;
        const month = tonumber(os.date("%m", Workspace.GetServerTimeNow()))!;
        const year = tonumber(os.date("%Y", Workspace.GetServerTimeNow()))!;

        // Get the offset and return the key
        const offset = seed + date + month + year + StoreGlobalOffset;
        return math.floor(offset);
    }
}