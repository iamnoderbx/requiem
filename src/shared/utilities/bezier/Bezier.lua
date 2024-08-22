-- Bezier
-- Crazyman32
-- April 1, 2015

--[[

EXAMPLES AND DOCUMENTATION:

-------------------------------------------------------------------------------------------

local Bezier = require(thisModule)

local b = Bezier.new(Vector3 pointA, Vector3 pointB, Vector3 pointC, ...)
	> Create a new bezier object
	> Must input at least 3 Vector3 points, or else it will throw an error
	
	> TIP: Do not create multiple objects with the same order and set of
	       points. Doing so would be pointless. Reuse the object when you can.

-------------------------------------------------------------------------------------------

b:Get(ratio)
	> Get a Vector3 position on the curve with the given ratio
	> Ratio should be between 0 and 1
		> 0 = Starting point
		> 1 = Ending point
		> 0.5 = 50% along the path
		> 0.2 = 20% along the path
		> etc.

local positionStart = b:Get(0)
local positionMid   = b:Get(0.5)
local positionEnd   = b:Get(1)

-------------------------------------------------------------------------------------------

b:GetPath(n, nAsPoints)
	> Create path along curve (returns table of Vector3 positions)
	> nAsPoints:
		If TRUE:  'n' is the number of points along the path
		If FALSE: 'n' is the step increment per point on the path 

local path1 = b:GetPath(0.1, false)  -- Get path; '0.1' being the step increment
local path2 = b:GetPath(10, true)    -- Get path with '10' points

-------------------------------------------------------------------------------------------

b:GetPoints()
	> Get the original control points that were inputted when object was created
	> Returns a table of Vector3 points

--]]





-- NOTE: This was designed for higher-order bezier curves. It is not
--       optimized for linear or quadratic curves, but will still
--       calculate them properly and with good speed.

-- More info on Bezier Curves:
	-- http://en.wikipedia.org/wiki/Bezier_curve
	-- http://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
	
	-- I recommend reading the Properties section for the first Wiki link


-- This Bezier module was originally designed for my Bezier Path Plugin:
	-- http://www.roblox.com/item.aspx?id=232918839



	local Bezier = {}
	Bezier.__index = Bezier
	
	
	function Bezier.new(...)
		
		local points = {...}
		assert(#points >= 3, "Must have at least 3 points")
		
		local bezier = {}
		
		local V3 = Vector3.new
		local lerpV3 = V3().lerp
		
		local lines = {}
		local numLines = 0
		local finalLine = nil
			-- Line index key:
				-- [1] = First point
				-- [2] = Second point
				-- [3] = Current Midpoint
		
		
		-- Create mutable pseudo-Vector3 points:
		local function CreatePoint(v3)
			--local point = {X = v3.X; Y = v3.Y; Z = v3.Z}
			local point = {v3.X, v3.Y, v3.Z}
			function point:ToVector3()
				return V3(self[1], self[2], self[3])
			end
			function point:lerp(other, ratio)
				return lerpV3(self:ToVector3(), other:ToVector3(), ratio)
			end
			return point
		end
		
		
		-- Initialize lines:
		do
		
			-- Initialize first lines:
			for i = 1,#points-1 do
				local p1 = CreatePoint(points[i])
				local p2 = CreatePoint(points[i + 1])
				local line = {p1, p2, CreatePoint(p1)}
				lines[#lines + 1] = line
			end
			
			local relativeLines = lines
			
			-- Initialize rest of lines:
			for n = #lines,2,-1 do
				local newLines = {}
				for i = 1,n-1 do
					local l1, l2 = relativeLines[i], relativeLines[i + 1]
					local line = {l1[3], l2[3], CreatePoint(l1[3])}
					newLines[i] = line
					lines[#lines + 1] = line
				end
				relativeLines = newLines
			end
			
			finalLine = relativeLines[1]
			
			numLines = #lines
			
		end
		
		
		-- Get a point on the curve with the given ratio:
		function bezier:Get(ratio, clampRatio)
			if (clampRatio) then
				ratio = (ratio < 0 and 0 or ratio > 1 and 1 or ratio)
			end
			for i = 1,numLines do
				local line = lines[i]
				local mid = line[1]:lerp(line[2], ratio)
				local pt = line[3]
				pt[1], pt[2], pt[3] = mid.X, mid.Y, mid.Z
			end
			return finalLine[3]:ToVector3()
		end
		
		
		-- Get a path of the curve with the given step:
		-- Returns a table of Vector3 points
		function bezier:GetPath(step)
			assert(type(step) == "number", "Must provide a step increment")
			-- Check step domain is within interval (0.0, 1.0):
			assert(step > 0 and step < 1, "Step out of domain; should be between 0 and 1 (exclusive)")
			local path = {}
			local lastI = 0
			for i = 0,1,step do
				lastI = i
				path[#path + 1] = self:Get(i)
			end
			-- In case 'step' didn't fill path fully, properly handle last remaining point:
			if (lastI < 1) then
				local overrideLast = ((1 - lastI) < (step * 0.5))
				path[#path + (overrideLast and 0 or 1)] = bezier:Get(1)
			end
			return path
		end
		
		
		-- Get the control points (the original Vector3 arguments passed to create the object)
		function bezier:GetPoints()
			return points
		end
		
		
		return setmetatable(bezier, Bezier)
		
	end
	
	
	
	return {
		Bezier = Bezier;
	}