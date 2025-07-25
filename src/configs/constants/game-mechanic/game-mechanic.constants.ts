import { NumericSchema } from "./game-mechanic.interface";

const NUMERIC_MIN_VALUE = 1;

// Game Logic Configuration Schema
type GameMechanicConfigSchema = {
  playerReinforce: NumericSchema;
};

// Configuration Schema Definition
export const GAME_MECHANIC_CONFIG_SCHEMA: GameMechanicConfigSchema = {
  playerReinforce: {
    min: NUMERIC_MIN_VALUE,
    max: 5,
    default: 5,
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
