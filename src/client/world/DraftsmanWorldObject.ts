import { Requiem } from "shared/Requiem";
import animations, { Actions } from "shared/animations/animations";
import { Assets } from "shared/types/Assets";
import { World } from "shared/utilities/decorators/WorldDecorators";

type DraftsmanFolder = Folder & {
	Spawn: Part;
};

@World.Object("Draftsman")
export class DraftsmanWorldObject {
    private random : Random = new Random();
    private npc : Assets["characters"]["draftsman"] | undefined;
    
    constructor(private folder : DraftsmanFolder) {
        this.random = new Random(this.getDraftsmanIdentifier());
    }

    getDraftsmanIdentifier() {
        // Get the stable position
        const spawn = this.folder.Spawn;
        const position = spawn.Position;

        // Convert the position in to a unique identifier
        return position.X + position.Y + position.Z;
    }

    initialize() {
        // Create a new stablemen interaction
        const spawn = this.folder.Spawn;

        // Add the interaction tag
        spawn.AddTag("Interaction")
        spawn.SetAttribute("Type", "Draftsman")

        // Spawn the npc.
        this.npc = Requiem.Assets.characters.draftsman.Clone();
        this.npc.PrimaryPart!.Anchored = true;
        this.npc.PivotTo(spawn.CFrame);
        this.npc.Parent = spawn.Parent;

        // Create the animation
        const animation = new Instance("Animation")
        animation.AnimationId = animations[Actions.CHARACTERS].DRAFTSMAN.IDLE;

        // Load the animation
        const animator = this.npc.Humanoid!.Animator;
        const track = animator.LoadAnimation(animation);

        // Play the animation
        track.Play();
    }

    destroy() {
        print("Draftsman destroyed")
    }
}