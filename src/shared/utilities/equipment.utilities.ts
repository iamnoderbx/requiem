import { ReplicatedStorage } from "@rbxts/services";
import { ParticleUtilities } from "./particles.utilities";
import { Requiem } from "shared/Requiem";

export namespace EquipmentUtilities {
    const handleHolsters : Map<Model, Model> = new Map()

    export const addGearHandleHolsters = (variant : number, bone: { motor : Motor6D, object : BasePart }) => {
        const model = Requiem.Assets.handles.FindFirstChild(tostring(variant)) as Model | undefined
        if(!model) return

        // Clone the model and parent it to the bone
        const clone = model.Clone()
        clone.Parent = bone.object

        clone.SetPrimaryPartCFrame(bone.object.CFrame)

        // Create a WeldConstraint to connect.
        const weld = new Instance("Weld")
        weld.Part0 = bone.object

        weld.Part1 = clone.PrimaryPart!
        weld.Parent = bone.object

        return { weld, object : clone }
    }

    export const addGearModelEquipment = (variant : number, bone: { motor : Motor6D, object : BasePart }) => {
        const model = Requiem.Assets.gear.FindFirstChild(tostring(variant)) as Model | undefined
        if(!model) return

        // Clone the model and parent it to the bone
        const clone = model.Clone()
        clone.Parent = bone.object

        clone.SetPrimaryPartCFrame(bone.object.CFrame)

        // Create a WeldConstraint to connect.
        const weld = new Instance("WeldConstraint")
        weld.Part0 = bone.object

        weld.Part1 = clone.PrimaryPart!
        weld.Parent = bone.object

        return { weld, object : clone }
    }

    export const sheathe = (hand: BasePart, bone : BasePart, holster : { weld : Weld, object : Model }) => {
        const handle = holster.object.PrimaryPart
        if(!handle) return

        const handleHolster = handleHolsters.get(holster.object)

        const model = hand.FindFirstChild("Handle") as Model
        model.Parent = handleHolster

        holster.weld.Destroy()

        const newWeld = new Instance("Weld")
        newWeld.Part0 = handleHolster?.PrimaryPart
        newWeld.Part1 = model.PrimaryPart

        newWeld.Name = "Handle"
        newWeld.Parent = handleHolster?.PrimaryPart

        // print(weld.ClassName)

        // if(!weld) return

        // const particle = handle.FindFirstChild("Sheathe") as Attachment
        // if(particle) ParticleUtilities.emit(particle)

        // const newWeld = new Instance("Weld")
        // newWeld.Part0 = hand
        // newWeld.Part1 = bone

        // newWeld.Parent = hand
        // handle.Parent!.Parent = bone

        // // Destroy the old weld
        // weld.Destroy()

        return { weld : newWeld, object : holster.object }
    }

    export const unsheathe = (hand : BasePart, holster : { weld : Weld, object : Model }) => {
        const point = holster.object.PrimaryPart
        if(!point) return

        const weld = point.FindFirstChild("Handle") as Weld
        if(!weld) return

        const model = holster.object as Model
        if(!model) return

        const handle_model = model.WaitForChild("Handle") as Model
        const handle = handle_model.PrimaryPart!

        const particle = point.FindFirstChild("Unsheathe") as Attachment
        if(particle) ParticleUtilities.emit(particle)

        handle_model.SetPrimaryPartCFrame(hand.CFrame);

        const newWeld = new Instance("Weld")
        newWeld.Part0 = hand
        newWeld.Part1 = handle!

        newWeld.Parent = hand

        // Destroy the old weld
        weld.Destroy()
        handle_model.Parent = hand

        handleHolsters.set(handle_model, holster.object)

        return { weld : newWeld, object : handle_model }
    }
}