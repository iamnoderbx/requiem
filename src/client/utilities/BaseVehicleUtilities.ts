import Object from "@rbxts/object-utils";
import { HttpService, RunService, TweenService, UserInputService } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { Animals } from "shared/Animals";
import animations, { Actions } from "shared/animations/animations";
import { StatisticModes } from "shared/statistics/classes/Statistic";

export class BaseVehicleControls {
    private connections : { [key : string] : RBXScriptConnection } = {}

    private direction : number = 0;
    private rotation : number = 0;

    private data : Animals.Horse;
    private angular : BodyAngularVelocity;

    private animations : {
        idle : AnimationTrack,
        walk : AnimationTrack,
        run : AnimationTrack,
    }

    private onUnmountedEvent = new Instance("BindableEvent");
    public Unmounted : RBXScriptSignal = this.onUnmountedEvent.Event

    private disabled : boolean = false;

    constructor(private vehicle : Model & { Humanoid : Humanoid & {Animator : Animator}, HumanoidRootPart : BasePart}) {
        const data = vehicle.GetAttribute("data")!;
        this.data = HttpService.JSONDecode(data as string) as Animals.Horse;

        this.angular = new Instance("BodyAngularVelocity")
        this.angular.MaxTorque = new Vector3(0, 500000, 0);
        this.angular.P = 10000;
        this.angular.Parent = this.vehicle.HumanoidRootPart;

        this.vehicle.Humanoid.WalkSpeed = 32;
        
        const idle = new Instance("Animation")
        idle.AnimationId = animations[Actions.MISCELLANEOUS].HORSE_IDLE

        const walk = new Instance("Animation")
        walk.AnimationId = animations[Actions.MISCELLANEOUS].HORSE_WALK

        const run = new Instance("Animation")
        run.AnimationId = animations[Actions.MISCELLANEOUS].HORSE_RUN

        const idleTrack = this.vehicle.Humanoid.Animator.LoadAnimation(idle);
        const walkTrack = this.vehicle.Humanoid.Animator.LoadAnimation(walk);
        const runTrack = this.vehicle.Humanoid.Animator.LoadAnimation(run);
        
        this.animations = {
            idle: idleTrack,
            walk: walkTrack,
            run: runTrack,
        }

        idleTrack.Play(0.2)
    }

    private destroy() {
        this.disabled = true;
        
        for(const connection of Object.values(this.connections)) {
            connection.Disconnect();
        }

        this.direction = 0;
        this.rotation = 0;

        this.vehicle.Humanoid.Move(this.vehicle.HumanoidRootPart.Position);

        this.angular.Destroy();
        this.vehicle.Humanoid.WalkSpeed = 0

        TweenService.Create(this.vehicle.Humanoid, new TweenInfo(0), { WalkSpeed : 0 }).Play();

        for(const animation of Object.values(this.animations)) {
            animation.Stop(0.2);
        }

        this.onUnmountedEvent.Destroy();
    }

    private async onInputBegan(input: InputObject) {
        switch(input.KeyCode) {
            case Enum.KeyCode.LeftShift: {
                const RUN_SPEED = this.data.statistics[Animals.Statistics.RunSpeed]
                const normalized = (RUN_SPEED / 100);
                const speed = normalized + 0.5;

                TweenService.Create(this.vehicle.Humanoid, new TweenInfo(3, Enum.EasingStyle.Linear), { WalkSpeed : speed * 115 }).Play();

                const client = await BaseEntity.resolveClientEntity();
                const humanoid = client.getEntityHumanoid();
                const statistics = humanoid.getStatistics();

                statistics?.get("fov")?.adjust("vehicle", 90, { Mode: StatisticModes.SET, Priority: 35, Tween: new TweenInfo(3)})

                return
            }

            case Enum.KeyCode.LeftControl: {
                this.onUnmountedEvent.Fire();
                this.destroy();

                return
            }
        }
    }

    private async onInputEnded(input: InputObject) {
        switch(input.KeyCode) {
            case Enum.KeyCode.LeftShift: {
                TweenService.Create(this.vehicle.Humanoid, new TweenInfo(2, Enum.EasingStyle.Linear), { WalkSpeed : 32 }).Play();

                const client = await BaseEntity.resolveClientEntity();
                const humanoid = client.getEntityHumanoid();
                const statistics = humanoid.getStatistics();

                statistics?.get("fov")?.deleteStatistic("vehicle", { Mode: StatisticModes.SET, Priority: 35, Tween: new TweenInfo(2)})
                return
            }
        }
    }

    private onDirectionUpdateRequest() {
        this.direction = UserInputService.IsKeyDown(Enum.KeyCode.W) ? math.clamp(this.direction - 0.02, -1, 0) : math.clamp(this.direction + 0.02, -1, 0);
        
        this.rotation = (UserInputService.IsKeyDown(Enum.KeyCode.A) && UserInputService.IsKeyDown(Enum.KeyCode.D) && 0) ||
            (UserInputService.IsKeyDown(Enum.KeyCode.A) && 1) ||
            (UserInputService.IsKeyDown(Enum.KeyCode.D) && -1) || 0;
    }
    
    private onVehicleStepped() {
        if(this.disabled) return;
        
        this.onDirectionUpdateRequest();

        const direction = new Vector3(this.direction, this.direction, this.direction);
        this.vehicle.Humanoid.Move(direction.mul(this.vehicle.HumanoidRootPart.CFrame.LookVector));

        // Convert the turn speed to a normalized value (0 - 1)
        const normalized = (this.data.statistics[Animals.Statistics.TurnSpeed] / 100);

        // Apply a default minimum rotation speed
        const rotationSpeed = normalized + 0.3;

        const defaultRotationSpeed = 60;

        this.angular.MaxTorque = new Vector3(0, (defaultRotationSpeed * rotationSpeed) * 5000, 0);
        this.angular.P = (defaultRotationSpeed * rotationSpeed)
        this.angular.AngularVelocity = new Vector3(0, this.rotation * (defaultRotationSpeed * rotationSpeed), 0);
    }

    private onVehicleMoved(speed : number) {
        if(speed > 1 && !this.animations.walk.IsPlaying) {
            this.animations.walk.Play(0.2);
        } else if (speed <= 0 && this.animations.walk.IsPlaying) this.animations.walk.Stop(0.2);

        if(speed > 33 && !this.animations.run.IsPlaying) {
            this.animations.run.Play(1);
        } else if (speed <= 32 && this.animations.run.IsPlaying) this.animations.run.Stop(0.2);
    }

    public initialize() {
        this.connections.input_begna = UserInputService.InputBegan.Connect((input : InputObject) => this.onInputBegan(input));
        this.connections.input_ended = UserInputService.InputEnded.Connect((input : InputObject) => this.onInputEnded(input));
        this.connections.vehicle_stepped = RunService.RenderStepped.Connect(() => this.onVehicleStepped());
        this.connections.vehicle_moved = this.vehicle.Humanoid.Running.Connect((speed) => this.onVehicleMoved(speed));
    }
    
}