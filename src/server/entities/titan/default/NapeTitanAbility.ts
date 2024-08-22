import { BasePlayerEntity } from "server/entities/player/BasePlayerEntity";
import { BaseTitanEntity } from "../BaseTitanEntity";
import { BaseTitanAbility } from "../classes/BaseTitanAbility";
import { GearActions, TitanActions } from "shared/utilities/network/Events";

export class NapeTitanAbility implements BaseTitanAbility {
    constructor(private titan : BaseTitanEntity) {}

    onAbilityExecution(target : BasePlayerEntity) {
        // Execute the ability
        const network = this.titan.getNetwork();
        network.action(TitanActions.ABILITY, 1);

        // Set the entity cooldown
        this.titan.setEntityCooldown(1, 2);
    }
}