import { Input } from "client/utilities/BaseInputUtilities";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import { Hitbox } from "shared/utilities/hitbox.utilities";
import { Physics } from "shared/utilities/physics.utilitites";
import animations, { Actions } from "shared/animations/animations";
import { RunService, TweenService, Workspace } from "@rbxts/services";
import { States } from "client/entities/player/ClientPlayerStates";
import BaseGearEjector from "../ejector/BaseGearEjector";
import { Number } from "shared/utilities/number.utilities";

export enum WallRunningDirection {
    LEFT, RIGHT
}

export default class BaseGearMovement extends ClientGearComponent {
    private input : Input = new Input();
    private isWallRunning : boolean = false;

    private grapples : BaseGearGrapples | undefined;

    private animation : AnimationTrack | undefined;

    private velocity : BodyVelocity | undefined;
    private gyro : BodyGyro | undefined;
    private resistance : BodyForce | undefined;
    private stability : BodyGyro | undefined;

    private side : WallRunningDirection | undefined;
    private step : RBXScriptConnection | undefined;

    private clicked : Map<Enum.KeyCode, number> = new Map();
    private ejector: BaseGearEjector | undefined;

    private dashCooldowns = {
        global: 0,
        directional : {
            FORWARD: 0,
            BACKWARD: 0,
            LEFT: 0,
            RIGHT: 0,
        }
    }

    constructor(statistics : ClientGearStatistics) {
        super(statistics);
    };

    private onValidWallRunAttempt(side : WallRunningDirection) : void {
        const offset = side === WallRunningDirection.LEFT ? -1 : 1

        const { root, humanoid } = this.getCharacterComponents();
        if(!root || !humanoid) return;

        const client = this.getClientEntity();
        const animator = client.getEntityHumanoid().getEntityAnimator()
        
        if(!animator) return

        const pushed = root.CFrame.mul(new CFrame(offset, 0, 0)).Position
        const result = Hitbox.Line(root.Position, pushed, [ root.Parent! ], 15)

        if(!result) return;
        
        const normal = result.Normal;
        const position = result.Position
        
        this.side = side;

        const newCFrame = new CFrame(position.add(normal.mul(2)), position)
        const lookVector = newCFrame.mul(CFrame.Angles(0, math.rad(90 * offset), 0)).LookVector

        //root.CFrame = newCFrame
        const magnitude = root.AssemblyLinearVelocity.Magnitude

        humanoid.AutoRotate = false;

        const direction = newCFrame.Position.add(lookVector.mul(100))

        this.gyro = new Instance("BodyGyro")
        this.gyro.MaxTorque = new Vector3(0, math.huge, 0)
        this.gyro.CFrame = new CFrame(newCFrame.Position, direction)
        this.gyro.P = 10000
        this.gyro.D = 1000

        this.gyro.Parent = root

        const animation = animations[Actions.GEAR].WALL_SLIDES.IDLES[side === WallRunningDirection.LEFT ? "LEFT" : "RIGHT"];
        this.animation = animator.play(animation, 0.1)

        States.States.set("wallrunning", true)

        // Forward force
        this.velocity = Physics.ApplyBodyVelocityToTargetVector(root, direction.sub(new Vector3(0, 10, 0)), (magnitude * 0.7))
        this.stability = Physics.RotationStabalizer(root)
        this.resistance = Physics.ReduceAirResistance(root, 0.5)

        const maxForce = this.velocity!.MaxForce;

        TweenService.Create(this.velocity!, new TweenInfo(5), {
            Velocity: this.velocity!.Velocity.sub(new Vector3(0, 40, 0)),
            MaxForce: new Vector3(0, maxForce.Y, 0)
        }).Play()

        this.step = RunService.RenderStepped.Connect(() => {
            const pushed = root.CFrame.mul(new CFrame(offset, 0, 0)).Position
            const result = Hitbox.Line(root.Position, pushed, [ root.Parent! ], 10)

            if(!result) return this.onWallRunFinished()

            const forward = Hitbox.Line(root.Position, root.CFrame.LookVector.add(root.Position), [ root.Parent! ], 2)
            if(forward) return this.onWallRunFinished()

            const ground = Hitbox.DistanceFromGround(root.Position, [ root.Parent! ])
            if(ground && ground < 20) return this.onWallRunFinished()

            if(root.AssemblyLinearVelocity.Magnitude < 40) return this.onWallRunFinished()
        })
    }

    private async onWallRunFinished() : Promise<Enum.ContextActionResult> {
        const { root, humanoid } = this.getCharacterComponents();
        if(!root || !humanoid) return Enum.ContextActionResult.Pass;

        const client = this.getClientEntity();
        const animator = client.getEntityHumanoid().getEntityAnimator()
        
        if(!animator) return Enum.ContextActionResult.Pass

        this.isWallRunning = false;

        this.step?.Disconnect()

        this.velocity?.Destroy();
        this.gyro?.Destroy();
        this.resistance?.Destroy();
        this.stability?.Destroy();

        this.animation?.Stop(0.1)
        States.States.set("wallrunning", false)
        
        humanoid.AutoRotate = true;

        const opposite = root.CFrame.mul(new CFrame(this.side === WallRunningDirection.LEFT ? 1 : -1, 0.5, -1)).Position
        
        const force = new Instance("BodyVelocity")
        force.Velocity = (opposite.sub(root.Position).Unit).mul(300)
        force.MaxForce = new Vector3(math.huge, math.huge, math.huge)
        force.P = 10000
        force.Parent = root

        task.delay(0.2, () => force.Destroy())
        task.delay(0.2, () => Physics.RestoreClientPhysics())

        const animation = animations[Actions.GEAR].WALL_SLIDES.RELEASE[this.side === WallRunningDirection.LEFT ? "LEFT" : "RIGHT"];
        this.animation = animator.play(animation, 0.1)

        return Enum.ContextActionResult.Pass;
    }

    private async isValidWallRun() : Promise<{valid : boolean, side? : WallRunningDirection}> {
        const { root } = this.getCharacterComponents();
        if(!root) return {valid : false};

        const left = root.CFrame.mul(new CFrame(-1, 0, 0))
        const right = root.CFrame.mul(new CFrame(1, 0, 0))
        
        const leftResults = Hitbox.Line(root.Position, left.Position, [ root.Parent! ], 8)
        const rightResults = Hitbox.Line(root.Position, right.Position, [ root.Parent! ], 8)

        const distanceFromGround = Hitbox.DistanceFromGround(root.Position, [ root.Parent! ])
        if(distanceFromGround && distanceFromGround < 20) return {valid : false};

        if(!leftResults && !rightResults) return {valid : false};
        if(States.isClientBusy()) return {valid : false};

        return {valid : true, side : leftResults ? WallRunningDirection.LEFT : WallRunningDirection.RIGHT};
    }

    private onDashAttempted(keycode : Enum.KeyCode) {
        // const offsets : Map<string, Vector3> = new Map([
        //     [ Enum.KeyCode.W.Name, new Vector3(0, 0, -1) ],
        //     [ Enum.KeyCode.A.Name, new Vector3(-1, 0, 0) ],
        //     [ Enum.KeyCode.S.Name, new Vector3(0, 0, 1) ],
        //     [ Enum.KeyCode.D.Name, new Vector3(1, 0, 0) ],
        // ])

        // const animation = keycode.Name === "W" ? "FORWARD" : keycode.Name === "S" ? "BACKWARD" : keycode.Name === "A" ? "LEFT" : "RIGHT"

        // const offset = offsets.get(keycode.Name);
        // if(!offset) return;

        // const { root } = this.getCharacterComponents();
        // if(!root) return;

        // const client = this.getClientEntity();
        // const animator = client.getEntityHumanoid().getEntityAnimator()
        // if(!animator) return
        
        // if(tick() - this.dashCooldowns.global < 1.5) return;
        // if(tick() - this.dashCooldowns.directional[animation] < 6) return;

        // this.dashCooldowns.global = tick()
        // this.dashCooldowns.directional[animation] = tick()

        // const camera = Workspace.CurrentCamera!
        // const forward = camera.CFrame.LookVector.mul(100)

        // const origin = new CFrame(root.CFrame.Position, root.CFrame.Position.add(forward))
        // const direction = origin.mul(new CFrame(offset)).Position
        
        // States.States.set("dashing", true)

        // const velocity = root.FindFirstChildWhichIsA("BodyVelocity") as BodyVelocity | undefined;
        // if(velocity) velocity.Parent = undefined;

        // const force = Physics.ApplyBodyVelocityToTargetVector(root, direction, 300)

        // const ease = new Number.Ease(-0.085, 0, new TweenInfo(1))
        // ease.Play()

        // this.ejector!.impulse(force!.Velocity)
        // animator.play(animations[Actions.GEAR].AIR_DASHES[animation], 0.1)

        // task.delay(1, () => ease.Destroy())
        // task.delay(0.2, () => this.ejector!.impulse(force!.Velocity, ease))
        
        // task.delay(0.2, () => force!.Destroy())
        // task.delay(0.2, () => States.States.set("dashing", false))
    }

    private async onWallRunAttempted() : Promise<Enum.ContextActionResult> {
        if(!this.grapples) return Enum.ContextActionResult.Pass;
        const { right, left } = this.grapples.getGrapples();
        
        if(right.isGrappling() || left.isGrappling()) return Enum.ContextActionResult.Pass;

        const { valid, side } = await this.isValidWallRun();
        if(!valid || side === undefined) return Enum.ContextActionResult.Pass;
        
        this.isWallRunning = true;
        this.onValidWallRunAttempt(side)

        return Enum.ContextActionResult.Pass;
    }
    
    private async onMovementKeyPressed(state : Enum.UserInputState, keycode : Enum.KeyCode) : Promise<Enum.ContextActionResult> {
        if(state !== Enum.UserInputState.Begin) return Enum.ContextActionResult.Pass;
        if(States.isClientBusy()) return Enum.ContextActionResult.Pass;
        
        if(!this.clicked.has(keycode)) {
            this.clicked.set(keycode, tick())
            return Enum.ContextActionResult.Pass;
        }

        const last = this.clicked.get(keycode)!;
        const current = tick();

        if(current - last < 0.2) {
            this.onDashAttempted(keycode)
        }

        this.clicked.set(keycode, current)
        return Enum.ContextActionResult.Pass;
    }

    private async onSpacebarPressed(state : Enum.UserInputState) : Promise<Enum.ContextActionResult> {
        if(!this.isWallRunning && state === Enum.UserInputState.Begin) {
            return this.onWallRunAttempted();
        } else if(this.isWallRunning && state === Enum.UserInputState.End) {
            return this.onWallRunFinished();
        }

        return Enum.ContextActionResult.Pass;
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList) {
        this.grapples = components[GearComponents.GRAPPLES] as BaseGearGrapples
        this.ejector = components[GearComponents.EJECTOR] as BaseGearEjector
        
        const space = this.input.createInputContext(Enum.KeyCode.Space)
        space.connect((state) => this.onSpacebarPressed(state))

        const movements = this.input.createInputContexts([ Enum.KeyCode.W, Enum.KeyCode.A, Enum.KeyCode.S, Enum.KeyCode.D ])
        movements.connect(async (state, keycode) => this.onMovementKeyPressed(state, keycode!))
    }
}