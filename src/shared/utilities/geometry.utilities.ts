export namespace Geometry {
    export function vectorEqual(a: Vector3, b: Vector3) {
        const epsilon = 2;
        return math.abs(a.X - b.X) <= epsilon && math.abs(a.Y - b.Y) <= epsilon && math.abs(a.Z - b.Z) <= epsilon;
    }

    export function triangle(a: Vector3, b: Vector3, c: Vector3, wedge: BasePart, aW1?: BasePart, aW2?: BasePart) {
        let ab = b.sub(a);
        let ac = c.sub(a);
        let bc = c.sub(b);
    
        let abd = ab.Dot(ab);
        let acd = ac.Dot(ac);
        let bcd = bc.Dot(bc);
    
        if (abd > acd && abd > bcd) {
            let temp = c;
            c = a;
            a = temp;
        } else if (acd > bcd && acd > abd) {
            let temp = a;
            a = b;
            b = temp;
        }
    
        ab = b.sub(a);
        ac = c.sub(a);
        bc = c.sub(b);
    
        const right = ac.Cross(ab).Unit;
        const up = bc.Cross(right).Unit;
        const back = bc.Unit;
        
        const height = math.abs(ab.Dot(up));
        const thickness = 80;
        const halfThickness = thickness / 2;

        let wedge1CFrame = CFrame.fromMatrix(a.add(b).div(2), right, up, back);

        // Check if wedge1CFrame is upside down
        if (wedge1CFrame.RightVector.Y < 0) {
            wedge1CFrame = wedge1CFrame.mul(new CFrame(halfThickness, 0, 0));
        } else {
            wedge1CFrame = wedge1CFrame.mul(new CFrame(-halfThickness, 0, 0));
        }
    
        const w1 = aW1 ?? wedge.Clone();
        w1.Size = new Vector3(thickness, height, math.abs(ab.Dot(back)));
        w1.CFrame = wedge1CFrame

        let wedge2CFrame = CFrame.fromMatrix(a.add(c).div(2), right.mul(-1), up, back.mul(-1))

        // Check if wedge2CFrame is upside down
        if (wedge2CFrame.RightVector.Y < 0) {
            wedge2CFrame = wedge2CFrame.mul(new CFrame(halfThickness, 0, 0));
        } else {
            wedge2CFrame = wedge2CFrame.mul(new CFrame(-halfThickness, 0, 0));
        }
    
        const w2 = aW2 ?? wedge.Clone();
        w2.Size = new Vector3(thickness, height, math.abs(ac.Dot(back)));
        w2.CFrame = wedge2CFrame
    
        return $tuple(w1, w2);
    }

    export function gapfill(partA: BasePart, partB: BasePart) {
        let fillSide = 0

        let relativePos = partB.CFrame.Inverse().mul(partA.CFrame).Position
        if (relativePos.X > 0) {
            fillSide = -1
        } else {
            fillSide = 1
        }

        let p1 = partA.CFrame.mul(new Vector3(partA.Size.X * 0.5 * fillSide, 0, -partA.Size.Z * 0.5))
        let p2 = partB.CFrame.mul(new Vector3(partB.Size.X * 0.5 * fillSide, 0, partB.Size.Z * 0.5))
        let p3 = partA.CFrame.mul(new Vector3(0, 0, -partA.Size.Z * 0.5))

        let p12 = p1.Lerp(p2, 0.5)
        let cornerDistance = p2.sub(p1).Magnitude

        if (cornerDistance < 0.02) {
            return
        }

        if (cornerDistance < 0.4) {
            const p = partA.Clone()
            p.Name = "Fill"
            p.Parent = partA.Parent
            p.Size = new Vector3((p2.sub(p1).Magnitude), p.Size.Y, (p12.sub(p3).Magnitude))
            p.CFrame = new CFrame(p12.Lerp(p3, 0.5), p3)
        } else {
            const w1 = new Instance("WedgePart")
            w1.Name = "Fill"
            w1.Anchored = partA.Anchored
            w1.Locked = partA.Locked
            w1.CanCollide = partA.CanCollide
            w1.Archivable = partA.Archivable
            w1.BrickColor = partA.BrickColor
            w1.Material = partA.Material
            w1.Reflectance = partA.Reflectance
            w1.Transparency = partA.Transparency
            w1.TopSurface = partA.TopSurface
            w1.BottomSurface = partA.BottomSurface
            w1.Parent = partA.Parent
            
            w1.Size = new Vector3(partA.Size.Y, (p2.sub(p1).Magnitude) * 0.5, (p12.sub(p3).Magnitude))
            w1.CFrame = new CFrame(p12.Lerp(p3, 0.5), p3).mul(CFrame.Angles(0, 0, math.pi * 0.5)).mul(new CFrame(0, w1.Size.Y * 0.5, 0))

            const w2 = w1.Clone()
            w2.Parent = w1.Parent
            w2.CFrame = new CFrame(p12.Lerp(p3, 0.5), p3).mul(CFrame.Angles(0, 0, -math.pi * 0.5)).mul(new CFrame(0, w1.Size.Y * 0.5, 0))
        }
    }
}