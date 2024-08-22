local function fromHexString(hexStr)
	return (hexStr:gsub('..', function(cc)
		return string.char(tonumber(cc, 16))
	end))
end

local function toHexString(input)
	return (input:gsub('.', function(c)
		return string.format('%02X', string.byte(c))
	end))
end

local TYPE_VECTOR3 = 1
local TYPE_NUMBER = 2
local TYPE_TABLE = 3
local TYPE_I16 = 4
local TYPE_I32 = 5
local TYPE_F32 = 6
local TYPE_F64 = 7
local TYPE_STRING = 8
local TYPE_COLOR3 = 9
local TYPE_UDIM2 = 10
local TYPE_BOOLEAN = 11
local TYPE_TWEENINFO = 12
local TYPE_INSTANCE = 13

return {
	default = function()
		local currentSize = 2 ^ 2
		local buf = buffer.create(currentSize)
		local offset = 0
	
		local allocate = function(size : number)
			local newOffset = offset + size
			if newOffset > currentSize then
				-- Calculate the new required size as the next power of two
				--local newSize = (2 ^ math.ceil(math.log(newOffset) / math.log(2)))
				local newSize = currentSize + size
	
				local oldBuffer = buf;
				currentSize = newSize
	
				buf = buffer.create(newSize);
				buffer.copy(buf, 0, oldBuffer);
			end
		end
	
		local deserialize = function(buf)
			local function read()
				local typeId = buffer.readu8(buf, offset); offset = offset + 1
				if typeId == TYPE_VECTOR3 then
					local x = buffer.readf32(buf, offset); offset = offset + 4
					local y = buffer.readf32(buf, offset); offset = offset + 4
					local z = buffer.readf32(buf, offset); offset = offset + 4
					return Vector3.new(x, y, z)
				elseif typeId == TYPE_COLOR3 then
					local x = buffer.readf32(buf, offset); offset = offset + 4
					local y = buffer.readf32(buf, offset); offset = offset + 4
					local z = buffer.readf32(buf, offset); offset = offset + 4
					return Color3.new(x, y, z)
				elseif typeId == TYPE_UDIM2 then
					local xScale = buffer.readf32(buf, offset); offset = offset + 4
					local xOffset = buffer.readf32(buf, offset); offset = offset + 4
					local yScale = buffer.readf32(buf, offset); offset = offset + 4
					local yOffset = buffer.readf32(buf, offset); offset = offset + 4
					return UDim2.new(xScale, xOffset, yScale, yOffset)
				elseif typeId == TYPE_TWEENINFO then
					local leng = buffer.readf32(buf, offset); offset = offset + 4
					local easingId = buffer.readf32(buf, offset); offset = offset + 4
					local directionId = buffer.readf32(buf, offset); offset = offset + 4
	
					local style = Enum.EasingStyle:GetEnumItems()[easingId]
					local direction = Enum.EasingDirection:GetEnumItems()[directionId]
	
					return TweenInfo.new(leng, style, direction)
				elseif typeId == TYPE_BOOLEAN then
					local value = buffer.readu8(buf, offset); offset = offset + 1
					return (value == 1 and true) or false
				elseif typeId == TYPE_I16 then
					local value = buffer.readi16(buf, offset); offset = offset + 2
					return value
				elseif typeId == TYPE_I32 then
					local value = buffer.readi32(buf, offset); offset = offset + 4
					return value
				elseif typeId == TYPE_F32 then
					local value = buffer.readf32(buf, offset); offset = offset + 4
					return value
				elseif typeId == TYPE_F64 then
					local value = buffer.readf64(buf, offset); offset = offset + 8
					return value
				elseif typeId == TYPE_STRING then
					local length = buffer.readu32(buf, offset); offset = offset + 4
					local chars = {}
					for i = 1, length do
						chars[i] = string.char(buffer.readu8(buf, offset)); offset = offset + 1
					end
					return table.concat(chars)
				elseif typeId == TYPE_TABLE then
					local size = buffer.readu8(buf, offset); offset = offset + 1
					local table = {}
					for i = 1, size do
						table[i] = read()
					end
					return table
				elseif typeId == TYPE_INSTANCE then
					local length = buffer.readu32(buf, offset); offset = offset + 4
					local chars = {}
					for i = 1, length do
						chars[i] = string.char(buffer.readu8(buf, offset)); offset = offset + 1
					end

					local full = table.concat(chars);
					local split = string.split(full, ".")

					local path = game;
					for _, element in ipairs(split) do
						path = path[element]
					end

					return path
				else
					error("Invalid Datatype Read Support:".. typeId)
				end
			end
			return read()
		end
	
		local serialize = function(data)
			local function write(data)
				local dataType = typeof(data)
				if dataType == "Vector3" then
					allocate(1 + 12)
					buffer.writei8(buf, offset, TYPE_VECTOR3); offset = offset + 1
					buffer.writef32(buf, offset, data.X); offset = offset + 4
					buffer.writef32(buf, offset, data.Y); offset = offset + 4
					buffer.writef32(buf, offset, data.Z); offset = offset + 4
				elseif dataType == "Color3" then
					allocate(1 + 12)
					buffer.writei8(buf, offset, TYPE_COLOR3); offset = offset + 1
					buffer.writef32(buf, offset, data.R); offset = offset + 4
					buffer.writef32(buf, offset, data.G); offset = offset + 4
					buffer.writef32(buf, offset, data.B); offset = offset + 4
				elseif dataType == "UDim2" then
					allocate(1 + 16)
					buffer.writei8(buf, offset, TYPE_UDIM2); offset = offset + 1
					buffer.writef32(buf, offset, data.X.Scale); offset = offset + 4
					buffer.writef32(buf, offset, data.X.Offset); offset = offset + 4
					buffer.writef32(buf, offset, data.Y.Scale); offset = offset + 4
					buffer.writef32(buf, offset, data.Y.Offset); offset = offset + 4
				elseif dataType == "TweenInfo" then
					allocate(1 + 12)
					buffer.writei8(buf, offset, TYPE_TWEENINFO); offset = offset + 1
	
					buffer.writef32(buf, offset, data.Time); offset = offset + 4
					buffer.writef32(buf, offset, table.find(Enum.EasingStyle:GetEnumItems(), data.EasingStyle)); offset = offset + 4
					buffer.writef32(buf, offset, table.find(Enum.EasingDirection:GetEnumItems(), data.EasingDirection)); offset = offset + 4
				elseif dataType == "boolean" then
					allocate(1 + 1)
					buffer.writei8(buf, offset, TYPE_BOOLEAN); offset = offset + 1
					buffer.writeu8(buf, offset, (data == true and 1) or 0); offset = offset + 1
				elseif dataType == "number" then
					if math.floor(data) == data then
						-- Handle both positive and negative integers within the range of a 16-bit signed integer
						if data >= -32768 and data <= 32767 then
							allocate(1 + 2)
							buffer.writei8(buf, offset, TYPE_I16); offset = offset + 1
							buffer.writei16(buf, offset, data); offset = offset + 2
							-- Handle both positive and negative integers within the range of a 32-bit signed integer
						elseif data >= -2147483648 and data <= 2147483647 then
							allocate(1 + 4)
							buffer.writei8(buf, offset, TYPE_I32); offset = offset + 1
							buffer.writei32(buf, offset, data); offset = offset + 4
						end
					else
						-- Handle floating-point numbers with single precision
						if math.abs(data) < 3.4028235e38 then
							allocate(1 + 4)
							buffer.writei8(buf, offset, TYPE_F32); offset = offset + 1
							buffer.writef32(buf, offset, data); offset = offset + 4
							-- Handle floating-point numbers with double precision
						else
							allocate(1 + 8)
							buffer.writei8(buf, offset, TYPE_F64); offset = offset + 1
							buffer.writef64(buf, offset, data); offset = offset + 8
						end
					end
				elseif dataType == "string" then
					local length = #data
					allocate(1 + 4 + length)
					buffer.writei8(buf, offset, TYPE_STRING); offset = offset + 1
					buffer.writeu32(buf, offset, length); offset = offset + 4
					for i = 1, length do
						buffer.writei8(buf, offset, string.byte(data, i)); offset = offset + 1
					end
				elseif dataType == "table" then
					allocate(1 + 4)
	
					buffer.writei8(buf, offset, TYPE_TABLE); offset = offset + 1
					buffer.writeu8(buf, offset, #data); offset = offset + 1
					for _, element in ipairs(data) do
						write(element)
					end
				elseif dataType == "Instance" then
					local data = data:GetFullName()

					local length = #data
					allocate(1 + 4 + length)
					buffer.writei8(buf, offset, TYPE_INSTANCE); offset = offset + 1
					buffer.writeu32(buf, offset, length); offset = offset + 4

					for i = 1, length do
						buffer.writei8(buf, offset, string.byte(data, i)); offset = offset + 1
					end
				else
					return error("Invalid Datatype Write Support:".. dataType)
				end
			end
			write(data)
		end
	
		return {
			deserialize = function(buf)
				return deserialize(buf)
			end,
	
			serialize = function(data)
				serialize(data)
				return buf
			end,
		}
	end 
}