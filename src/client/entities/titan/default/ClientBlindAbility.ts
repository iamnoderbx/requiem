import { StatisticModes } from "shared/statistics/classes/Statistic";
import { BaseTitanEntity } from "../BaseTitanEntity";
import { BaseTitanAbility } from "../classes/BaseTitanAbility";
import animations, { Actions } from "shared/animations/animations";

import { BaseEntity } from "client/entities/BaseEntity";
import { RunService } from "@rbxts/services";
import { Physics } from "shared/utilities/physics.utilitites";

enum Directions { LEFT, RIGHT }

export class ClientBlindAbility implements BaseTitanAbility {
    private connection : RBXScriptConnection | undefined
    private weld : WeldConstraint | undefined

    private track : AnimationTrack | undefined

    constructor(private titan : BaseTitanEntity) {}
    
    private async onTitanAbilityDisconnected() {
        const humanoid = await this.titan.getHumanoid()
        const statistics = humanoid.getStatistics()

        const animator = humanoid.getEntityAnimator();
        if(!statistics || !animator) return

        this.connection?.Disconnect()
        this.track?.Stop(0.2)
        this.weld?.Destroy()
        
        statistics.get("walkspeed")?.deleteStatistic("swing", {Priority: 3, Mode: StatisticModes.SET})
    }

    private async onTitanPlayerThrow(titanRoot? : BasePart, playerRoot? : BasePart) {
        if(!titanRoot || !playerRoot) return

        this.weld?.Destroy()

        const unit = (playerRoot.Position.sub(titanRoot.Position)).Unit
        const offset = titanRoot.Position.add(unit.mul(500)).sub(new Vector3(0, 200, 0))

        const velocity = Physics.ApplyBodyVelocityToTargetVector(playerRoot, offset, 500)
        task.delay(0.1, () => velocity?.Destroy())

        this.track?.Stopped.Once(() => {
            this.onTitanAbilityDisconnected()
            titanRoot.Anchored = false;
        })
    }

    private async onTitanGrabbingAttempt() {
        const humanoid = await this.titan.getHumanoid()
        const statistics = humanoid.getStatistics()

        const animator = humanoid.getEntityAnimator();
        if(!statistics || !animator) return

        const client = await BaseEntity.resolveClientEntity()

        const clientHumanoid = client.getEntityHumanoid()
        const root = await clientHumanoid.getEntityHumanoidRootPart()
 
        let head = await humanoid.getEntityHumanoidRootPart()
        head = head?.Parent!.FindFirstChild("Head") as BasePart

        let titanRoot = await humanoid.getEntityHumanoidRootPart()

        const animation = animations[Actions.TITANS].BLIND_GRAPPLE_GRAB
        const keyframe = await animator.getTimeOfKeyframe(animation, "Grab")

        if(!root || !titanRoot) return;

        this.connection?.Disconnect()

        this.track = animator.play(animation, 0.05)
        statistics.get("walkspeed")?.adjust("swing", 0, {Priority: 3, Mode: StatisticModes.SET})

        task.wait(keyframe)

        const hand = head.Parent!.FindFirstChild("RightHand") as BasePart
        const distanceFromHand = hand.Position.sub(root.Position).Magnitude

        if(distanceFromHand > 15) return this.onTitanAbilityDisconnected()

        this.weld = new Instance("WeldConstraint")
        this.weld.Part0 = root
        this.weld.Part1 = hand
        this.weld.Parent = root

        titanRoot.Anchored = true;

        this.track.KeyframeReached.Once(() => {
            this.onTitanPlayerThrow(titanRoot, root)
        })
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

        const animation = animations[Actions.TITANS].BLIND_GRAPPLE_GRAB
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

            this.onTitanGrabbingAttempt()
        })
    }

    async onTitanSidestepAbility(direction : Directions) {
        const humanoid = await this.titan.getHumanoid()
        const statistics = humanoid.getStatistics()

        const animator = humanoid.getEntityAnimator();
        if(!statistics || !animator) return

        if(!this.titan.isNetworkOwner()) return

        const root = await humanoid.getEntityHumanoidRootPart()
        if(!root) return

        const directionOffset = direction === Directions.LEFT ? new Vector3(-25, 2, 0) : new Vector3(25, 2, 0)
        const offset = root.CFrame.mul(directionOffset)

        const animation = direction === Directions.LEFT ? animations[Actions.TITANS].SIDE_STEP_LEFT : animations[Actions.TITANS].SIDE_STEP_RIGHT
        animator.play(animation, 0.05)
        
        const velocity = Physics.ApplyBodyVelocityToTargetVector(root, offset, 400)
        task.delay(0.5, () => velocity?.Destroy())
    }

    async onAbilityExecution() {
        const client = await BaseEntity.resolveClientEntity()

        const clientHumanoid = client.getEntityHumanoid()
        const root = await clientHumanoid.getEntityHumanoidRootPart()

        const titanHumanoid = await this.titan.getHumanoid()
        const titanRoot = await titanHumanoid.getEntityHumanoidRootPart()

        if(!root || !titanRoot) return
        
        const distance = titanRoot?.Position.sub(root?.Position).Magnitude
        const direction = titanRoot.CFrame.LookVector.Dot(root.CFrame.LookVector)
        
        if(direction < -0.9 || distance > 150) return this.onTitanPredictionGrabAbility()

        const relative = titanRoot.CFrame.ToObjectSpace(root.CFrame)

        if(relative.X < 0) return this.onTitanSidestepAbility(Directions.RIGHT)
        else return this.onTitanSidestepAbility(Directions.LEFT)
    }
}