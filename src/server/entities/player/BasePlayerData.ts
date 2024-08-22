import ProfileService from "@rbxts/profileservice"
import { Profile } from "@rbxts/profileservice/globals"
import { Players, RunService } from "@rbxts/services"
import { Keybinds } from "shared/Keybindings"
import { Data, Weaponary } from "shared/types/Data"
import { Locations } from "shared/types/Locations"

// A helper function to generate the base player data
export const GenerateBasePlayerData = () : Data.User => {
    return {
        gear: {
            type: Weaponary.Gear,
            variant: { forged: tick(), variant: Data.GearVariations.Default }
        },
        
        bloodline: 3,
        horses: [],

        keybinds: Keybinds.Serialize(Keybinds.Default),
        origin: Locations.SHIGANSHINA,
        
        blueprints: [],
    }
}

const IsDevelopmentEnvironment = RunService.IsStudio()

// The key for the user profiling
const UserProfilingKey = IsDevelopmentEnvironment ? 'Dev_37' : `Data_37`

// The user profiling store used for player data
export const UserProfiling = ProfileService.GetProfileStore(
    UserProfilingKey, GenerateBasePlayerData()
)

export class BasePlayerData {
    private profile : Profile<Data.User> | undefined
    private ignited : boolean = false

    public promise : Promise<BasePlayerData> | undefined

    /**
     * Constructor for the BasePlayerData class.
     * 
     * @param {number} userId - The user id of the player.
     * 
     * @author NodeSupport
     */
    constructor(private userId : number) {}

    /**
     * This function ignites the player data.
     * 
     * It loads the player profile, adds the user id to the profile, fills in the missing data,
     * gets the player instance, listens to the profile release, and sets the ignited flag.
     * 
     * @returns {Promise<BasePlayerData>} A promise that resolves with the ignited player data, or rejects if the player profile fails to load or the player instance is not found.
     * 
     * @throws Will throw an error if the player profile fails to load or the player instance is not found.
     * 
     * @author NodeSupport
     */
    public ignite() : Promise<BasePlayerData> {
        this.promise = new Promise((resolve, reject) => {
            // Load the player profile
            this.profile = UserProfiling.LoadProfileAsync(tostring(this.userId))
            if(!this.profile) return reject("Failed to load data")

            // Add the user id to the profile & fill in the missing data
            this.profile.AddUserId(this.userId);
            this.profile.Reconcile()

            // Get the player instance
            const user = Players.GetPlayerByUserId(this.userId)

            // Listen to the profile release
            this.profile.ListenToRelease(() => {
                // Get the player instance from the id
                user && user.Kick("Error occured within your data, please rejoin.")
            })

            // If the player instance is not found, release the profile
            if(!user || !user.IsDescendantOf(Players)) {
                this.profile.Release()
                return reject("Player instance not found")
            }

            // Set the ignited flag
            this.ignited = true

            // Ignite the player data
            resolve(this)
        })

        return this.promise
    }

    /**
     * This function checks if the player data is ignited.
     * 
     * @returns {boolean} Returns true if the player data is ignited, false otherwise.
     * 
     * @author NodeSupport
     */
    public isIgnited() : boolean {
        return this.ignited
    }

    /**
     * This function gets the user data.
     * 
     * @returns {Data.User | undefined} Returns the user data if the player data is ignited, undefined otherwise.
     * 
     * @throws Will throw an error if the player data is not ignited.
     * 
     * @author NodeSupport
     */
    public getData() : Data.User | undefined {
        if(!this.ignited) throw "Player data not ignited"
        return this.profile?.Data;
    }

    /**
     * This function gets the profile data.
     * 
     * @returns {Profile<Data.User> | undefined} Returns the profile data if the player data is ignited, undefined otherwise.
     * 
     * @throws Will throw an error if the player data is not ignited.
     * 
     * @author NodeSupport
     */
    public getProfile() : Profile<Data.User> | undefined {
        if(!this.ignited) throw "Player data not ignited"
        return this.profile
    }
}