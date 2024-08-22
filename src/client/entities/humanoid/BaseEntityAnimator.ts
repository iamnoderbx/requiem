import Object from "@rbxts/object-utils";
import { ContentProvider, RunService } from "@rbxts/services";
import animations, { Actions, Animations, Movements } from "shared/animations/animations";
import { AnimateableCharacter } from "shared/utilities/animations.utilities";
import { ClientMovementController } from "../player/movement/BaseClientMovement";

export type AnimationPackage = {default : Animations, priority : Partial<typeof animations[Animations.DEFAULT]>};

const preloadAnimationTracks = (tbl : object) => {
    for(const [ _, animationId ] of pairs(tbl)) {
        if(typeOf(animationId) === "table") {
            preloadAnimationTracks(animationId)
            continue;
        } else if (typeOf(animationId) !== "string") continue;

        const casted = animationId as string;

        const animation = new Instance("Animation")
        animation.AnimationId = casted;

        ContentProvider.PreloadAsync([ animation ]);
        animation.Destroy()
    }
}

task.spawn(() => {
    warn("Beginning Animation Preloading")

    preloadAnimationTracks(animations)

    warn("Finished Animation Preloading")
})

export class BaseEntityAnimator {
    private character : AnimateableCharacter | undefined;
    private animations : AnimationPackage | undefined;

    private connection : RBXScriptConnection | undefined;

    private tracks : Map<string, AnimationTrack> = new Map();
    private movements : Map<Movements, string> = new Map();

    private walkspeed : number = ClientMovementController.WalkSpeed + 2

    public create(animationId : string) {
        if(!this.tracks.has(animationId)) {
            const animation = new Instance("Animation")
            animation.AnimationId = animationId;

            const track = this.character?.Humanoid.Animator.LoadAnimation(animation);
            if(!track) throw "Failed to load animation";

            this.tracks.set(animationId, track);
        }

        return this.tracks.get(animationId) as AnimationTrack;
    }

    public play(animationId : string, ease? : number, speed?: number) {
        if(!this.tracks.has(animationId)) {
            const animation = new Instance("Animation")
            animation.AnimationId = animationId;

            const track = this.character?.Humanoid.Animator.LoadAnimation(animation);
            if(!track) throw "Failed to load animation";

            this.tracks.set(animationId, track);
        }

        const track = this.tracks.get(animationId);
        if(!track) throw "Failed to get animation track";

        track.Play(ease);
        if(speed) track.AdjustSpeed(speed)

        return track
    }

    public stop(animations : string[], ease? : number) {
        for(const animation of animations) {
            const track = this.tracks.get(animation);
            if(!track) continue;

            if(!track.IsPlaying) continue;

            track.Stop(ease);
        }
    }

    public getAnimationLengthFromTrack(track : AnimationTrack) {
        return new Promise<number>((resolve, reject) => {
            while (track.Length === 0) task.wait()
            resolve(track.Length)
        })
    }

    public getAnimationLength(animationId : string) {
        const track = this.tracks.get(animationId);
        if(!track) throw "Failed to get animation track";

        return new Promise<number>((resolve, reject) => {
            while (track.Length === 0) task.wait()
            resolve(track.Length)
        })
    }

    public getTimeOfKeyframe(animationId : string, keyframe : string) {
        let track = this.tracks.get(animationId);
        if(!track) track = this.create(animationId);

        return new Promise<number>((resolve, reject) => {
            while (track!.Length === 0) task.wait()
            resolve(track!.GetTimeOfKeyframe(keyframe))
        })
    }

    public setWalkspeed(walkspeed : number) {
        this.walkspeed = walkspeed
    }

    /**
     * This function ignites the animations for a character entity.
     * 
     * It checks if the character and animations are set, gets the humanoid and animator,
     * assigns and plays the idle animation, gets the walking track, and connects to the
     * RenderStepped event to handle the walking animation logic based on the player's speed.
     * 
     * @throws Will throw an error if the character or animations are not set, or if the idle or walk animations are not found.
     * 
     * @author NodeSupport
     */
    public ignite() {
        // Check if the character is available
        if(!this.character) throw "Character not set";
        if(!this.animations) throw "Animations not set";
        
        // Get the humanoid & animator
        const humanoid = this.character.Humanoid;
        const animator = humanoid.Animator;

        this.character.WaitForChild("HumanoidRootPart")
        const humanoidRootPart = this.character.HumanoidRootPart;

        // Assign the idle animation.
        const idleAnimation = this.movements.get(Movements.IDLE);
        if(!idleAnimation) throw "Idle animation not found";

        // Play the idle animation
        const idleTrack = this.tracks.get(idleAnimation);
        if(!idleTrack) throw "Idle track not found";

        idleTrack.Play();

        // Get the walking track.
        const walkAnimation = this.movements.get(Movements.WALK);
        if(!walkAnimation) throw "Walk animation not found";

        const sprintAnimation = this.movements.get(Movements.SPRINT);
        if(!sprintAnimation) throw "Sprint animation not found";

        const walkTrack = this.tracks.get(walkAnimation);
        const sprintTrack = this.tracks.get(sprintAnimation);

        const fallAnimation = animations[Actions.MOVEMENT].FALL;
        const fallTrack = this.tracks.get(fallAnimation) || this.create(fallAnimation);
        fallTrack.Priority = Enum.AnimationPriority.Action2

        // const jumpAnimation = animations[Actions.MOVEMENT].JUMP;
        // const jumpTrack = this.tracks.get(jumpAnimation) || this.create(jumpAnimation);
        // jumpTrack.Priority = Enum.AnimationPriority.Action3

        if(this.connection) this.connection.Disconnect();
        this.connection = RunService.RenderStepped.Connect(() => {
            if(!humanoid || !animator) return this.connection?.Disconnect();
            if(!humanoid.Parent) return this.connection?.Disconnect();
            
            // Get the current speed of the player.
            const speed = humanoidRootPart.AssemblyLinearVelocity.Magnitude

            if(humanoid.GetState() === Enum.HumanoidStateType.Freefall && fallTrack && !fallTrack.IsPlaying) {
                if(!humanoidRootPart.FindFirstChildWhichIsA("BodyPosition")) {
                    this.play(fallAnimation, 0.3, 0.3);
                }
            } else if(humanoid.GetState() !== Enum.HumanoidStateType.Freefall && fallTrack?.IsPlaying) {
                this.stop([ fallAnimation ], 0.15);
            }

            if(speed > this.walkspeed && !sprintTrack?.IsPlaying) {
                this.stop([ walkAnimation, idleAnimation ], 0.4);
                return sprintTrack?.Play(0.3);
            } else if (speed <= this.walkspeed && sprintTrack?.IsPlaying) {
                this.stop([ sprintAnimation, idleAnimation ], 0.4);
            }

            // Handle the walking animation logic
            if(speed < 1 && walkTrack?.IsPlaying) {
                idleAnimation && this.play(idleAnimation, 0.2);
                return this.stop([ walkAnimation, sprintAnimation ], 0.2);
            }

            if(speed > 2 && !walkTrack?.IsPlaying && speed < this.walkspeed) {
                this.stop([ idleAnimation ], 0.2);
                return walkTrack?.Play(0.2);
            }
        })
    }

    /**
     * This function loads the animation package for a character entity.
     * 
     * It checks if the animations and character are set, wipes the current tracks,
     * loads the default animations to the map, and then loads the priority animations over the top.
     * 
     * @throws Will throw an error if the animations or character are not set.
     * 
     * @author NodeSupport
     */
    private loadAnimationPackage() {
        // Load the animation package
        if(!this.animations) throw "Animations not set";
        if(!this.character) throw "Character not set";

        this.tracks.forEach((track) => {
            track.Stop(0.3);
        })

        // Wipe the current tracks
        this.tracks.clear();

        // Load in the default animations to the map first
        // then we will load the priority animations over the top
        const animator = this.character.Humanoid.Animator;
        const animationPackage = this.animations;

        const defaults = animations[animationPackage.default];

        // Load the default animations
        for(const movement of Object.keys(defaults)) {
            const animationId = defaults[movement];

            // Create a new animation object to load to animator
            const animation = new Instance("Animation")
            animation.AnimationId = animationId;

            // Load the animation to the animator
            const track = animator.LoadAnimation(animation)
            this.tracks.set(animationId, track);

            this.movements.set(movement, animationId);
        }

        // Load the priority animations
        for(const movement of Object.keys(animationPackage.priority)) {
            const animationId = animationPackage.priority[movement];
            if(!animationId) continue;

            // Create a new animation object to load to animator
            const animation = new Instance("Animation")
            animation.AnimationId = animationId;

            // Load the animation to the animator
            const track = animator.LoadAnimation(animation)
            this.tracks.set(animationId, track);

            this.movements.set(movement, animationId);
        }
    }

    /**
     * This function sets the animation package for a character entity and loads it.
     * 
     * @param {AnimationPackage} anims - The animation package to be set.
     * 
     * @throws Will throw an error if the animations or character are not set.
     * 
     * @author NodeSupport
     */
    public setAnimationPackage(anims : AnimationPackage) {
        // Set the animation package
        this.animations = anims;

        // Load the animation package
        this.loadAnimationPackage();
    }

    /**
     * This function sets the character for the animator.
     * 
     * It checks if the character's humanoid and animator are available, and if so, sets the character.
     * 
     * @param {AnimateableCharacter} character - The character to be set.
     * 
     * @returns {Promise<void>} A promise that resolves when the character is set, or rejects if the humanoid or animator are not found.
     * 
     * @throws Will throw an error if the humanoid or animator are not found.
     * 
     * @author NodeSupport
     */
    public set(character : AnimateableCharacter) {
        // Check if the character is already set
        return new Promise<void>((resolve, reject) => {
            // Ensure that the humanoid exists & is available
            const humanoid = character.WaitForChild("Humanoid", 3);
            if(!humanoid) return reject("Humanoid not found");

            // Ensure that the animator exists & is available
            const animator = humanoid.WaitForChild("Animator", 3);
            if(!animator) return reject("Animator not found");

            // Set the character
            this.character = character;
            resolve();
        })
    }
}