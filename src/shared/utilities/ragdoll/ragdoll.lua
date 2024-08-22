local RagdollModule = {}

--> Specific CFrame's I made for the best looking Ragdoll
local attachmentCFrames = {
	["Neck"] = {CFrame.new(0, 1, 0, 0, -1, 0, 1, 0, -0, 0, 0, 1), CFrame.new(0, -0.5, 0, 0, -1, 0, 1, 0, -0, 0, 0, 1)},
	["Left Shoulder"] = {CFrame.new(-1.3, 0.75, 0, -1, 0, 0, 0, -1, 0, 0, 0, 1), CFrame.new(0.2, 0.75, 0, -1, 0, 0, 0, -1, 0, 0, 0, 1)},
	["Right Shoulder"] = {CFrame.new(1.3, 0.75, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1), CFrame.new(-0.2, 0.75, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1)},
	["Left Hip"] = {CFrame.new(-0.5, -1, 0, 0, 1, -0, -1, 0, 0, 0, 0, 1), CFrame.new(0, 1, 0, 0, 1, -0, -1, 0, 0, 0, 0, 1)},
	["Right Hip"] = {CFrame.new(0.5, -1, 0, 0, 1, -0, -1, 0, 0, 0, 0, 1), CFrame.new(0, 1, 0, 0, 1, -0, -1, 0, 0, 0, 0, 1)},
}

local ragdollInstanceNames = {
	["RagdollAttachment"] = true,
	["RagdollConstraint"] = true,
	["ColliderPart"] = true,
}

local defaultC0s = {
	["Neck"] = {CFrame.new(0, 1, 0, -1, -0, -0, 0, 0, 1, 0, 1, 0), CFrame.new(0, -0.5, 0, -1, -0, -0, 0, 0, 1, 0, 1, 0)},
	["Left Shoulder"] = {CFrame.new(-1, 0.5, 0, -0, -0, -1, 0, 1, 0, 1, 0, 0), CFrame.new(0.5, 0.5, 0, -0, -0, -1, 0, 1, 0, 1, 0, 0)},
	["Right Shoulder"] = {CFrame.new(1, 0.5, 0, 0, 0, 1, 0, 1, 0, -1, -0, -0), CFrame.new(-0.5, 0.5, 0, 0, 0, 1, 0, 1, 0, -1, -0, -0)},
	["Left Hip"] = {CFrame.new(-1, -1, 0, -0, -0, -1, 0, 1, 0, 1, 0, 0), CFrame.new(-0.5, 1, 0, -0, -0, -1, 0, 1, 0, 1, 0, 0)},
	["Right Hip"] = {CFrame.new(1, -1, 0, 0, 0, 1, 0, 1, 0, -1, -0, -0), CFrame.new(0.5, 1, 0, 0, 0, 1, 0, 1, 0, -1, -0, -0)},
	["RootJoint"] = {CFrame.new(0, 0, 0, -1, -0, -0, 0, 0, 1, 0, 1, 0), CFrame.new(0, 0, 0, -1, -0, -0, 0, 0, 1, 0, 1, 0)}
}


local function push(Character, Torso, Humanoid)
	Torso:ApplyImpulse(Torso.CFrame.LookVector * 100)
end

--> Allows for proper limb collisions
local function createColliderPart(Character, Torso, Humanoid, part: BasePart)
	if not part then return end
	local rp = Instance.new("Part")
	rp.Name = "ColliderPart"
	rp.Size = part.Size/1.7
	rp.Massless = true			
	rp.CFrame = part.CFrame
	rp.Transparency = 1

	local wc = Instance.new("WeldConstraint")
	wc.Part0 = rp
	wc.Part1 = part

	wc.Parent = rp
	rp.Parent = part
end

--> Converts Motor6D's into BallSocketConstraints
function replaceJoints(Character, Torso, Humanoid)
	for _, motor: Motor6D in pairs(Character:GetDescendants()) do
		if motor:IsA("Motor6D") then
			if not attachmentCFrames[motor.Name] then return end
			motor.Enabled = false;

			local a0, a1 = Instance.new("Attachment"), Instance.new("Attachment")
			a0.CFrame = attachmentCFrames[motor.Name][1]
			a1.CFrame = attachmentCFrames[motor.Name][2]

			a0.Name = "RagdollAttachment"
			a1.Name = "RagdollAttachment"

			createColliderPart(Character, Torso, Humanoid, motor.Part1)

			local b = Instance.new("BallSocketConstraint")
			b.Attachment0 = a0
			b.Attachment1 = a1
			b.Name = "RagdollConstraint"

			b.Radius = 0.15
			b.LimitsEnabled = true
			b.TwistLimitsEnabled = false
			b.MaxFrictionTorque = 0
			b.Restitution = 0
			b.UpperAngle = 90
			b.TwistLowerAngle = -45
			b.TwistUpperAngle = 45

			if motor.Name == "Neck" then
				b.TwistLimitsEnabled = true
				b.UpperAngle = 45
				b.TwistLowerAngle = -70
				b.TwistUpperAngle = 70
			end

			a0.Parent = motor.Part0
			a1.Parent = motor.Part1
			b.Parent = motor.Parent
		end
	end
	
	
end

--> Destroys all Ragdoll made instances and re-enables the Motor6D's
function resetJoints(Character, Torso, Humanoid)
	if Humanoid.Health < 1 then return end
	for _, instance in pairs(Character:GetDescendants()) do
		if ragdollInstanceNames[instance.Name] then
			instance:Destroy()
		end

		if instance:IsA("Motor6D") then
			instance.Enabled = true;

			if defaultC0s[instance.Name] then
				instance.C0 = defaultC0s[instance.Name][1]
				instance.C1 = defaultC0s[instance.Name][2]
			end
		end
	end
end

function Ragdoll(Character, Torso, Humanoid, value: boolean)
	if Character:GetAttribute("ragdolled") == value then return end
	Character:SetAttribute("ragdolled", value)

	--> Necessary for Ragdolling to function properly
	Character.Humanoid.BreakJointsOnDeath = false
	Character.Humanoid.RequiresNeck = false
	
	if value then
		Humanoid.AutoRotate = false;
        
		replaceJoints(Character, Torso, Humanoid)
		push(Character, Torso, Humanoid)

		Humanoid.PlatformStand = true
	else
		Humanoid.AutoRotate = true;
		resetJoints(Character, Torso, Humanoid)

		Humanoid.PlatformStand = false

		local HumanoidRootPart = Character:FindFirstChild("HumanoidRootPart")
		HumanoidRootPart.AssemblyLinearVelocity = Vector3.new(0, 0, 0)
		HumanoidRootPart.AssemblyAngularVelocity = Vector3.new(0, 0, 0)

		HumanoidRootPart.Orientation = Vector3.new(0, HumanoidRootPart.Orientation.Y, 0)
		HumanoidRootPart.CFrame = HumanoidRootPart.CFrame * CFrame.new(0, 4, 0)

		resetJoints(Character, Torso, Humanoid)
	end
end

function RagdollModule.Clone(Character : Model)
	Character.Archivable = true

	local clone = Character:Clone()
	Character.Archivable = false

	clone.Parent = Character.Parent
	clone.Name = Character.Name.."_ragdoll"

	RagdollModule.Ragdoll(clone, true)

	return clone
end

function RagdollModule.Ragdoll(Character : Model, Enabled : boolean)
	local Torso: BasePart = Character:WaitForChild("Torso")
	local Humanoid: Humanoid = Character:FindFirstChildOfClass("Humanoid")

	Ragdoll(Character, Torso, Humanoid, Enabled)
end

function RagdollModule:Joints(Character : Model)
	
end

return RagdollModule