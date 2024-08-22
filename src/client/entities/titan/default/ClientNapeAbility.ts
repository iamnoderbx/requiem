import animations, { Actions } from "shared/animations/animations";
import { BaseTitanEntity } from "../BaseTitanEntity";
import { BaseTitanAbility } from "../classes/BaseTitanAbility";
import { BaseEntity } from "client/entities/BaseEntity";
import { RunService } from "@rbxts/services";

export class ClientNapeAbility implements BaseTitanAbility {
    private connection : RBXScriptConnection | undefined
    private track : AnimationTrack | undefined

    constructor(private titan : BaseTitanEntity) {}

    private async onGrabbedKeyframeReached() {
        const humanoid = await this.titan.getHumanoid()
        const statistics = humanoid.getStatistics()

        const animator = humanoid.getEntityAnimator();
        if(!statistics || !animator) return

        this.track = animator.play(animations[Actions.TITANS].NAPE_GRAB, 0.1);
        this.connection?.Disconnect()
    }

    async onTitanPredictionGrabAbility() {
        const humanoid = await this.titan.getHumanoid()
        const statistics = humanoid.getStatistics()

        const animator = humanoid.getEntityAnimator();
        if(!statistics || !animator) return

        if(!this.titan.isNetworkOwner()) return

        const client = await BaseEntity.resolveClientEntity()

        const clientHumanoid = client.getEntityHumanoid()
        const root = await clientHumanoid.getEntityHumanoidRootPart()
 
        let head = await humanoid.getEntityHumanoidRootPart()
        head = head?.Parent!.FindFirstChild("Head") as BasePart

        const animation = animations[Actions.TITANS].NAPE_GRAB
        const keyframe = await animator.getTimeOfKeyframe(animation, "Grab")

        this.connection = RunService.RenderStepped.Connect(() => {
            if(!head || !root) return

            const distance = root.Position.sub(head.Position).Magnitude
            const velocity = root.AssemblyLinearVelocity.Magnitude

            // Normalize the players velocity magnitude, min is 100 and max is 450
            const normalized = (velocity - 100) / (450 - 100);
            const subtract = 1.25 * normalized
            
            // Calculate how long it will take for the player to reach the titan
            const time = (distance / velocity)
            if((time > (keyframe + subtract)) || distance > 60 + (normalized * 30)) return

            this.onGrabbedKeyframeReached()
        })
    }

    async onAbilityExecution() {
        this.onTitanPredictionGrabAbility()
    }
}