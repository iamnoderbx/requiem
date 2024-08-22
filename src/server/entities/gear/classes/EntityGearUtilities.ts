
import { Data, Weaponary } from "shared/types/Data"
import { EntityDefaultGear } from "../EntityDefaultGear";
import { BaseHumanoidEntity } from "server/entities/humanoid/BaseHumanoidEntity";
import { EntityBaseGear } from "./EntityBaseGear";

type WeaponConstructor<T> = new (humanoid : BaseHumanoidEntity) => T;

export namespace EntityGearUtilities {
    // Create a new weapon
    export const createGear = (weapon : Data.Gear) : Promise<WeaponConstructor<EntityBaseGear>> => {
        return new Promise((resolve, reject) => {
            switch(weapon.type) {
                case Weaponary.Gear:
                    // Create a new nichirin weapon
                    return resolve(EntityDefaultGear)
                default:
                    reject("Invalid weaponary")
            }
        })
    }
}