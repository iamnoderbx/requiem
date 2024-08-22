import { Keybinds } from "shared/Keybindings";
import { ClientPlayerEntity } from "../ClientPlayerEntity";
import { HorseActions, PlayerActions } from "shared/utilities/network/Events";
import animations, { Actions } from "shared/animations/animations";
import { States } from "../ClientPlayerStates";
import { Toasts } from "client/interfaces/routes/toasts.route";
import { Raycasting } from "shared/utilities/ray.utilities";
import { StatisticModes } from "shared/statistics/classes/Statistic";
import { Players } from "@rbxts/services";
import { Assets } from "shared/types/Assets";
import { BaseVehicleControls } from "client/utilities/BaseVehicleUtilities";

export default class ClientHorseService {
    private connection : RBXScriptConnection | undefined;
    private track : AnimationTrack | undefined;
    private controls : BaseVehicleControls | undefined

    constructor(private player : ClientPlayerEntity) {
        // Get the keybind service
        const keybinds = player.getKeybindService()

        const category = keybinds.getCategory(Keybinds.Category.Horse)

        category.pressed("Summon Horse").Connect(() => this.onSummonAttempt())
        category.released("Summon Horse").Connect(() => this.onSummonRelease())
    }

    private onHorseOwnershipController(horse : Assets['entities']['horse']) {
        const root = this.player.getCharacterModel()?.FindFirstChild("HumanoidRootPart") as Part;
        if(!root) return;

        this.controls = new BaseVehicleControls(horse);
        this.controls.initialize();

        const humanoid = this.player.getEntityHumanoid();
        const statistics = humanoid.getStatistics();

        const animator = humanoid.getEntityAnimator()
        animator?.play(animations[Actions.MISCELLANEOUS].RIDE_HORSE, 0.1)

        statistics?.get("walkspeed")?.adjust("ride_horse", 0, { Mode: StatisticModes.SET, Priority: 30})
        statistics?.get("jumppower")?.adjust("ride_horse", 0, { Mode: StatisticModes.SET, Priority: 30})
        statistics?.get("fov")?.adjust("vehicle", 70, { Mode: StatisticModes.SET, Priority: 30, Tween: new TweenInfo(0.3)})

        States.States.set("riding", true);

        
        if(root.FindFirstChildWhichIsA("BodyVelocity")) root.FindFirstChildWhichIsA("BodyVelocity")?.Destroy();
        if(root.FindFirstChildWhichIsA("BodyGyro")) root.FindFirstChildWhichIsA("BodyGyro")?.Destroy();


        this.controls.Unmounted.Connect(() => {
            this.onRestoreStates();
            States.States.set("riding", false); 

            const character = this.player.getCharacterModel();
            const humanoid = character?.FindFirstChildWhichIsA("Humanoid");

            if(humanoid) humanoid.Sit = false;
            if(humanoid) humanoid.Jump = true;

            animator?.stop([ animations[Actions.MISCELLANEOUS].RIDE_HORSE ]);

            horse.Humanoid.WalkSpeed = 0;
        })
    }

    private onRestoreStates() {
        const humanoid = this.player.getEntityHumanoid();
        const statistics = humanoid.getStatistics();

        statistics?.get("walkspeed")?.deleteStatistic("summon_horse", { Mode: StatisticModes.SET, Priority: 15})
        statistics?.get("jumppower")?.deleteStatistic("summon_horse", { Mode: StatisticModes.SET, Priority: 15})

        statistics?.get("walkspeed")?.deleteStatistic("ride_horse", { Mode: StatisticModes.SET, Priority: 30})
        statistics?.get("jumppower")?.deleteStatistic("ride_horse", { Mode: StatisticModes.SET, Priority: 30})
        statistics?.get("fov")?.deleteStatistic("ride_horse", { Mode: StatisticModes.SET, Priority: 30})
    
        States.States.set("summoning", false);
    }

    public onSummonSuccess() {
        this.connection?.Disconnect();
        this.connection = undefined;

        this.onRestoreStates();

        // Check if the player has space infront of them.
        const isSpaceAvailable = Raycasting.isSpaceAvailableInfront(3, 10);
        if(!isSpaceAvailable) return Toasts.failed("There is not enough space to summon a horse.");

        this.player.network.action(PlayerActions.Horse, HorseActions.Summon)
    }

    public onSummonAttempt() {
        if(States.isClientBusy()) return Toasts.failed("You cannot summon a horse at this time.")
        if(States.isCategoryBusy(States.Types.COMBAT)) return Toasts.failed("You cannot summon a horse at this time.")

        const distance = Raycasting.getCharacterDistanceFromGround();
        if(distance > 15) return Toasts.failed("You cannot summon a horse while in the air.");

        const isIndoors = Raycasting.isCharacterIndoors();
        if(isIndoors) return Toasts.failed("You cannot summon a horse indoors.");

        if(this.connection) this.connection.Disconnect();
        
        const animation = animations[Actions.MISCELLANEOUS].SUMMON_HORSE;
        const humanoid = this.player.getEntityHumanoid();
        const animator = humanoid.getEntityAnimator();

        const statistics = humanoid.getStatistics();
        statistics?.get("walkspeed")?.adjust("summon_horse", 5, { Mode: StatisticModes.SET, Priority: 15})
        statistics?.get("jumppower")?.adjust("summon_horse", 0, { Mode: StatisticModes.SET, Priority: 15})

        States.States.set("summoning", true);

        this.track = animator?.play(animation, 0.1);
        this.connection = this.track?.KeyframeReached.Connect(() => this.onSummonSuccess());
    }

    public onSummonRelease() {
        if(!this.connection || !this.track) return;

        this.connection.Disconnect();
        this.connection = undefined;

        const animation = animations[Actions.MISCELLANEOUS].SUMMON_HORSE;
        const humanoid = this.player.getEntityHumanoid();
        const animator = humanoid.getEntityAnimator();

        animator?.stop([ animation ]);
        this.onRestoreStates();
    }

    /**
     * This function attempts to equip the given horse to the player.
     * 
     * @param horse - The horse to equip
     * 
     * @author NodeSupport
     */
    public equip(horse : number) {
        this.player.network.action(PlayerActions.Horse, HorseActions.Equip, horse)
    };

    public initialize() {
        const onCharacterCreation = () => {
            const character = this.player.getEntityCharacter();
            character.Seated.Connect((isSeated : boolean, seat : Seat | undefined) => {
                // Check if the seat has attribute type of Mount
                if(!seat) return;

                // Check if the seat is a mount
                const mount = seat.GetAttribute("Type") === "Mount";
                if(!mount) return;

                // Check if the seat's driver is the client
                const driver = seat.GetAttribute("driver") === Players.LocalPlayer.UserId;
                if(!driver) return;

                this.onHorseOwnershipController(seat.Parent as Assets['entities']['horse']);
            })
        }

        if(!this.player.getEntityCharacter()) { this.player.onCharacterCreated.then(() => {
            onCharacterCreation();
        })} else onCharacterCreation();
        
    }
}