export const MINIMUM_SUBDIVISIONS = 2;
export const CHUNK_SUBDIVISIONS = 4 + MINIMUM_SUBDIVISIONS;
export const CHUNK_CELL_SIZE = 1500; // 700

export const DECORATION_SAMPLE_SIZE = 3;

export function getCellCenterFromWorldPosition(position: Vector3) {
    return new Vector3(
        math.floor(position.X / CHUNK_CELL_SIZE) * CHUNK_CELL_SIZE + CHUNK_CELL_SIZE / 2,
        0,
        math.floor(position.Z / CHUNK_CELL_SIZE) * CHUNK_CELL_SIZE + CHUNK_CELL_SIZE / 2
    );
}

export function getResolutionFromDistance(distance: number): number {
    // if (distance < CHUNK_CELL_SIZE * 4) {
    //     return 8
    // } else if (distance < CHUNK_CELL_SIZE * 7) {
    //     return 4;
    // } else {
    //     return 1;
    // }

    return 6
}