export type AnimateableCharacter = Model & {HumanoidRootPart : BasePart, Humanoid : Humanoid & { Animator: Animator }};

export namespace AnimationUtilities {
    const characters = new Map<AnimateableCharacter, Map<string, AnimationTrack>>();

    export function play(id : string, character : AnimateableCharacter) {
        if(!characters.has(character)) characters.set(character, new Map<string, AnimationTrack>());
        
        const map = characters.get(character)!;
        if(map.has(id)) {
            const track = map.get(id)!;
            track.Play()

            return track;
        };

        const animator = character.Humanoid.Animator;

        const animation = new Instance("Animation");
        animation.AnimationId = id;

        const track = animator.LoadAnimation(animation);
        track.Play()

        animation.Destroy()

        map.set(id, track);

        return track;
    }
}