import { Input } from "client/utilities/BaseInputUtilities";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics, GearStatisticType } from "../../classes/ClientGearStatistics";
import animations, { Actions } from "shared/animations/animations";
import { States } from "client/entities/player/ClientPlayerStates";
import { NetworkEntity } from "client/network/NetworkEntity";
import { Memory } from "shared/utilities/memory.utilities";
import { ClientGearGrapple } from "../../classes/ClientGearGrapple";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import BaseGearBlades from "../blades/BaseGearBlades";
import { ClientGearTinkers } from "../../classes/ClientGearTinkers";

export default class BaseGearHandles extends ClientGearComponent {
    // Create a new input
    private input : Input = new Input();
    private holster_input : Input = new Input();

    private __isHandlesEquipped : boolean = false;

    // Create a new grapple middleware
    private grappleMiddleware : Array<(grappling : boolean) => void> = [];
    
    constructor(statistics : ClientGearStatistics, tinkers : ClientGearTinkers) {
        super(statistics, tinkers);
    };

    // Check if the handles are equipped
    public isHandlesUnholstered() {
        return this.__isHandlesEquipped;
    }

    private async onHandleHolsterToggle(components : GearComponentsList, state : Enum.UserInputState, network : NetworkEntity) : Promise<Enum.ContextActionResult> {
        if(state !== Enum.UserInputState.Begin) return Enum.ContextActionResult.Pass;
        if(States.isClientBusy()) return Enum.ContextActionResult.Pass;

        // Get the grapples component
        const grapples = components[GearComponents.GRAPPLES] as BaseGearGrapples
        const { left, right } = grapples.getGrapples();

        if(left.isGrappling() || right.isGrappling()) return Enum.ContextActionResult.Pass;

        this.__isHandlesEquipped = !this.__isHandlesEquipped;

        // Get the client entity
        const client = this.getClientEntity()
        const animator = client.getEntityHumanoid().getEntityAnimator()

        // Get the animation
        const animation = this.isHandlesUnholstered() ? animations[Actions.GEAR].UNHOLSTER : animations[Actions.GEAR].HOLSTER;
        
        // Play the unholtser animation
        animator?.play(animation, 0.1)

        // Get the length of the animation
        const length = await animator?.getAnimationLength(animation)
        if(!length) return Enum.ContextActionResult.Pass;

        const keyframe = await animator?.getTimeOfKeyframe(animation, this.__isHandlesEquipped ? "Unholster" : "Holster")
        if(!keyframe) throw "Unholster Keyframe not found"

        States.States.set("holstering", true)
        
        Promise.delay(length).then(() => States.States.set("holstering", false))
        Promise.delay(keyframe).then(() => States.States.set("holstered", this.__isHandlesEquipped))

        return Enum.ContextActionResult.Pass;
    }
    
    // Updated is called every frame that a grapple is active
    public updated(grappling : boolean) {
        this.grappleMiddleware.forEach((middleware) => middleware(grappling));
    }

    // Add a middleware to the grapple
    public addGrappleMiddleware(middleware : (grappling : boolean) => void) {
        this.grappleMiddleware.push(middleware);
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList, network : NetworkEntity) {
        const unholsterHandles = this.holster_input.createInputContext(Enum.KeyCode.R)
        unholsterHandles.connect((state) => this.onHandleHolsterToggle(components, state, network))

        const onGrapplesUnholstered = () => {
            // Get the grapples component
            const grapples = components[GearComponents.GRAPPLES] as BaseGearGrapples
            const grappleLength = this.statistics.getStatistic(GearStatisticType.GRAPPLE_LENGTH);

            const { left, right } = grapples.getGrapples();
            
            left.setGrappleLength(grappleLength);
            right.setGrappleLength(grappleLength);

            // Assign inputs to the grapples
            const grappleRight = this.input.createInputContext(Enum.KeyCode.E)
            grappleRight.connect((state) => right.grapple(state))

            const grappleLeft = this.input.createInputContext(Enum.KeyCode.Q)
            grappleLeft.connect((state) => left.grapple(state))
        }

        // Listen for the holstering state
        const holster = States.States.subscription("holstered")

        // Listen for holstering changed for input handling
        Memory.changed(holster, (value) => {
            if(value) return onGrapplesUnholstered()
            else this.input.clearInputContexts()
        })

        // Add a middleware to the grapple
        ClientGearGrapple.middleware((grappling : boolean) => this.updated(grappling))
    }
}