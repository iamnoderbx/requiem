import { BasePlayerEntity } from "../BasePlayerEntity";
import { PlayerActions, StableActions } from "shared/utilities/network/Events";
import { StoreComponentItem, StorePublicComponent } from "server/components/Store/StorePublicComponent";
import { Animals } from "shared/Animals";
import { Names } from "shared/utilities/names.utilities";
import { String } from "shared/utilities/string.utilities";
import { BaseHorseEntity } from "server/entities/animals/BaseHorseEntity";
import Object from "@rbxts/object-utils";
import PlayerHorseService from "./PlayerHorseService";
import { GLOBAL_INFLATION_RATE, HORSE_INFLATION_RATE } from "server/services/EconomyServiceRunner";
import { DailyStoreUtilities } from "./stores/DailyStoreUtilities";

export enum HorseRarity {
    Excellent, Great, Good, Fair, Poor
}

// The chances of a horse being a certain rarity.
export const HORSE_RARITIES = {
    [HorseRarity.Excellent]: 7,         // 7% chance
    [HorseRarity.Great]: 10,            // 10% chance
    [HorseRarity.Good]: 20,             // 20% chance
    [HorseRarity.Fair]: 35,             // 40% chance
    [HorseRarity.Poor]: 28,             // 28% chance
} as const

// The minimum values a given rarity can have.
export const RARITY_OFFSETS = {
    [HorseRarity.Excellent]: 75,        // Adds 75 to the random number
    [HorseRarity.Great]: 60,            // Adds 60 to the random number
    [HorseRarity.Good]: 40,             // Adds 40 to the random number
    [HorseRarity.Fair]: 35,             // Adds 35 to the random number
    [HorseRarity.Poor]: 10,             // Adds 10 to the random number
}

export const RARITY_WEIGHTS = {
    [HorseRarity.Excellent]: 1,         // Remainder weight bias of 1.5
    [HorseRarity.Great]: 0.9,           // Remainder weight bias of 1.2
    [HorseRarity.Good]: 0.8,            // Remainder weight bias of 1.0
    [HorseRarity.Fair]: 0.7,            // Remainder weight bias of 0.8
    [HorseRarity.Poor]: 0.5,            // Remainder weight bias of 0.5
}

export const PRICE_OFFSETS = {
    [HorseRarity.Excellent]: 5000,      // Adds 500 to the price
    [HorseRarity.Great]: 4000,          // Adds 400 to the price
    [HorseRarity.Good]: 3000,           // Adds 300 to the price
    [HorseRarity.Fair]: 1500,           // Adds 200 to the price
    [HorseRarity.Poor]: 500,            // Adds 100 to the price
}

export default class PlayerStableService {
    constructor(private player: BasePlayerEntity) { }

    /**
     * Calculates a rarity for a horse based on a random number generator.
     * 
     * @param random The random number generator from a seed.
     * @returns { HorseRarity }
     * 
     * @author NodeSupport
     */
    private getRandomHorseRarity(random: Random) : HorseRarity {
        // Get a random value
        const randomValue = random.NextInteger(0, 100);
        
        // Initialize the remainder and rarity
        let remainder = randomValue;
        let rarity = HorseRarity.Poor;

        // Iterate through the rarities
        for (const [key, value] of pairs(HORSE_RARITIES)) {
            if (remainder <= value) {   // If the remainder is less than the value
                rarity = key;           // Set the rarity
                break;
            } else {
                remainder -= value;     // Subtract the value from the remainder
            }
        }

        // Return the rarity
        return rarity;
    }

    /**
     * Returns a horse generated from the two parent horses.
     * 
     * @param horseA The first parent horse to breed.
     * @param horseB The second parent horse to breed.
     * @returns { Record<Animals.Statistics, number> }
     * 
     * @author NodeSupport
     */
    private createHorseChildStatistics(horseA: Animals.Horse, horseB: Animals.Horse): Record<Animals.Statistics, number> {
        // Create a random statistic for the horse
        const createStatisticRandom = (a: number, b: number) : number => {
            // Get the min and max values
            const min = math.min(a, b);
            const max = math.max(a, b);

            // Create the result
            const result = (min + (max + (max / 4))) / 2.05;
            const rng = math.random(80, 110) / 100;
            
            // Return the result
            return math.clamp(math.floor(result * rng), 0, 100);
        }

        // Create the result object
        let result : {[key: number]: number} = {};
        
        // Create the statistics for the horse fill the result object
        for (let stat of Object.keys(Animals.Statistics)) {
            result[Animals.Statistics[stat]] = createStatisticRandom(
                horseA.statistics[Animals.Statistics[stat]], 
                horseB.statistics[Animals.Statistics[stat]]
            );
        }

        // Return the result object
        return result as {[key in Animals.Statistics]: number}
    }

    /**
     * Creates a horse from a random number generator.
     * 
     * @param random The seed random of the store
     * @returns { StoreComponentItem } The horse item created
     * 
     * @author NodeSupport
     */
    private createHorseFromRandom(random: Random): StoreComponentItem {
        // Get a random gender.
        const genderRandom = random.NextInteger(1, 2);
        const gender = genderRandom === 1 ? Animals.Gender.Female : Animals.Gender.Male;

        // Get the list of names associated with the gender.
        const nameList = genderRandom === 1 ? Names.Female : Names.Male;
        
        // Format the name to a proper format.
        let name = nameList[random.NextInteger(1, nameList.size() - 1)]
        name = String.CapitalizeFirstLetter(string.lower(name))

        // Get the rarity of the horse.
        const rarity = this.getRandomHorseRarity(random);
        let price = (PRICE_OFFSETS[rarity] * (1 + GLOBAL_INFLATION_RATE)) * (1 + HORSE_INFLATION_RATE);

        // Get the offsets and weight of the horse.
        const weight = RARITY_WEIGHTS[rarity];
        const offset = RARITY_OFFSETS[rarity];

        // Get the statistics of the horse.
        const speed = (random.NextInteger(1, (100 - offset)) * weight) + offset;
        const turnspeed = (random.NextInteger(1, (100 - offset)) * weight) + offset;
        const jump = (random.NextInteger(1, (100 - offset)) * weight) + offset;
        const stamina = (random.NextInteger(1, (100 - offset)) * weight) + offset;
        const health = (random.NextInteger(1, (100 - offset)) * weight) + offset;

        // Calculate the price of the horse.
        price += (speed + turnspeed + jump + stamina + health) * 10;

        // Get a random id for the horse.
        const id: number = random.NextInteger(100000, 999999);

        // Create the horse object.
        const horse = {
            name, price, available: true,   // The horse name, price, and availability
            meta: [id, gender, [            // The horse meta data
                math.floor(speed),          // The horse speed statistic
                math.floor(turnspeed),      // The horse turn speed statistic
                math.floor(jump),           // The horse jump statistic
                math.floor(stamina),        // The horse stamina statistic
                math.floor(health)]         // The horse health statistic
            ],
        }

        // Return the horse
        return horse
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
    private createStoreFromSeed(seed: number, key: number) : StoreComponentItem[] {
        // Create a random number generator
        const rng = new Random(seed + key + DailyStoreUtilities.StoreGlobalOffset);
        const count = rng.NextInteger(2, 10);

        // Create the store
        const store: StoreComponentItem[] = [];

        // Create the horses
        for (let i = 0; i < count; i++) {
            store.push(this.createHorseFromRandom(rng));
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
    public request(seed: number) {
        // Get the key from the seed
        const key = DailyStoreUtilities.getStoreKeyFromSeed(seed);

        // Request the stablemen inventory
        const [ results ] = DailyStoreUtilities.StoreDatastoreService.GetAsync("stablemen_" + key)
        const data = (results ? results : this.createStoreFromSeed(seed, key)) as StoreComponentItem[]

        // Check if the store already exists
        const doesStoreWithIdExist = DailyStoreUtilities.stores.get().find((store) => store.get().id === seed)
        if (!doesStoreWithIdExist) this.player.info("Requesting and loading daily stablemen inventory...")

        // Create the store
        if (!doesStoreWithIdExist) {
            const store = new StorePublicComponent.Component({ id: seed, items: data })
            DailyStoreUtilities.stores.add(store)
        } else doesStoreWithIdExist?.rewrite({ id: seed, items: data })

        // Set the store in the datastore
        DailyStoreUtilities.StoreDatastoreService.SetAsync("stablemen_" + key, data)
    }

    /**
     * Purchase a horse from the store, with the given seed and horse id.
     * TODO: Add a check to see if the player has enough money to purchase the horse.
     * 
     * @param seed The seed of the store
     * @param id The horse id to purchase
     * 
     * @returns success | void
     * 
     * @author NodeSupport
     */
    public purchase(seed: number, id: number) {
        const key = DailyStoreUtilities.getStoreKeyFromSeed(seed);
        const [ results ] = DailyStoreUtilities.StoreDatastoreService.GetAsync("stablemen_" + key)

        if (!results) return this.player.error("The stablemen inventory is not available at this time.")

        // Get the store and the horse
        const store = results as StoreComponentItem[]
        const horse = store.find((item) => item.meta[0] === id)

        // Get the memory store
        const memory = DailyStoreUtilities.MemoryStoreHashmap.GetAsync("stablemen_" + tostring(seed) + "_" + tostring(id) + "_" + tostring(key));

        // Check if the horse is already sold
        if (memory) return this.player.error("The horse you are trying to purchase is already sold.")
        if (!horse) return this.player.error("The horse you are trying to purchase is not for sale.")

        // Set the memory store
        DailyStoreUtilities.MemoryStoreHashmap.SetAsync("stablemen_" + tostring(seed) + "_" + tostring(id) + "_" + tostring(key), true, 30);

        // Purchase the horse
        const price = horse.price;
        horse.available = false;

        // Remove the horse from the store
        store.remove(store.indexOf(horse))

        const [success] = pcall(() => DailyStoreUtilities.StoreDatastoreService.SetAsync("stablemen_" + key, store))
        if (!success) return this.player.error("Failed to purchase the horse, an error occured.")

        // Update the story component
        const doesStoreWithIdExist = DailyStoreUtilities.stores.get().find((store) => store.get().id === seed)
        if (!doesStoreWithIdExist) return this.player.error("The store does not exist.")

        // Rewrite the store
        doesStoreWithIdExist?.rewrite({ id: seed, items: store })

        // Add the horse to the player's horse list
        const horses = this.player.getHorseService();
        const horseStatistics = horse.meta[2] as [number, number, number, number, number]

        // Add the horse to the player's horse list
        horses.add(horse.name, horses.getRandomHorseColor(), horse.meta[1] as Animals.Gender, {
            [Animals.Statistics.RunSpeed]: horseStatistics[0],
            [Animals.Statistics.TurnSpeed]: horseStatistics[1],
            [Animals.Statistics.JumpPower]: horseStatistics[2],
            [Animals.Statistics.Stamina]: horseStatistics[3],
            [Animals.Statistics.Health]: horseStatistics[4],
        }, true)

        // Send a success message to the player
        this.player.success("You have successfully purchased the horse \"" + horse.name + "\" for $" + price + ".")
    }

    /**
     * Breeds two horses together to create a child horse, with the given parents.
     * Will verify the parents are old enough to breed and cooldowns, and will create a child horse.
     * 
     * @param maleId The male's horse identifier
     * @param femaleId The female's horse identifer
     * 
     * @returns success | void
     * 
     * @author NodeSupport
     */
    public breed(maleId?: number, femaleId?: number) {
        if (!maleId) return this.player.error("You must provide a male horse in order to breed.")
        if (!femaleId) return this.player.error("You must provide a female horse in order to breed.")

        // Get the horses
        const male = BaseHorseEntity.Horses.get(maleId);
        const female = BaseHorseEntity.Horses.get(femaleId);

        // Check if the horses exist
        if (!male || !female) return this.player.error("The horses you are trying to breed do not exist.")
            
        // Get the horse data
        const maleData = male.getHorseData()
        const femaleData = female.getHorseData()

        // 12 hours is the minimum time for a horse to grow up.
        const isFemaleAdult = Animals.isHorseAdult(femaleData);
        const isMaleAdult = Animals.isHorseAdult(maleData);

        // Check if the horses are old enough to breed
        if(!isFemaleAdult) return this.player.error("The female horse \"" + femaleData.name + "\" is not old enough to breed!")
        if(!isMaleAdult) return this.player.error("The male horse \"" + maleData.name + "\" is not old enough to breed!")

        // Create the child horse statistics
        const childStatistics = this.createHorseChildStatistics(maleData, femaleData)
        if(!childStatistics) return this.player.error("Failed to create the child horse.")

        // Get the color of the two horses
        const maleColor = new Color3(maleData.color.r, maleData.color.g, maleData.color.b);
        const femaleColor = new Color3(femaleData.color.r, femaleData.color.g, femaleData.color.b);

        // Get the average color of the two horses
        const color = maleColor.Lerp(femaleColor, 0.5);

        // Get a random gender
        const gender =  math.random(1, 2) === 1 ? Animals.Gender.Female : Animals.Gender.Male;
        const nameList = gender === 1 ? Names.Female : Names.Male;
        
        // Get a random name from the list
        let name = nameList[math.random(1, nameList.size() - 1)]
        name = String.CapitalizeFirstLetter(string.lower(name))

        // Add the horse to the player's horse list.
        this.player.getHorseService().add(name, color, gender, childStatistics)
        this.player.success("You have successfuly bred two horses! Say hello to \"" + name + "\"!")

        // Check if the player owns the female & male horse.
        const doesPlayerOwnFemale = femaleData.ownership === this.player.getUserId();
        const doesPlayerOwnMale = maleData.ownership === this.player.getUserId();

        // Find the player who owns the horse
        const findPlayerWhoOwns = (id: number) : BasePlayerEntity | undefined => {
            const cached = PlayerHorseService.cache.get(id);
            if(cached) return cached;
        }

        // Update the server-sided breeding cooldown
        PlayerHorseService.updateBreedingCooldown(femaleId);
        PlayerHorseService.updateBreedingCooldown(maleId);

        // Update the player's breeding cooldown
        if(doesPlayerOwnFemale) this.player.getHorseService().setBreedingCooldown(femaleId);
        else findPlayerWhoOwns(femaleData.ownership)?.getHorseService().setBreedingCooldown(femaleId);

        // Update the player's breeding cooldown
        if(doesPlayerOwnMale) this.player.getHorseService().setBreedingCooldown(maleId);
        else findPlayerWhoOwns(maleData.ownership)?.getHorseService().setBreedingCooldown(maleId);
    }

    /**
     * This function initializes the stable service for the player.
     * 
     * @param component The horse list component
     * 
     * @author NodeSupport
     */
    public initialize() {
        this.player.getNetwork().listen(PlayerActions.Stable, (...args: unknown[]) => {
            // Get the action
            const [action] = args as [StableActions]

            // Switch the action
            switch (action) {
                case StableActions.REQUEST: return this.request(args[1] as number)
                case StableActions.PURCHASE: return this.purchase(args[1] as number, args[2] as number)
                case StableActions.BREED: return this.breed(args[1] as number, args[2] as number)
            }
        })
    };
}