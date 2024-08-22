import { EntityHorseComponent } from "server/components/Entity/EntityHorseComponent";
import { BasePlayerEntity } from "../BasePlayerEntity";
import { HorseActions, PlayerActions } from "shared/utilities/network/Events";
import { BaseHorseEntity } from "server/entities/animals/BaseHorseEntity";
import { Animals } from "shared/Animals";
import { Workspace } from "@rbxts/services";

export default class PlayerHorseService {
    public static cache : Map<number, BasePlayerEntity> = new Map();
    private static breedingCooldownCache : Map<number, number> = new Map();

    private horses!: EntityHorseComponent.Component;
    private summoned : Map<number, BaseHorseEntity> = new Map();

    constructor(private player : BasePlayerEntity) {}

    /**
     * Gets a random horse color.
     * 
     * @returns A random horse color
     * 
     * @author NodeSupport
     */
    public getRandomHorseColor() {
        const colors = [Animals.Color.Black, Animals.Color.Brown, Animals.Color.White, Animals.Color.Grey]
        const index = math.random(1, colors.size())
        return colors[index - 1]
    }

    /**
     * Adds a horse to the player's horse list, with the given name, color
     * and other attributes.
     * 
     * @param name The name of the horse
     * @param color The color of the horse
     * @param gender The gender of the horse
     * @param stats The horse statistics
     * @param isRngAdult Whether the horse is an adult
     * 
     * @throws Will throw an error if the player data is not found
     * 
     * @author NodeSupport
     */
    public add(name : string, color: Animals.Color | Color3, gender : Animals.Gender, stats : Record<Animals.Statistics, number>, isRngAdult?: boolean) {
        let created = isRngAdult ? Workspace.GetServerTimeNow() - (math.random(259200, 432000)) : Workspace.GetServerTimeNow();;
        
        // Add the horse to the player's horse list.
        this.horses.add({
            created,                            // The time the horse was created
            equipped: false,                    // Whether the horse is equipped
            id: math.random(1, 1000000),        // The unique id of the horse
            name,                               // The name of the horse
            gender,                             // The gender of the horse
            ownership: this.player.getUserId(), // The owner of the horse
            bred: 0,                            // The time the horse was bred

            // The color of the horse
            color: { r: Animals.getColorFromEnum(color).R, g: Animals.getColorFromEnum(color).G, b: Animals.getColorFromEnum(color).B },
            
            // The horse statistics
            statistics: {
                [Animals.Statistics.RunSpeed]: stats[Animals.Statistics.RunSpeed],
                [Animals.Statistics.TurnSpeed]: stats[Animals.Statistics.TurnSpeed],
                [Animals.Statistics.JumpPower]: stats[Animals.Statistics.JumpPower],
                [Animals.Statistics.Stamina]: stats[Animals.Statistics.Stamina],
                [Animals.Statistics.Health]: stats[Animals.Statistics.Health],
            }
        })

        // Rewrite the horses component with the new data.
        const data = this.player.getData().getData()
        if(!data) throw error("Player data not found")
        
        // Update the player data with the new horse list.
        data.horses = this.horses.get();
    }

    /**
     * Attempt to summon a horse for the player.
     * 
     * @author NodeSupport
     */
    public async summon() {
        const equipped = this.horses.get().find(h => h.equipped);
        if(!equipped) return this.player.error("You do not have a horse equipped!");

        if(this.summoned.has(equipped.id)) return this.player.error("You already have this horse summoned!");

        // Send a success message to the player.
        this.player.success("Successfully summoned your horse \"" + equipped.name + "\"");
        equipped.owner = this.player.getInstance().Name;

        if(PlayerHorseService.hasBreedingCooldown(equipped.id)) {
            equipped.bred = PlayerHorseService.hasBreedingCooldown(equipped.id)!;
        }

        // Summon the horse.
        const horse = new BaseHorseEntity(equipped);
        horse.isInitialized.then(async () => {
            // Spawn the horse at the player's position.
            const character = this.player.getCharacter();
            const root = await character.getHumanoidRootPart();

            if(!root) throw error("Player does not have a humanoid root part");
            horse.spawn(root.CFrame.add(root.CFrame.LookVector.mul(5)).mul(CFrame.Angles(0, math.rad(90), 0)));
            
            this.summoned.set(equipped.id, horse);
        });

        PlayerHorseService.cache.set(equipped.id, this.player);
    }

    /**
     * This function attempts to unequip the given horse from the player.
     * 
     * @param horse The horse to unequip
     * 
     * @author NodeSupport
     */
    public async unequip(horse : number) {
        const exists = this.horses.get().find(h => h.id === horse)
        if(!exists) throw error("Horse does not exist")

        // Check if the horse is already unequipped.
        if(!exists.equipped) throw error("Horse is already unequipped")

        // Send a success message to the player.
        this.player.success("Successfully unequipped your horse \"" + exists.name + "\"");

        // Unequip the horse.
        const horses = this.horses.get().map(h => ({ ...h, equipped: false }));

        const data = this.player.getData().getData()
        if(!data) throw error("Player data not found")
        
        data.horses = horses;
        this.horses.rewrite(horses);
    }

    /**
     * Update the breeding cooldown for the given horse.
     * 
     * @param horse The horse to update the breeding cooldown for
     * 
     * @author NodeSupport
     */
    public static updateBreedingCooldown(horse : number) {
        PlayerHorseService.breedingCooldownCache.set(horse, Workspace.GetServerTimeNow());
    }

    /**
     * Check if the given horse has a breeding cooldown.
     * 
     * @param horse The horse to check the breeding cooldown for
     * @returns The time the horse was bred
     * 
     * @author NodeSupport
     */
    public static hasBreedingCooldown(horse : number) {
        return this.breedingCooldownCache.get(horse);
    }

    /**
     * Sets a server-side breeding cooldown for the given horse.
     * 
     * @param horse The horse to set the breeding cooldown for
     * 
     * @author NodeSupport
     */
    public async setBreedingCooldown(horse : number) {
        const exists = this.horses.get().find(h => h.id === horse)
        if(!exists) throw error("Horse does not exist")

        const data = this.player.getData().getData()
        if(!data) throw error("Player data not found")
        
        PlayerHorseService.updateBreedingCooldown(horse);
        exists.bred = Workspace.GetServerTimeNow();

        const summoned = this.summoned.get(horse);
        if(summoned) summoned.updateAttributeData(exists)

        data.horses = this.horses.get();
        this.horses.rewrite(data.horses);
    }

    /**
     * This function attempts to equip the given horse to the player.
     * 
     * @param horse The horse to equip
     * 
     * @author NodeSupport
     */
    public async equip(horse : number) {
        const exists = this.horses.get().find(h => h.id === horse)
        if(!exists) throw error("Horse does not exist")

        // Check if the horse is already equipped.
        if(exists.equipped) return this.unequip(horse)

        // Send a success message to the player.
        this.player.success("Successfully equipped your horse \"" + exists.name + "\"");

        // Unequip all horses and equip the selected horse.
        const horses = this.horses.get().map(h => ({ ...h, equipped: false }));
        horses.find(h => h.id === horse)!.equipped = true;

        const data = this.player.getData().getData()
        if(!data) throw error("Player data not found")
        
        data.horses = horses;

        // Rewrite the horses component with the new data.
        this.horses.rewrite(horses);
    }

    /**
     * This function initializes the horse service for the player.
     * 
     * @param component The horse list component
     * 
     * @author NodeSupport
     */
    public initialize(component: EntityHorseComponent.Component) {
        // Set the horses component
        this.horses = component

        this.player.getNetwork().listen(PlayerActions.Horse, (...args : unknown[]) => {
            const [ action ] = args as [ HorseActions ]

            switch(action) {
                case HorseActions.Equip: return this.equip(args[1] as number).catch(e => this.player.error(e))
                case HorseActions.Summon: return this.summon().catch(e => this.player.error(e))
            }
        })
    };
}