export namespace HandUtilities {
    export const addRightHandToRig = (character : Model) => {
        const offset = new CFrame(0.0999984741, -1.14999998, 0.049987793, 1, 0, 0, 0, 1, 0, 0, 0, 1)

        if(!character) return
        
        const rightArm = character!.WaitForChild("Right Arm") as BasePart
        if(!rightArm) return

        const hand = new Instance('Part')
        hand.Name = 'RightHandle'
        hand.Anchored = false
        hand.CanCollide = false
        hand.CanQuery = false
        hand.Massless = true;
        hand.Transparency = 1
        hand.Size = new Vector3(1, 1, 1)
        hand.CFrame = rightArm.CFrame.mul(offset)
        hand.Parent = character

        const motor = new Instance('Motor6D')
        motor.Name = 'RightHandle'
        motor.Part0 = rightArm
        motor.Part1 = hand

        motor.C0 = new CFrame(0.002, -0.988, 0.002)
        motor.Parent = rightArm

        return hand
    }

    export const addLeftHandToRig = (character : Model) => {
        const offset = new CFrame(0.0999984741, -1.14999998, 0.049987793, 1, 0, 0, 0, 1, 0, 0, 0, 1)

        if(!character) return
        
        const leftArm = character!.WaitForChild("Left Arm") as BasePart
        if(!leftArm) return

        const hand = new Instance('Part')
        hand.Name = 'LeftHandle'
        hand.Anchored = false
        hand.CanCollide = false
        hand.CanQuery = false
        hand.Massless = true;
        hand.Transparency = 1
        hand.Size = new Vector3(1, 1, 1)
        hand.CFrame = leftArm.CFrame.mul(offset)
        hand.Parent = character

        const motor = new Instance('Motor6D')
        motor.Name = 'LeftHandle'
        motor.Part0 = leftArm
        motor.Part1 = hand

        motor.C0 = new CFrame(0.002, -0.988, 0.002)
        motor.Parent = leftArm

        return hand
    }

    export const addRightHandHolster = (character : Model) : { motor : Motor6D | undefined, object : BasePart | undefined } => {
        const offset = new CFrame(1, -0.749996185, -0.249969482, 1, 0, 0, 0, -0.866025448, 0.500000119, 0, -0.50000006, -0.866025448)
        const torso = character!.WaitForChild("Torso") as BasePart
        if(!torso) return { motor : undefined, object : undefined }

        const holster = new Instance('Part')
        holster.Name = 'RightHolsterBone'
        holster.Anchored = false
        holster.CanCollide = false
        holster.CanQuery = false
        holster.Massless = true;
        holster.Transparency = 1
        holster.Size = new Vector3(1, 1, 1)
        holster.CFrame = torso.CFrame.mul(offset)
        holster.Parent = character

        const motor = new Instance('Motor6D')
        motor.Name = 'RightHolsterBone'
        motor.Part0 = torso
        motor.Part1 = holster

        motor.C0 = new CFrame(1, -0.750029087, -0.249969482, 1, -0, 0, 0, -0.866025448, 0.500000119, 0, -0.50000006, -0.866025448)
        motor.Parent = torso

        return { motor : motor, object : holster }
    }

    export const addLeftHandHolster = (character : Model) : { motor : Motor6D | undefined, object : BasePart | undefined } => {
        const offset = new CFrame(-1, -0.849998474, -0.25, 1, 0, 0, 0, -0.766044438, 0.642787576, 0, -0.642787576, -0.766044438)
        const torso = character!.WaitForChild("Torso") as BasePart
        if(!torso) return { motor : undefined, object : undefined }

        const holster = new Instance('Part')
        holster.Name = 'LeftHolsterBone'
        holster.Anchored = false
        holster.CanCollide = false
        holster.CanQuery = false
        holster.Massless = true;
        holster.Transparency = 1
        holster.Size = new Vector3(1, 1, 1)
        holster.CFrame = torso.CFrame.mul(offset)
        holster.Parent = character

        const motor = new Instance('Motor6D')
        motor.Name = 'LeftHolsterBone'
        motor.Part0 = torso
        motor.Part1 = holster

        motor.C0 = new CFrame(-1, -0.850031376, -0.25, 1, -0, 0, 0, -0.766044438, 0.642787576, 0, -0.642787576, -0.766044438)
        motor.Parent = torso

        return { motor : motor, object : holster }
    }

    export const addTorsoBone = (character : Model) : { motor : Motor6D | undefined, object : BasePart | undefined } => {
        const torso = character!.WaitForChild("Torso") as BasePart
        if(!torso) return { motor : undefined, object : undefined }

        const holster = new Instance('Part')
        holster.Name = 'TorsoBone'
        holster.Anchored = false
        holster.CanCollide = false
        holster.CanQuery = false
        holster.Massless = true;
        holster.Transparency = 1
        holster.Size = new Vector3(1, 1, 1)
        holster.CFrame = torso.CFrame
        holster.Parent = character

        const motor = new Instance('Motor6D')
        motor.Name = 'TorsoBone'
        motor.Part0 = torso
        motor.Part1 = holster

        motor.Parent = torso

        return { motor : motor, object : holster }
    }
}