import { BaseEntity } from "client/entities/BaseEntity";
import { ClientGearStatistics } from "./ClientGearStatistics";
import { ClientPlayerEntity } from "client/entities/player/ClientPlayerEntity";
import { UserInputService } from "@rbxts/services";
import { NetworkEntity } from "client/network/NetworkEntity";

export type GearComponentsList = Record<GearComponents, ClientGearComponent>;

export enum GearComponents {
    CANNISTERS, // Maximum Gas
    EJECTOR,    // Maximum Gas Speed Multipliers / Speeds       - WIP
    GYROSCOPE,  // Rotational Speeds & Directions               - Done
    HOLSTERS,   // Maximum Blades                               
    HOUSING,    // Core Functions                               
    SPOOLING,   // Maximum Grapple Lengths                      
    TURBINE,    // Maximum Gear Speeds                          
    WINCHES,    // Grapple retract & extend speeds              
    HANDLES,    // Keybind Controls, etc..                      
    GRAPPLES,   // Grapple Handler                              - Done
    MOVEMENT,   // Movement Handler                             - Wall Running, Sliding, etc.
    BLADES,     // Blade Handler
}

export abstract class ClientGearComponent {
    private character : Model | undefined;
    abstract initialize(components : GearComponentsList, network : NetworkEntity): void;

    constructor(protected statistics : ClientGearStatistics) {}

    public getDirectionalVector() {
        const isAPressed = UserInputService.IsKeyDown(Enum.KeyCode.A)
        const isSPressed = UserInputService.IsKeyDown(Enum.KeyCode.S)
        const isDPressed = UserInputService.IsKeyDown(Enum.KeyCode.D)

        let vector = new Vector3(0, 0, 0)
        
        if(isSPressed) vector = vector.add(new Vector3(0, -0.1, 0))
        if(isAPressed) vector = vector.add(new Vector3(-1, 0, 0))
        if(isDPressed) vector = vector.add(new Vector3(1, 0, 0))

        return vector
    }

    public getCharacterComponents() {
        const character = this.getCharacter();
        if(!character) return {};

        const humanoid = character.FindFirstChild("Humanoid") as Humanoid;
        const root = character.FindFirstChild("HumanoidRootPart") as BasePart;

        return { character, humanoid, root }
    }

    public getClientEntity() {
        return BaseEntity.resolveClientEntity().await()[1] as ClientPlayerEntity;
    }

    public getCharacter() {
        if(this.character) return this.character;

        const [ success, client ] = BaseEntity.resolveClientEntity().await() as LuaTuple<[false, ClientPlayerEntity]>
        const character = client.getCharacterModel()

        this.character = character;

        return character;
    }

    public getStatistics() {
        return this.statistics;
    }

    public getComponent<T>(components : GearComponentsList, component : GearComponents) {
        return components[component as unknown as GearComponents] as T;
    }
}