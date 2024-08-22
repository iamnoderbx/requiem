import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";

export abstract class BaseTitanAbility {
    abstract onAbilityExecution(target : BasePlayerEntity) : void
}