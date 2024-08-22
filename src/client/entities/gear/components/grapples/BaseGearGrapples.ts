import { Hitbox } from "shared/utilities/hitbox.utilities";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearGrapple, GearGrappleSide } from "../../classes/ClientGearGrapple";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";
import animations, { Actions } from "shared/animations/animations";
import BaseGearEjector, { GearEjectorDirection } from "../ejector/BaseGearEjector";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { NetworkEntity } from "client/network/NetworkEntity";
import { GearActions } from "shared/utilities/network/Events";
import { BaseEntity } from "client/entities/BaseEntity";
import { BaseHumanoidEntity } from "client/entities/humanoid/BaseHumanoidEntity";

export default class BaseGearGrapples extends ClientGearComponent {
    private grapples : { left : ClientGearGrapple, right : ClientGearGrapple };

    private animation : AnimationTrack | undefined
    private promise : Promise<number | void> | undefined

    private orbit : AnimationTrack | undefined
    
    constructor(statistics : ClientGearStatistics) {
        super(statistics);

        // Create a new grapple for the left and right hand
        this.grapples = { 
            left: new ClientGearGrapple(GearGrappleSide.LEFT), 
            right: new ClientGearGrapple(GearGrappleSide.RIGHT)
        }
    };

    public getPivotCenter() {
        const left = this.grapples.left.getGoal();
        const right = this.grapples.right.getGoal();

        if(!left && right) return right;
        if(left && !right) return left;
        
        if(!left || !right) return undefined;
        return left.add(right).div(2);
    }

    public getDistance() {
        const { root } = this.getCharacterComponents()
        if(!root) return 0;

        const magnitude = this.getPivotCenter()?.sub(root?.Position).Magnitude;
        if(!magnitude) return 0;

        return magnitude;
    }

    public getGrappleTargets() {
        return { leftTarget: this.grapples.left.getTargetInstance(), rightTarget: this.grapples.right.getTargetInstance() }
    }

    public getGrapples() {
        return this.grapples;
    }
    
    // Updated is called every frame that a grapple is active
    public updated() {}

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList, network : NetworkEntity) {
        const ejector = this.getComponent<BaseGearEjector>(components, GearComponents.EJECTOR);

        const addAnimationEndlag = (animation : AnimationTrack) => {
            const client = this.getClientEntity();
            if(!client) return;

            // Get the animator for the character
            const animator = client.getEntityHumanoid().getEntityAnimator();
            if(!animator) return;

            // Get the length of the animation
            let promise : Promise<void | number> = animator.getAnimationLengthFromTrack(animation)

            // Wait for the length of the animation to finish
            promise.then((length) => {
                if(!animation || !length) return

                promise = Promise.delay(length - 0.05).then(() => {
                    animation?.AdjustSpeed(0)
                })
            })

            return promise
        }

        // Easter Egg for whoever decides to look through this code, either a new developer
        // or for some stupid reason I open sourced this in year 2026.
        const wethroxLogicHeAskedToBeNamedThis = async (isGrappling : boolean, side_index : GearGrappleSide) => {
            const grapple = side_index === GearGrappleSide.LEFT ? this.grapples.left : this.grapples.right;
            if(!grapple) return;

            // Get the target instance from the grapple
            const target = grapple.getTargetInstance()
            if(!target || !target.Parent) return network.action(GearActions.GRAPPLED, side_index, isGrappling ? 1 : 0, 0)
            
            const exists = BaseEntity.doesEntityInstanceExist(target.Parent)
            if(!exists) return

            // Resolve the entity from the target instance
            BaseEntity.resolveEntityFromInstance<BaseHumanoidEntity>(target.Parent).then((entity) => {
                network.action(GearActions.GRAPPLED, side_index, isGrappling ? 1 : 0, entity.data.id)
            })
        }
        
        const onGrappledAnimation = async (isGrappling : boolean, side_index : GearGrappleSide) => {
            const client = this.getClientEntity();
            if(!client) return;

            const character = client.getCharacterModel();
            const root = character?.PrimaryPart;

            if(!root) return;

            // Handle the logic for invoking the network with grapple information.
            wethroxLogicHeAskedToBeNamedThis(isGrappling, side_index)

            const isBothGrappled = this.grapples.left.isGrappling() && this.grapples.right.isGrappling();
            const isEitherGrappled = this.grapples.left.isGrappling() || this.grapples.right.isGrappling();

            const humanoid = client.getEntityHumanoid()

            const statistics = humanoid.getStatistics();
            const fov = statistics?.get("fov")

            if(isEitherGrappled && fov) fov.adjust("grapple", ejector.isGasBoosting() ? 1.5 : 1.2, {Mode: StatisticModes.MULT, Priority: 2, Tween: new TweenInfo(1.5)})
            else if(!isEitherGrappled && fov) fov.deleteStatistic("grapple", {Priority: 2, Tween: new TweenInfo(2.5)})

            if(!isEitherGrappled && this.orbit) this.orbit.Stop(0.3);

            // Check if the character is on the ground
            const isOnGround = (Hitbox.DistanceFromGround(root.Position, [ character ]) || 0) < 4;
            if(this.animation) this.animation.Stop(0.3);

            // Get the animator for the character
            const animator = humanoid.getEntityAnimator();
            if(!animator) return;

            // Get the animations for the gear
            const gear_anims = animations[Actions.GEAR]
            const side = side_index === GearGrappleSide.LEFT ? "LEFT" : "RIGHT";

            // If the character is on the ground, and isGrappling is true, then play the animation
            this.animation = undefined;

            // If the character is on the ground, and isGrappling is true, then play the animation
            if(isOnGround && isGrappling) this.animation = animator.play(gear_anims.GROUND_HOOKS[side], 0.3)
            if(!isOnGround && isGrappling) this.animation = animator.play(gear_anims.AIR_HOOKS[side], 0.3)
            
            // If the character is not on the ground, and isGrappling is true, then play the animation
            if(!isBothGrappled && !isOnGround && isGrappling) this.animation = animator.play(gear_anims.FREE_FALL_HOOKS[side], 0.3)

            // If the character is not on the ground, and isGrappling is false, then play the animation
            if(!isGrappling) this.animation = animator.play(gear_anims.RELEASES[side][math.random(1, 3) - 1], 0.3)

            if(!this.animation) return;
            if(this.promise) this.promise.cancel()

            if(!isGrappling) return;

            // Add the endlag to the animation
            this.promise = addAnimationEndlag(this.animation)
        }

        ejector.onEjectorDirectionChanged.Connect((direction : GearEjectorDirection) => {
            const client = this.getClientEntity();
            if(!client) return;

            // Get the animator for the character
            const animator = client.getEntityHumanoid().getEntityAnimator();
            if(!animator) return;

            if(this.orbit) this.orbit.Stop(0.2);
            this.orbit = undefined

            // Get the animations for the gear
            const gear_anims = animations[Actions.GEAR]

            let animation : string | undefined

            if(direction === GearEjectorDirection.LEFT) animation = gear_anims.ORBITS.LEFT
            if(direction === GearEjectorDirection.RIGHT) animation = gear_anims.ORBITS.RIGHT

            if(!animation) return;

            this.orbit = animator.play(animation, 0.3)
            addAnimationEndlag(this.orbit)
        })
        
        this.grapples.left.onGrappled.Connect((isGrappling : boolean) => 
            onGrappledAnimation(isGrappling, GearGrappleSide.LEFT));
        
        this.grapples.right.onGrappled.Connect((isGrappling : boolean) => 
            onGrappledAnimation(isGrappling, GearGrappleSide.RIGHT));
    }
}