import { Requiem } from "shared/Requiem"

export const TERRAIN_WEDGE_PART = Requiem.Assets.other.Triangle.Clone()
TERRAIN_WEDGE_PART.Size = new Vector3(1, 0.1, 1)
TERRAIN_WEDGE_PART.Anchored = true
TERRAIN_WEDGE_PART.Material = Enum.Material.Grass
TERRAIN_WEDGE_PART.Color = Color3.fromRGB(77, 138, 69)
TERRAIN_WEDGE_PART.Name = "TerrainTriangle"