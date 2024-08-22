export namespace Noise {
    export const Seed = 5151;

    // Gradient function
    export function Gradient(f: (...args: number[]) => number, x: number, y: number, octaves: number, lacunarity: number, persistence: number, scale: number, seed: number, h: number = 0.001): { dx: number, dy: number } {
        let fxh = f(x + h, y, octaves, lacunarity, persistence, scale, seed);
        let fxhNeg = f(x - h, y, octaves, lacunarity, persistence, scale, seed);
        let fyh = f(x, y + h, octaves, lacunarity, persistence, scale, seed);
        let fyhNeg = f(x, y - h, octaves, lacunarity, persistence, scale, seed);
    
        let dx = (fxh - fxhNeg) / (2 * h);
        let dy = (fyh - fyhNeg) / (2 * h);
    
        return { dx, dy };
    }

    // Gaussian blur function
    export function GaussianBlur(data: number[][], sigma: number = 1): number[][] {
        let kernel = createGaussianKernel(sigma);
        let result = convolve(data, kernel);
        return result;
    }

    export function createGaussianKernel(sigma: number): number[][] {
        let kernelSize = math.ceil(sigma * 6);
        let kernel = [];
        for (let i = 0; i < kernelSize; i++) {
            let row = [];
            for (let j = 0; j < kernelSize; j++) {
                row.push(0);
            }
            kernel.push(row);
        }
        let mean = kernelSize / 2;
        let sum = 0;

        for (let x = 0; x < kernelSize; x++) {
            for (let y = 0; y < kernelSize; y++) {
                kernel[x][y] = math.exp(-0.5 * (math.pow((x - mean) / sigma, 2.0) + math.pow((y - mean) / sigma, 2.0))) / (2 * math.pi * sigma * sigma);
                sum += kernel[x][y];
            }
        }

        for (let x = 0; x < kernelSize; x++) {
            for (let y = 0; y < kernelSize; y++) {
                kernel[x][y] /= sum;
            }
        }

        return kernel;
    }

    export function convolve(data: number[][], kernel: number[][]): number[][] {
        let width = data.size();
        let height = data[0].size();
        let kernelWidth = kernel.size();
        let kernelHeight = kernel[0].size();
        let result = [];
        for (let i = 0; i < width; i++) {
            let row = [];
            for (let j = 0; j < height; j++) {
                row.push(0);
            }
            result.push(row);
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let sum = 0;

                for (let i = 0; i < kernelWidth; i++) {
                    for (let j = 0; j < kernelHeight; j++) {
                        let xi = x - math.floor(kernelWidth / 2) + i;
                        let yj = y - math.floor(kernelHeight / 2) + j;

                        if (xi >= 0 && xi < width && yj >= 0 && yj < height) {
                            sum += data[xi][yj] * kernel[i][j];
                        }
                    }
                }

                result[x][y] = sum;
            }
        }

        return result;
    }

    export function Simplex(x : number, y : number, frequency : number, amplitude : number, persistence : number, octaves : number, seed : number) {
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

    export function Fractal(x : number, y : number, octaves : number, lacunarity : number, persistence : number, scale : number, seed : number = Seed) : number {
        // The sum of our octaves
        let value = 0;

        // These coordinates will be scaled the lacunarity
        let x1 = x;
        let y1 = y;

        // Determines the effect of each octave on the previous sum
        let amplitude = 1;
        
        for(let i = 1; i <= octaves; i++) {
            // Multiply the noise output by the amplitude and add it to our sum
            value += math.noise(x1 / scale, y1 / scale, seed) * amplitude;
            
            // Scale up our perlin noise by multiplying the coordinates by lacunarity
            y1 *= lacunarity;
            x1 *= lacunarity;

            // Reduce our amplitude by multiplying it by persistence
            amplitude *= persistence;
        }

        // It is possible to have an output value outside of the range [-1,1]
        // For consistency let's clamp it to that range
        return math.clamp(value, -1, 1);
    }
}