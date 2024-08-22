//!native
const heights : Record<string, [number, number[]]> = new SharedTable() as unknown as Record<string, [number, number[]]>;

type Grid = Record<string, Record<string, Vector3>>;

export default function CreateChunkVertexMapExecution(grid : Grid, x : number, z : number, step : number) {
	const square: Vector3[] = [
		new Vector3(x, 0, z),
		new Vector3(x + step, 0, z),
		new Vector3(x, 0, z + step),
		new Vector3(x + step, 0, z + step)
	];

	const simplex = (x : number, y : number, frequency : number, amplitude : number, persistence : number, octaves : number, seed : number) => {
        let total = 0
        let maxAmplitude = 0
        let amp = 1
        let freq = frequency

        for (let i = 0; i < octaves; i++) {
            total = total + math.noise(x * freq, y * freq, seed * 174812) * amp
            maxAmplitude = maxAmplitude + amp
            amp = amp * persistence
            freq = freq * 2
        }

        let normalizedTotal = total / maxAmplitude
        return (normalizedTotal * amplitude + 1) / 2
    }

	const getHeightAt = (x: number, z: number): [number, number[]] => {
        const baseNoise = simplex(x, z, 0.0005, 2, 0.1, 2, 124);
        const exponent = 1.3;
        const exponentialNoise = math.pow(math.abs(1 + baseNoise), exponent);

        const mountainNoise = simplex(x, z, 0.0001, 3, 0.025, 2, 12423);
        let mountainHeight = 0;

        if (mountainNoise > 0.7) {
            const mountainExponent = 4;
            const easedMountainNoise = math.pow(math.abs(mountainNoise - 0.5) * 2, mountainExponent);
            mountainHeight = easedMountainNoise * -2;

            const ridgedNoise = math.abs(simplex(x, z, 0.0005, 3, 0.1, 6, 127));
            mountainHeight += ridgedNoise * 7 - 5;
        }

        const wall_sina_center = 15000;
        const wall_range = wall_sina_center / 10;
        const wall_range_from_origin = math.max(wall_sina_center - wall_range, math.min(new Vector3(x, 0, z).Magnitude, wall_sina_center + wall_range));
        const normalized_wall_range = math.abs((wall_range_from_origin - wall_sina_center) / wall_range);

        const smoothStep = (edge0: number, edge1: number, x: number): number => {
            const t = math.max(0, math.min(1, (x - edge0) / (edge1 - edge0)));
            return t * t * (3 - 2 * t);
        };

        const flattenBlendFactor = smoothStep(0.2, 0.8, normalized_wall_range) * 0.5;
        mountainHeight *= (normalized_wall_range <= 1 ? flattenBlendFactor : 1);

        const blendFactor = math.min(1, math.max(0, (mountainNoise - 0.9) / 0.1));
        const blendedHeight = exponentialNoise * (1 - blendFactor) + mountainHeight * blendFactor;

        const riverNoise = simplex(x, z, 0.00002, 2, 0.5, 4, 129);
        let riverHeightAdjustment = 0;

        const riverNoiseMin = 0.503;
        const riverNoiseMax = 0.525;
        const riverCenter = (riverNoiseMin + riverNoiseMax) / 2;
        const distanceFromRiver = math.abs(riverNoise - riverCenter);

        if (riverNoise > riverNoiseMin && riverNoise < riverNoiseMax) {
            const halfRange = (riverNoiseMax - riverNoiseMin) / 2;
            const riverBlendFactor = riverNoise < riverCenter
                ? math.pow((riverNoise - riverNoiseMin) / halfRange, 0.5)
                : math.pow((riverNoiseMax - riverNoise) / halfRange, 0.5);

            const smoothBlendFactor = riverBlendFactor * riverBlendFactor * riverBlendFactor * (riverBlendFactor * (riverBlendFactor * 6 - 15) + 10);
            const maskFactor = 1 - math.pow(distanceFromRiver / halfRange, 2);
            const finalBlendFactor = smoothBlendFactor * maskFactor;

            riverHeightAdjustment = 3.25 * finalBlendFactor * -(-1 + mountainHeight / 3);
        }

        const height = (blendedHeight + riverHeightAdjustment + 0.05) * -70;

        return [height, [mountainHeight, distanceFromRiver]];
    }

	for (const corner of square) {
		const sKey = `${corner.X},${corner.Z}`;
		const [ height, data ] = heights[sKey] ?? getHeightAt(corner.X, corner.Z);
		const vector = new Vector3(corner.X, height + 125, corner.Z);

		if (!grid[`${corner.X}`]) grid[`${corner.X}`] = {};
		grid[`${corner.X}`][`${corner.Z}`] = vector;

		if (!heights[sKey]) {
			heights[sKey] = [height, data];
		}
	}

	return grid
}

export const CreateChunkVertexMap = script as ModuleScript;