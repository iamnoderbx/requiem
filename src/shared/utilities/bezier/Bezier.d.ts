
// local Bezier = require(thisModule)

// local b = Bezier.new(Vector3 pointA, Vector3 pointB, Vector3 pointC, ...)
// 	> Create a new bezier object
// 	> Must input at least 3 Vector3 points, or else it will throw an error
	
// 	> TIP: Do not create multiple objects with the same order and set of
// 	       points. Doing so would be pointless. Reuse the object when you can.

// -------------------------------------------------------------------------------------------

// b:Get(ratio)
// 	> Get a Vector3 position on the curve with the given ratio
// 	> Ratio should be between 0 and 1
// 		> 0 = Starting point
// 		> 1 = Ending point
// 		> 0.5 = 50% along the path
// 		> 0.2 = 20% along the path
// 		> etc.

// local positionStart = b:Get(0)
// local positionMid   = b:Get(0.5)
// local positionEnd   = b:Get(1)

// -------------------------------------------------------------------------------------------

// b:GetPath(n, nAsPoints)
// 	> Create path along curve (returns table of Vector3 positions)
// 	> nAsPoints:
// 		If TRUE:  'n' is the number of points along the path
// 		If FALSE: 'n' is the step increment per point on the path 

// local path1 = b:GetPath(0.1, false)  -- Get path; '0.1' being the step increment
// local path2 = b:GetPath(10, true)    -- Get path with '10' points

// -------------------------------------------------------------------------------------------

// b:GetPoints()
// 	> Get the original control points that were inputted when object was created
// 	> Returns a table of Vector3 points

// Create the typing for this module
export class Bezier {
	constructor(...points: Vector3[]);
	Get(ratio: number): Vector3;
	GetPath(n: number, nAsPoints: boolean): Vector3[];
	GetPoints(): Vector3[];
}
