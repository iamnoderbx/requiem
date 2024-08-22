import { Requiem } from "shared/Requiem";
import animations, { Actions } from "shared/animations/animations";
import { Assets } from "shared/types/Assets";
import { World } from "shared/utilities/decorators/WorldDecorators";

@World.Object("Land Proprietor")
export class LandProprietorWorldObject {
    private random : Random = new Random();
    private npc : Assets["characters"]["land_proprietor"] | undefined;
    
    constructor(private folder : Folder & { Spawn: Part }) {
        this.random = new Random(this.getStablemanIdentifier());
    }

    getStablemanIdentifier() {
        // Get the stable position
        const spawn = this.folder.WaitForChild("Spawn") as Part;
        const position = spawn.Position;

        // Convert the position in to a unique identifier
        return position.X + position.Y + position.Z;
    }

    initialize() {
        // Create a new stablemen interaction
        const spawn = this.folder.WaitForChild("Spawn") as Part;

        // Add the interaction tag
        spawn.AddTag("Interaction")
        spawn.SetAttribute("Type", "Land Proprietor")

        // Spawn the npc.
        this.npc = Requiem.Assets.characters.land_proprietor.Clone();
        this.npc.PrimaryPart!.Anchored = true;
        this.npc.PivotTo(spawn.CFrame);
        this.npc.Parent = spawn.Parent;

        // Create the animation
        const animation = new Instance("Animation")
        animation.AnimationId = animations[Actions.CHARACTERS].LAND_PROPRIETOR.IDLE;

        // Load the animation
        const animator = this.npc.Humanoid!.Animator;
        const track = animator.LoadAnimation(animation);

        // Play the animation
        track.Play();
    }

    destroy() {
        print("LandProprietorWorldObject destroyed")
    }
}