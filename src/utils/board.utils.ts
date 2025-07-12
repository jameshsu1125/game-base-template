export interface TileSizeConfig {
    boardSize: number;
    containerSize: number;
    borderWidth: number;
    tileSpacing: number;
}

/**
 * Calculates the size of a single tile within a board, accounting for container size,
 * borders, and spacing between tiles.
 *
 * @param config - The configuration object for tile size calculation.
 * @returns The calculated size for each tile.
 */
export function calculateTileSize(config: TileSizeConfig): number {
    const { boardSize, containerSize, borderWidth, tileSpacing } = config;
    const availableSpace = containerSize - borderWidth * 2;
    const totalSpacing = tileSpacing * (boardSize - 1);
    const tileSize = (availableSpace - totalSpacing) / boardSize;
    return tileSize;
}

