import { BooleanSchema, NumericSchema } from "./game-mechanic.interface";

const NUMERIC_MIN_VALUE = 1;

//TODO: match-fight: mini-enemy health?
// Game Logic Configuration Schema
type GameMechanicConfigSchema = {
    initialMoves: NumericSchema;
    totalEnemyHealth: NumericSchema;
    numberOfEnemy: NumericSchema;
    // number of different tile styles
    numberOfTileStyle: NumericSchema;
    baseMatchDamage: NumericSchema;

    // booster appears when match >= 4-tiles
    boosterDamage: NumericSchema;
    // player wins when enemy health is 0
    winCondition: BooleanSchema;
    // player loses when moves are 0
    loseCondition: BooleanSchema;

    // #region Additional configs might be added later
    boardSize: NumericSchema;
    projectileSize: NumericSchema;
    projectileDuration: NumericSchema;
    damageDelay: NumericSchema;
    linearProjectileMovement: BooleanSchema;
    // #endregion
};

// Configuration Schema Definition
export const GAME_MECHANIC_CONFIG_SCHEMA: GameMechanicConfigSchema = {
    initialMoves: {
        min: NUMERIC_MIN_VALUE,
        max: 10,
        default: 10,
    },
    totalEnemyHealth: {
        min: NUMERIC_MIN_VALUE,
        max: 500,
        default: 2000,
    },
    numberOfEnemy: {
        min: NUMERIC_MIN_VALUE,
        max: 3,
        default: 3,
    },
    numberOfTileStyle: {
        min: 3,
        max: 5,
        default: 5,
    },
    baseMatchDamage: {
        min: 1,
        max: 50,
        default: 10,
    },

    boosterDamage: {
        min: NUMERIC_MIN_VALUE,
        max: 100,
        default: 50,
    },
    winCondition: {
        values: [true, false] as const,
        default: true,
    },
    loseCondition: {
        values: [true, false] as const,
        default: true,
    },
    boardSize: {
        min: NUMERIC_MIN_VALUE,
        max: 10,
        default: 8,
    },
    projectileSize: {
        min: NUMERIC_MIN_VALUE,
        max: 1,
        default: 0.2,
    },
    projectileDuration: {
        min: NUMERIC_MIN_VALUE,
        max: 1000,
        default: 600,
    },
    damageDelay: {
        min: NUMERIC_MIN_VALUE,
        max: 1000,
        default: 400,
    },
    linearProjectileMovement: {
        values: [true, false] as const,
        default: true,
    },
};

export const GAME_MECHANIC_CONSTANTS = Object.entries(
    GAME_MECHANIC_CONFIG_SCHEMA
).reduce(
    (configs, [key, value]) => ({
        ...configs,
        [key]: value.default,
    }),
    {} as {
        [K in keyof typeof GAME_MECHANIC_CONFIG_SCHEMA]: (typeof GAME_MECHANIC_CONFIG_SCHEMA)[K]["default"];
    }
);

