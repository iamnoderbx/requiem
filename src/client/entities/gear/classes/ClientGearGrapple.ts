import { RunService, Workspace } from "@rbxts/services";
import { BaseEntity } from "client/entities/BaseEntity";
import { States } from "client/entities/player/ClientPlayerStates";
import { Debug } from "shared/utilities/debug.utilities";
import { Hitbox } from "shared/utilities/hitbox.utilities";

const WIRE_BEAM_PUSH = 0.075
export enum GearGrappleSide { LEFT, RIGHT }

export type Grapple = { pointer : number, start : Vector3, goal : Vector3, normal : Vector3, render?: {
    attachment0 : Attachment, // Attachment 0 should be the player, or the collision goal
    attachment1 : Attachment, // Attachment 1 should be the goal
    beam : Beam,
}, collider?: BasePart}


export class ClientGearGrapple {
    private pointer : number = 0;
    private grapples : Grapple[] = [];

    private cooldown : number = 0;
    private connection : number | undefined

    private grappleLength : number = 2500;

    private static __middleware : ((grappling : boolean) => void)[] = []
    private static rendering : (() => void)[] = []
    private static runConnection : RBXScriptConnection | undefined

    private animation : {dt : number, beam: Beam, attachment: Attachment, goal :Attachment}[] = []
    private instance : Instance | undefined

    private __onGrappleEvent : BindableEvent = new Instance("BindableEvent")
    public onGrappled : RBXScriptSignal = this.__onGrappleEvent.Event

    constructor(private side : GearGrappleSide) {}

    public static middleware(callback : (grappling : boolean) => void) {
        ClientGearGrapple.__middleware.push(callback)
    }

    public static renderer(callback : () => void) {
        ClientGearGrapple.rendering.push(callback)

        if(!ClientGearGrapple.runConnection) {
            ClientGearGrapple.runConnection = RunService.RenderStepped.Connect(() => {
                ClientGearGrapple.rendering.forEach(callback => callback())
                ClientGearGrapple.__middleware.forEach(callback => callback(true))
            })
        }

        return ClientGearGrapple.rendering.size()
    }

    public static disconnect(index : number) {
        delete ClientGearGrapple.rendering[index - 1]

        if(ClientGearGrapple.rendering.size() === 0) {
            ClientGearGrapple.runConnection?.Disconnect()
            ClientGearGrapple.runConnection = undefined

            ClientGearGrapple.rendering = []
            ClientGearGrapple.__middleware.forEach(callback => callback(false))
        }
    }

    public isGrappling() {
        return this.pointer > 0
    }

    public getGoal() {
        if(!this.grapples[this.pointer]) return
        return this.grapples[this.pointer].render?.attachment1.WorldPosition
    }

    public getAttachments() {
        if(!this.grapples[this.pointer]) return
        return this.grapples[this.pointer].render
    }
    
    private async draw(grapple : Grapple) {
        // Get the player model
        const client = await BaseEntity.resolveClientEntity()
        const character = client.getCharacterModel()

        // If the character is not found, return
        if(!character) return

        // Create the attachments
        const { start, goal } = grapple
        const attachment0 = Debug.Attachment(start, character.PrimaryPart!)
        const attachment1 = Debug.Attachment(goal)

        // Create the beam
        const beam = Debug.Line(attachment0, attachment1, Color3.fromRGB(0, 0, 0))
        grapple.render = { attachment0, attachment1, beam }

        // If our pointer is zero then we will 
        // play an animation for the first grapple. TODO
        if(grapple.pointer === 1) {
            const animation = Debug.Attachment(start)
            beam.Attachment1 = animation

            this.animation.push({ dt: tick(), beam, attachment: animation, goal: attachment1 })
        }

        return grapple
    }

    private async split(goal : Vector3, normal : Vector3) {
        const currentGrapple = this.grapples[this.pointer]
        const currentRender = currentGrapple.render
        const currentOrigin = currentRender!.attachment0.WorldPosition

        // Check the distance of the goal & the current grapple
        if(!currentRender) return;

        // We need to push the attachment to the normal
        const destination = goal.add(normal.mul(WIRE_BEAM_PUSH)).add(currentGrapple.normal.mul(WIRE_BEAM_PUSH))

        // We then need to push the destination away from the goal on a horizontal line
        const horizontalNormal = new Vector3(normal.X, 0, normal.Z);
        const pushedDestination = destination.sub(horizontalNormal.mul(0));

        // Set the current render to end at the goal collision
        currentRender.attachment1.WorldPosition = pushedDestination //goal.add(normal.mul(0.05))

        // Assign the attachment to the goals
        currentRender.attachment0.Parent = Workspace.Terrain!
        currentRender.attachment0.WorldPosition = currentGrapple.goal.add(currentGrapple.normal.mul(WIRE_BEAM_PUSH))

        // Reset the cooldown
        this.cooldown = tick()

        // Destroy the current collider
        if(currentGrapple.collider) {
            currentGrapple.collider.Destroy()
        }

        // Destroy the previous collider
        const previousGrapple = this.grapples[this.pointer - 1]
        if(previousGrapple && previousGrapple.collider) {
            previousGrapple.collider.Destroy()
        }

        // Create a new grapple with the new goal
        const newGrapple = this.wire(currentOrigin, goal, normal)
        this.draw(this.grapples[newGrapple])
    }

    private async combine() {
        // Get the player model
        const client = await BaseEntity.resolveClientEntity()
        const character = client.getCharacterModel()

        // If the character is not found, return
        if(!character) return

        // Get the offset of the character
        const offset = character.PrimaryPart?.CFrame.Position;
        if(!offset) return

        const currentGrapple = this.grapples[this.pointer]
        const currentRender = currentGrapple.render

        // Set the current goal to the previous pointer goal
        const previousGrapple = this.grapples[this.pointer - 1]
        const previousRender = previousGrapple.render
        const previousGoal = previousRender!.attachment0.WorldPosition

        // Remove the current grapple
        this.pointer -= 1
        this.grapples.pop()

        // Set the current render to end at the goal collision
        currentRender!.attachment0.Parent = character.PrimaryPart!
        currentRender!.attachment0.WorldPosition = offset

        currentRender!.attachment1.WorldPosition = previousGoal
        currentGrapple.goal = previousGoal

        // Destroy the previous grapple render
        previousRender!.attachment0.Destroy()
        previousRender!.attachment1.Destroy()
        previousRender!.beam.Destroy()

        if(previousGrapple.collider) {
            previousGrapple.collider.Destroy()
        }

        // Check if a prevous collider exists
        const _previous = this.grapples[this.pointer - 1]
        if(_previous) {
            // Create a collider
            _previous.collider = Hitbox.SphereCollider(_previous.goal, 1)
        }

        // Update the grapple
        this.grapples[this.pointer] = currentGrapple;
        this.cooldown = tick()

        // Set the current grapple to the previous normal
        currentGrapple.normal = previousGrapple.normal

        return currentGrapple
    }

    private animate(dt : number, beam : Beam, attachment : Attachment, goal: Attachment) {
        const length = tick() - dt;

        const speed = 40; // Adjust this to change the speed
        const decayRate: number = 0.15

        const equation = 10 * math.sin(length * speed) * math.exp(-length / decayRate);
        beam.CurveSize0 = equation;
        
        // Lerp the attachment to the goal (worldposition)
        attachment.WorldPosition = attachment.WorldPosition.Lerp(goal.WorldPosition, 0.3)

        if(length > 1) {
            beam.Attachment1 = goal
            beam.CurveSize0 = 0;

            attachment.Destroy()
            
            return true
        }
    }

    public getTargetInstance() {
        return this.instance
    }

    private async updated() {
        if(States.isCategoryBusy(States.Types.MOUNTS)) return this.release()
            
        // Get the player model
        const client = await BaseEntity.resolveClientEntity()
        const character = client.getCharacterModel()

        // If the character is not found, return
        if(!character) return
        
        // Check if the most recent grapple is colliding
        const grapple = this.grapples[this.pointer]
        if(!grapple && this.connection) return ClientGearGrapple.disconnect(this.connection!)

        // If the grapple is not found, return
        let { render } = grapple;
        if(!render && this.connection) return ClientGearGrapple.disconnect(this.connection!)

        // Check to see if any animation should be playing.
        if(this.animation.size() > 0) {
            // Update the animation
            this.animation.forEach((animation, index) => {
                const success = this.animate(animation.dt, animation.beam, animation.attachment, animation.goal)
                if(success) this.animation.remove(index)
            })
        }

        if(!render) return

        // Get the previous grapple endpoint
        const previous = this.grapples[this.pointer - 1]
        const distanceFromPrevious = previous && previous.collider ? (render.attachment0.WorldPosition.sub(previous.collider.Position)).Magnitude : 0

        // If the previous grapple is not found, return
        if(previous && !previous.collider && previous.render) {
            previous.collider = Hitbox.SphereCollider(previous.render.attachment0.WorldPosition, 1.5)
        }

        // Check if the grapple is in direct line of sight
        const directLineOfSight = previous && previous.collider ? Hitbox.Line(
            render.attachment0.WorldPosition, previous.collider!.Position,
            [ character, ...BaseEntity.getEntityInstances() ], distanceFromPrevious + 5
        ) : false

        // If the grapple is in direct line of sight, combine the grapples
        if(directLineOfSight && previous && previous.collider && directLineOfSight.Instance === previous.collider) {
            return this.combine()
        }

        // Get the distance from the player and the goal
        const wireLength = (render.attachment1.WorldPosition.sub(character.PrimaryPart!.CFrame.Position)).Magnitude

        // Create an ignore list
        const ignore : Instance[] = [ character, ...BaseEntity.getEntityInstances() ]
        if(previous && previous.collider) ignore.push(previous.collider)

        // Check if the grapple is colliding with an object
        const results = Hitbox.Line(
            render.attachment0.WorldPosition, 
            render.attachment1.WorldPosition, 
            ignore,

            wireLength + 3
        )

        // If the results are not found, return
        if(!results) return

        // Get the distance from the player and the collision
        const distance = (render.attachment1.WorldPosition.sub(results.Position)).Magnitude

        // Check the differences in the normals & split
        const dot = grapple.normal.Unit.Dot(results.Normal.Unit)
        if(dot !== 1 && distance > 0.3) return this.split(results.Position, results.Normal)
    }

    private wire(start : Vector3, goal : Vector3, normal : Vector3) {
        this.pointer += 1
        this.grapples[this.pointer] = { pointer: this.pointer, start, goal, normal }
        
        return this.pointer
    }

    private release() {
        ClientGearGrapple.disconnect(this.connection!)
        
        this.grapples.forEach(grapple => {
            if(grapple.render) {
                grapple.render.attachment0.Destroy()
                grapple.render.attachment1.Destroy()
                grapple.render.beam.Destroy()
            }

            if(grapple.collider) {
                grapple.collider.Destroy()
            }
        })

        if(this.pointer > 0) this.__onGrappleEvent.Fire(false)

        this.pointer = 0
        this.grapples = []
    }

    private async grappled() {
        // Get the player model
        const client = await BaseEntity.resolveClientEntity()
        const character = client.getCharacterModel()

        if(States.isClientBusy()) return

        // If the character is not found, return
        if(!character) return

        // Get the offset of the character
        const offset = character.PrimaryPart?.CFrame.Position;

        // Get the grapple destination
        const results = Hitbox.Mouse([ character ])
        if(!results || !offset) return

        // Raycast from the start to the results
        const collisions = Hitbox.Line(offset, results.Position, [ character ], this.grappleLength)
        if(!collisions) return

        // Destroy any current animations
        this.animation = []
        this.instance = collisions.Instance;

        // Create a grapple
        const grapple = this.wire(offset, collisions.Position, collisions.Normal)
        
        this.draw(this.grapples[grapple]).then((grapple : Grapple | undefined) => {
            if(!grapple) return

            if(!grapple.render) return

            const position = grapple.render.attachment1.WorldPosition
            grapple.render.attachment1.Parent = this.instance
            grapple.render.attachment1.WorldPosition = position
        })

        if(this.pointer > 0) this.__onGrappleEvent.Fire(true)

        // Create logic for the grapple & update per frame
        this.connection = ClientGearGrapple.renderer(() => this.updated())
    }

    public setGrappleLength(length : number) {
        this.grappleLength = length
    }

    public async grapple(state: Enum.UserInputState) : Promise<Enum.ContextActionResult> {
        if(state === Enum.UserInputState.Begin) {
            this.grappled();
        } else if (state === Enum.UserInputState.End) {
            this.release();
        }

        return Enum.ContextActionResult.Pass
    }
}