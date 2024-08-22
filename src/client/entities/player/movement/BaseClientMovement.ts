import Object from "@rbxts/object-utils";

export type Constructor<T = {}> = new (...args: any[]) => T;

export enum MovementTypes {
    ClientSprintMovement = "ClientSprintMovement",
    ClientSlideMovement = "ClientSlideMovement",
    ClientJumpMovement = "ClientJumpMovement",
}

export class ClientMovementController {
    public static readonly WalkSpeed : number = 12;
    public static readonly SprintMultiplier : number = 3;

    public static movements : {[key in MovementTypes] : BaseClientMovement} = {} as any;

    constructor() {
        script.Parent!.GetChildren().forEach((child) => {
            if(!child.IsA("ModuleScript")) return;
            if(child === script) return;

            const module = require(child) as {default : {Movement: Constructor<BaseClientMovement>}};
            const name = child.Name

            ClientMovementController.movements[name as unknown as MovementTypes] = new module.default.Movement();
        })
    }

    public static ignite() {
        for(const index of Object.values(MovementTypes)) {
            const movement = ClientMovementController.movements[index];
            movement.initialize();
        }
    }
}

export abstract class BaseClientMovement {
    public abstract initialize() : void;
}