import { Input } from "client/utilities/BaseInputUtilities";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";
import BaseGearHandles from "../handles/BaseGearHandles";
import { States } from "client/entities/player/ClientPlayerStates";
import animations, { Actions } from "shared/animations/animations";
import { NetworkEntity } from "client/network/NetworkEntity";
import { GearActions } from "shared/utilities/network/Events";

export default class BaseGearBlades extends ClientGearComponent {
    private input : Input = new Input();
    private handles : BaseGearHandles | undefined;

    private isBladesEquipped : boolean = false;
    private swing : number = 0;

    constructor(statistics : ClientGearStatistics) {
        super(statistics);
    };

    private async onBladeSwingRequest(state : Enum.UserInputState, network : NetworkEntity) : Promise<Enum.ContextActionResult> {
        if(state !== Enum.UserInputState.Begin || !this.handles) return Enum.ContextActionResult.Pass;
        if(States.isClientBusy()) return Enum.ContextActionResult.Pass;
        if(States.isCategoryBusy(States.Types.COMBAT)) return Enum.ContextActionResult.Pass;

        const isHandlesUnholstered = this.handles.isHandlesUnholstered();
        if(!isHandlesUnholstered || !this.isBladesEquipped) return Enum.ContextActionResult.Pass;

        const client = this.getClientEntity()
    
        const humanoid = client.getEntityHumanoid()
        const animator = humanoid.getEntityAnimator()

        if(!client || !animator) return Enum.ContextActionResult.Pass;

        this.swing += 1;
        States.States.set("swinging", true)

        const swing = this.swing % 2
        const animation = animations[Actions.GEAR].SWINGS[swing]
        
        const track = animator.play(animation, 0.3)
        track.Stopped.Once(() => States.States.set("swinging", false))

        //network.action(GearActions.SWING, true)
        return Enum.ContextActionResult.Pass;
    }

    private onBladesEquipped(network : NetworkEntity) {
        const client = this.getClientEntity()
        if(!client) return;

        const { root } = this.getCharacterComponents();

        const humanoid = client.getEntityHumanoid()
        const animator = humanoid.getEntityAnimator()

        if(!animator || !root) return;

        const track = animator.play(animations[Actions.GEAR].DRAW, 0.1)
        track.KeyframeReached.Once(() => network.action(GearActions.DRAW, true))
    }

    private onBladesHolstered(network : NetworkEntity) {
        const client = this.getClientEntity()
        if(!client) return;

        const { root } = this.getCharacterComponents();

        const humanoid = client.getEntityHumanoid()
        const animator = humanoid.getEntityAnimator()

        if(!animator || !root) return;
        
        const track = animator.play(animations[Actions.GEAR].UNDRAW, 0.1)
        track.KeyframeReached.Once(() => network.action(GearActions.DRAW, false))
    }
    
    public async onBladeDrawRequest(state : Enum.UserInputState, network : NetworkEntity) : Promise<Enum.ContextActionResult> {
        if(state !== Enum.UserInputState.Begin || !this.handles) return Enum.ContextActionResult.Pass;
        if(States.isClientBusy()) return Enum.ContextActionResult.Pass;

        const isHandlesUnholstered = this.handles.isHandlesUnholstered();
        if(!isHandlesUnholstered && !this.isBladesEquipped) return Enum.ContextActionResult.Pass;

        this.isBladesEquipped = !this.isBladesEquipped;

        if(this.isBladesEquipped) this.onBladesEquipped(network)
        else this.onBladesHolstered(network)

        return Enum.ContextActionResult.Pass;
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList, network : NetworkEntity) {
        this.handles = this.getComponent<BaseGearHandles>(components, GearComponents.HANDLES)

        const draw = this.input.createInputContext(Enum.KeyCode.F)
        draw.connect((state) => this.onBladeDrawRequest(state, network))

        const swing = this.input.createInputContext(Enum.UserInputType.MouseButton1)
        swing.connect((state) => this.onBladeSwingRequest(state, network))
    }
}