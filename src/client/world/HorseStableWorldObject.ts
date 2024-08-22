import { HttpService } from "@rbxts/services";
import { InteractionServiceRunner } from "client/interactions/InteractionController";
import { Animals } from "shared/Animals";
import { Requiem } from "shared/Requiem";
import animations, { Actions, Animations } from "shared/animations/animations";
import { Assets } from "shared/types/Assets";
import { getController } from "shared/utilities/decorators/ServiceControllers";
import { World } from "shared/utilities/decorators/WorldDecorators";

export type BreedableHorseInformation = {data: Animals.Horse, part : BasePart, isAdult : boolean, isOnCooldown : boolean };
export type HorseStallInformation = { male?: BreedableHorseInformation, female? : BreedableHorseInformation}

type Stable = Folder & {
	Stables: Folder; Spawn: Part;
};

@World.Object("Stable")
export class HorseStableWorldObject {
    private random : Random = new Random();
    private npc : Assets["characters"]["stablemen"] | undefined;
    
    constructor(private folder : Stable) {
        this.random = new Random(this.getStablemanIdentifier());
    }

    public getHorseStalls() {
        let stalls : HorseStallInformation[] = [];

        const interactions = getController(InteractionServiceRunner);

        // Loop from zero to the number of stalls
        for (let i = 0; i < this.folder.Stables.GetChildren().size(); i++) {
            const stall = this.folder.Stables.FindFirstChild(tostring(i + 1)) as BasePart;

            // Get all horse interactions in the map
            const mounts = interactions.getInteractionOctree().SearchRadius(stall.Position, 8).filter((node) => {
                return node.Object.interaction.name === "Mount"
            })
            
            let female : BreedableHorseInformation | undefined = undefined;
            let male : BreedableHorseInformation | undefined = undefined;

            // Loop through all the mounts
            mounts.forEach((mount) => {
                const part = mount.Object.part;
                const unparsed = part.Parent!.GetAttribute("data") as string;
                if(!unparsed) return;

                const data = HttpService.JSONDecode(unparsed) as Animals.Horse;
                if(!data) return;

                if(!female && data.gender === Animals.Gender.Female) female = { data, part, isAdult: Animals.isHorseAdult(data), isOnCooldown: Animals.isHorseOnbreedCooldown(data)}
                if(!male && data.gender === Animals.Gender.Male) male = { data, part, isAdult: Animals.isHorseAdult(data), isOnCooldown: Animals.isHorseOnbreedCooldown(data)}
            })

            stalls.push({ male, female })
        }

        return stalls;
    }

    getStablemanIdentifier() {
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
        spawn.SetAttribute("Type", "Stablemen")

        // Spawn the npc.
        this.npc = Requiem.Assets.characters.stablemen.Clone();
        this.npc.PrimaryPart!.Anchored = true;
        this.npc.PivotTo(spawn.CFrame);
        this.npc.Parent = spawn.Parent;

        // Create the animation
        const animation = new Instance("Animation")
        animation.AnimationId = animations[Actions.CHARACTERS].STABLEMEN.IDLE;

        // Load the animation
        const animator = this.npc.Humanoid!.Animator;
        const track = animator.LoadAnimation(animation);

        // Play the animation
        track.Play();
    }

    destroy() {
        print("HorseStableWorldObject destroyed")
    }
}