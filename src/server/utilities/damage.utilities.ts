import { EntityCombatComponent } from "server/components/Entity/EntityCombatComponent";
import { EntityEffectsComponent } from "server/components/Entity/EntityEffectsComponent";
import { EntityHealthComponent } from "server/components/Entity/EntityHealthComponent";
import { BaseCharacterEntity } from "server/entities/player/BaseCharacterEntity";
import { TimeoutThread } from "shared/utilities/threading/TimeoutThread";

export type DamageSettings = {
    blockbreak : boolean | undefined,

    posture : number | undefined,
    damage : number | undefined
}

export namespace Damage {
    export function damage(character : BaseCharacterEntity, settings : DamageSettings) {
        // Get the combat component
        const combat = character.getComponent(EntityCombatComponent)
        const humanoid = character.getHumanoid()

        if(!humanoid) return;

        if(combat.get().rolling) {
            humanoid.getComponent(EntityEffectsComponent).flash(true)

            TimeoutThread.create(humanoid.getEntityPointer(), "flash", 1.5).then(() => {
                humanoid.getComponent(EntityEffectsComponent).flash(false)
            })
            
            return
        }

        // Check if the character is blocking
        if(combat.get().blocking && !settings.blockbreak) {
            // Reduce the posture of the character
            settings.posture && combat.reducePosture(settings.posture)
            
            if(combat.get().posture.current <= 0) {
                character.broken(1)
            }

            // If the character is blocking, do nothing
            return
        }

        // Get the health component
        const health = character.getComponent(EntityHealthComponent)

        // Reduce the health of the character
        settings.damage && health.reduce(settings.damage)

        // If the health is less than or equal to 0
        if(health.get() <= 0) {
            // Kill the character
            print("Killed the character")
        }
    }
}