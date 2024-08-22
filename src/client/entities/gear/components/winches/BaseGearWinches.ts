import { Input } from "client/utilities/BaseInputUtilities";
import { ClientGearComponent, GearComponents, GearComponentsList } from "../../classes/ClientGearComponent";
import { ClientGearStatistics } from "../../classes/ClientGearStatistics";
import BaseGearGrapples from "../grapples/BaseGearGrapples";
import BaseGearHandles from "../handles/BaseGearHandles";
import { ClientGearTinkers } from "../../classes/ClientGearTinkers";

export default class BaseGearWinches extends ClientGearComponent {
    private input : Input = new Input();
    private __slacking : boolean = false;

    private __onSlackingChanged : BindableEvent = new Instance("BindableEvent")
    public onSlackingChanged : RBXScriptSignal = this.__onSlackingChanged.Event;

    private ropes : {left? : {rope? : RopeConstraint}, right? : {rope? : RopeConstraint}} = {}
    
    constructor(statistics : ClientGearStatistics, tinkers : ClientGearTinkers) {
        super(statistics, tinkers);
    };

    private async toggled(state : Enum.UserInputState) : Promise<Enum.ContextActionResult> {
        if(state !== Enum.UserInputState.Begin && state !== Enum.UserInputState.End) return Enum.ContextActionResult.Pass;
        
        this.__slacking = state === Enum.UserInputState.Begin;
        this.__onSlackingChanged.Fire(this.__slacking);

        return Enum.ContextActionResult.Pass;
    }

    public isSlacking() {
        return this.__slacking;
    }

    public clean() {
        if(!this.isSlacking()) return;

        if(this.ropes.left) {
            this.ropes.left.rope?.Destroy();
            this.ropes.left = undefined;
        }

        if(this.ropes.right) {
            this.ropes.right.rope?.Destroy();
            this.ropes.right = undefined;
        }

        this.__slacking = false;
        this.__onSlackingChanged.Fire(false);
    }

    public createRope(grapples : BaseGearGrapples) {
        const rope = new Instance("RopeConstraint")
        rope.Visible = false;
        
        const { root } = this.getCharacterComponents()

        const distance = grapples.getDistance();

        rope.Length = distance;
        rope.WinchEnabled = true;
        rope.Restitution = 0.3;
        rope.WinchTarget = distance / 3;
        rope.WinchForce = 10000
        rope.WinchSpeed = 175

        rope.Parent = root;
        
        return rope;
    }

    // Updated is called every frame that a grapple is active
    public updated(grapples : BaseGearGrapples) {
        const { left, right } = grapples.getGrapples();
        
        if(left.isGrappling()) {
            if(!this.ropes.left) this.ropes.left = {rope: this.createRope(grapples)}

            const attachments = left.getAttachments()

            if(attachments && this.ropes.left?.rope) {
                this.ropes.left.rope.Attachment0 = attachments.attachment0;
                this.ropes.left.rope.Attachment1 = attachments.attachment1;
            }
        }

        if(right.isGrappling()) {
            if(!this.ropes.right) this.ropes.right = {rope: this.createRope(grapples)}

            const attachments = right.getAttachments()
            if(attachments && this.ropes.right?.rope) {
                this.ropes.right.rope.Attachment0 = attachments.attachment0;
                this.ropes.right.rope.Attachment1 = attachments.attachment1;
            }
        }
    }

    // Initialization happens after all of the components have
    // been registered, and the statistics have been added
    public initialize(components : GearComponentsList) {
        // Get the grapples component
        const grapples  = this.getComponent<BaseGearGrapples>(components, GearComponents.GRAPPLES)
        const handles   = this.getComponent<BaseGearHandles>(components, GearComponents.HANDLES)

        const slack = this.input.createInputContext(Enum.KeyCode.LeftControl)
        slack.connect((state : Enum.UserInputState) => this.toggled(state))

        // Add a middleware to the grapple
        handles.addGrappleMiddleware((isGrappling : boolean) => (isGrappling && this.isSlacking()) ? this.updated(grapples) : this.clean())
    }
}