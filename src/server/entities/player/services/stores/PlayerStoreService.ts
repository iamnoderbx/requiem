import { PlayerActions, StoreActions } from "shared/utilities/network/Events";
import { BasePlayerEntity } from "../../BasePlayerEntity";
import { StoreComponentItem, StorePublicComponent } from "server/components/Store/StorePublicComponent";
import { DailyStoreUtilities } from "./DailyStoreUtilities";
import { Stores } from "shared/Stores";
import { String } from "shared/utilities/string.utilities";

export default class PlayerStoreService {
    private events : Map<Stores.Types, BindableEvent> = new Map()
    
    constructor(private player : BasePlayerEntity) {}

    public onItemPurchased(storeType : Stores.Types) {
        const event = this.events.get(storeType) ?? new Instance("BindableEvent")
        this.events.set(storeType, event)

        return event.Event
    }

    /**
     * Create a store item from a random number generator.
     * 
     * @param rng The random number generator
     * @param storeType The type of store
     * @returns { StoreComponentItem }
     * 
     * @author NodeSupport
     */
	private createItemFromRandom(rng : Random, storeType : Stores.Types) : StoreComponentItem {
		const callback = Stores.GetSellerRandomItem(storeType);
		return callback!(rng) as unknown as StoreComponentItem;
	}

	/**
     * Create a store from the seed and key.
     * The key is dynamically generated from the seed, date, month, year, and a global offset.
     * 
     * The store will change every day.
     * 
     * @param seed The seed of the store
     * @param key The key of the store
     * @returns { StoreComponentItem[] }
     * 
     * @author NodeSupport
     */
    private createStoreFromSeed(seed: number, key: number, storeType : Stores.Types) : StoreComponentItem[] {
        // Create a random number generator
        const rng = new Random(seed + key + DailyStoreUtilities.StoreGlobalOffset);

		const min = Stores.SellerItemRanges[storeType].Min
		const max = Stores.SellerItemRanges[storeType].Max
		
        const count = rng.NextInteger(min, max);

        // Create the store
        const store: StoreComponentItem[] = [];

        // Create the items
        for (let i = 0; i < count; i++) {
			const item = this.createItemFromRandom(rng, storeType);
            store.push(item);
        }

        // Return the store
        return store;
    }
	

	/**
     * Get the store from the seed, and request the store from the datastore.
     * Will rewrite the store if it already exists, and create a new store if it doesn't.
     * 
     * The information of the store is then sent to the global stores component.
     * 
     * @param seed The seed of the store
     * 
     * @author NodeSupport
     */
    public request(seed: number, storeType : Stores.Types) {
		const name = String.CapitalizeAllFirstLetters(string.lower(Stores.Types[storeType]))

        // Get the key from the seed
        const key = DailyStoreUtilities.getStoreKeyFromSeed(seed);

        // Request the store inventory
        const [ results ] = DailyStoreUtilities.StoreDatastoreService.GetAsync(name + "_" + key)
        const data = (results ? results : this.createStoreFromSeed(seed, key, storeType)) as StoreComponentItem[]

        // Check if the store already exists
        const doesStoreWithIdExist = DailyStoreUtilities.stores.get().find((store) => store.get().id === seed)
        if (!doesStoreWithIdExist) this.player.info("Requesting and loading daily " + name + " inventory...")

        // Create the store
        if (!doesStoreWithIdExist) {
            const store = new StorePublicComponent.Component({ id: seed, items: data })
            DailyStoreUtilities.stores.add(store)
        } else doesStoreWithIdExist?.rewrite({ id: seed, items: data })

        // Set the store in the datastore
        DailyStoreUtilities.StoreDatastoreService.SetAsync(name + "_" + key, data)
    }


	/**
     * Purchase a item from the store, with the given seed and item id.
     * TODO: Add a check to see if the player has enough money to purchase the item.
     * 
     * @param seed The seed of the store
     * @param id The item id to purchase
     * 
     * @returns success | void
     * 
     * @author NodeSupport
     */
    public purchase(seed: number, id: number, storeType : Stores.Types) {
		const name = String.CapitalizeAllFirstLetters(string.lower(Stores.Types[storeType]))

        const key = DailyStoreUtilities.getStoreKeyFromSeed(seed);
        const [ results ] = DailyStoreUtilities.StoreDatastoreService.GetAsync(name + "_" + key)

        if (!results) return this.player.error("The " + string.lower(name) + " inventory is not available at this time.")

        // Get the store and the item
        const store = results as StoreComponentItem[]
        const item = store.find((item) => item.meta[0] === id)

        // Get the memory store
        const memory = DailyStoreUtilities.MemoryStoreHashmap.GetAsync(name + "_" + tostring(seed) + "_" + tostring(id) + "_" + tostring(key));

        // Check if the item is already sold
        if (memory) return this.player.error("The " + Stores.SellerTypes[storeType] + " you are trying to purchase is already sold.")
        if (!item) return this.player.error("The " + Stores.SellerTypes[storeType] + " you are trying to purchase is not for sale.")

        // Set the memory store
        DailyStoreUtilities.MemoryStoreHashmap.SetAsync(name + "_" + tostring(seed) + "_" + tostring(id) + "_" + tostring(key), true, 30);

        // Purchase the item
        const price = item.price;
        item.available = false;

        // Remove the item from the store
        store.remove(store.indexOf(item))

        const [success] = pcall(() => DailyStoreUtilities.StoreDatastoreService.SetAsync(name + "_" + key, store))
        if (!success) return this.player.error("Failed to purchase the " + Stores.SellerTypes[storeType] + ", an error occured.")

        // Update the story component
        const doesStoreWithIdExist = DailyStoreUtilities.stores.get().find((store) => store.get().id === seed)
        if (!doesStoreWithIdExist) return this.player.error("The store does not exist.")

        // Rewrite the store
        doesStoreWithIdExist?.rewrite({ id: seed, items: store })

        // Send a success message to the player
        this.player.success("You have successfully purchased the " + Stores.SellerTypes[storeType] + " \"" + item.name + "\" for $" + price + ".")
        
        // Fire the event
        this.events.get(storeType)?.Fire(item);
    }

	initialize() {
		this.player.getNetwork().listen(PlayerActions.Stores, (...args: unknown[]) => {
            // Get the action
            const [action] = args as [ StoreActions ]

            // Switch the action
            switch (action) {
                case StoreActions.REQUEST: return this.request(args[1] as number, args[2] as Stores.Types)
                case StoreActions.PURCHASE: return this.purchase(args[1] as number, args[2] as number, args[3] as Stores.Types)
            }
        })
	}
}