import { BaseEntity } from "../BaseEntity";
import { Entities } from "shared/EntitySignatures";
import { ComponentWrapper } from "server/components/ComponentDataWrapper";
import { CollectionService, HttpService, Players, Workspace } from "@rbxts/services";
import { Animals } from "shared/Animals";
import { Assets } from "shared/types/Assets";
import { BasePlayerEntity } from "../player/BasePlayerEntity";
import { EntityIsServerOnly } from "shared/utilities/decorators/EntityListensFor";

@EntityIsServerOnly()
export class BaseHorseEntity extends BaseEntity {
    public static Horses = new Map<number, BaseHorseEntity>();

    // The instance of the horse entity.
    private instance! : Assets['entities']['horse'];

    // The callback when the horse is unmounted. Used to reset the interaction state.
    private onceUnmounted : (() => void) | undefined;

    // The player that is currently driving the horse.
    private driver : BasePlayerEntity | undefined;

    constructor(private data : Animals.Horse) {
        // Create a new utility number component for the player id
        super(Entities.Entities.HORSE, new ComponentWrapper.Entity([ ]),
            (promise) => promise.then(() => this.initialize()));
    }

    public updateAttributeData(data : Animals.Horse) {
        this.data = data;
        this.instance.SetAttribute("data", HttpService.JSONEncode(this.data));
    }

    /**
     * Get the horse statistics.
     * 
     * @returns The horse statistics.
     * 
     * @author NodeSupport
     */
    public getHorseData() {
        return this.data;
    }

    /**
     * Assign a callback when the horse is unmounted.
     * 
     * @param callback Callback when the horse is unmounted, this is only called once.
     * @returns void
     * 
     * @author NodeSupport
     */
    public onceHorseUnmounted(callback: () => void) {
        this.onceUnmounted = callback;
    }

    /**
     * Forcefully unmount the horse entity.
     * 
     * @returns void
     * 
     * @author NodeSupport
     */
    public unmount() {
        if(this.onceUnmounted) this.onceUnmounted();
        this.onceUnmounted = undefined;

        if(!this.driver) return;
        this.instance.Seat.SetAttribute("driver", undefined);
    }

    /**
     * Forcefully mount the horse entity.
     * 
     * @param player The player to mount the horse.
     * @returns void
     * 
     * @author NodeSupport
     */
    public mount(player : BasePlayerEntity) {
        this.driver = player;

        const character = player.getCharacter()
        character.getHumanoidInstance().then((humanoid) => {
            this.instance.HumanoidRootPart.SetNetworkOwner(player.getInstance())

            this.instance.Seat.SetAttribute("driver", player.getInstance().UserId);
            this.instance.Seat.Sit(humanoid)
        });
    }

    /**
     * Spawn the entity at a specific location.
     * 
     * @param location The location to spawn the entity.
     * @returns void
     * @throws Entity not initialized!
     * 
     * @author NodeSupport
     */
    public spawn(location : CFrame) {
        // Ensure the entity has been initialized
        if(!this.instance) throw "Entity not initialized!"

        // Set the position of the titan entity
        this.instance.PivotTo(location.mul(new CFrame(0, 2, 0)))
        this.instance.Parent = Workspace;

        const player = Players.GetPlayerByUserId(this.data.ownership);
        if(player) this.instance.HumanoidRootPart.SetNetworkOwner(player);

        // Use attributes to set the entity's properties.
        this.instance.SetAttribute("data", HttpService.JSONEncode(this.data));
        BaseHorseEntity.Horses.set(this.data.id, this);

        this.instance.Color.GetChildren().forEach((v) => {
            if(!v.IsA("BasePart")) return;
            v.Color = new Color3(this.data.color.r, this.data.color.g, this.data.color.b)
        })

        this.instance.Seat.GetPropertyChangedSignal("Occupant").Connect(() => {
            const occupant = this.instance.Seat.Occupant;
            if(!occupant) return this.unmount();
        })
    }

    // Initialize the base titan entity
    public initialize() {
        this.instance = Animals.Models.Horse.Clone();

        // This is an instance therefor add attributes
        this.instance.SetAttribute("id", this.network.getEntityPointer())
        CollectionService.AddTag(this.instance, "entity")
    }
}