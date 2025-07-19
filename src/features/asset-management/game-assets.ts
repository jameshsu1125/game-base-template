// Game asset and text configuration for Match & Fight Game
// This object is the single source of truth for all asset paths and customizable text.
// To override assets/text at runtime (e.g., from a game builder), set localStorage.matchFight (preferred) or window.matchFight before the game loads.
// Example:
//   localStorage.setItem('matchFight', JSON.stringify({ assets: { background: 'custom-bg.png' }, text: { winText: 'Victory!' } }))
//
// The game will merge these overrides with the defaults below.

import deepMerge from "../../_NOT_STANDALONE_GAME_RELATED/deep-merge";
import getOverrides from "../../_NOT_STANDALONE_GAME_RELATED/get-overrides";
import { GAME_NAME } from "../../configs/constants/constants";

export interface GameAssets {
  assets: {
    background: string;
    road: string;
    logo: string;
    player: string;
    healthBar: string;
    firepowerLevel1: string;
    firepowerLevel2: string;
    gatePositive: string;
    gateNegative: string;
    arrowLeft: string;
    arrowRight: string;
    finger: string;
    bucket: string;
    gun1: string;
    gun2: string;
    army: string;
    endBannerDefeat: string;
    endBannerVictory: string;
    endButton: string;
  };
  text: {
    restartButton: string;
    playAgain: string;
    winText: string;
    loseText: string;
    instructions: string;
    movesLabel: string;
  };
}
type MatchFightAssetKeys = keyof GameAssets["assets"];

const defaultGameAssets = {
  assets: {
    background: "assets/choice-runner/background.png",
    road: "assets/choice-runner/road.png",
    logo: "assets/choice-runner/logo.png",
    player: "assets/choice-runner/player.png",
    healthBar: "assets/choice-runner/health-bar.png",
    firepowerLevel1: "assets/choice-runner/firepower-level-1.png",
    firepowerLevel2: "assets/choice-runner/firepower-level-2.png",
    gatePositive: "assets/choice-runner/gate-positive.png",
    gateNegative: "assets/choice-runner/gate-negative.png",
    arrowLeft: "assets/choice-runner/arrow-left.png",
    arrowRight: "assets/choice-runner/arrow-right.png",
    finger: "assets/choice-runner/finger.png",
    bucket: "assets/choice-runner/supplement-shipment.png",
    gun1: "assets/choice-runner/supplement-item-firepower-1.png",
    gun2: "assets/choice-runner/supplement-item-firepower-2.png",
    army: "assets/choice-runner/supplement-item-army.png",
    endBannerDefeat: "assets/choice-runner/end-banner-defeat.png",
    endBannerVictory: "assets/choice-runner/end-banner-victory.png",
    endButton: "assets/choice-runner/end-button.png",
  },
  text: {
    restartButton: "Restart",
    playAgain: "Play Again",
    winText: "Victory",
    loseText: "Defeat!",
    instructions: "Match 3 or more tiles to deal damage to the enemy castle!",
    movesLabel: "Moves: ",
  },
} satisfies GameAssets;

export const gameAssets = deepMerge(
  structuredClone(defaultGameAssets),
  getOverrides(GAME_NAME) as Partial<GameAssets>
);

export const GAME_ASSET_KEYS = Object.keys(defaultGameAssets.assets).reduce(
  (acc, key) => {
    acc[key as MatchFightAssetKeys] = key;
    return acc;
  },
  {} as Record<MatchFightAssetKeys, string>
);

//#region Builder Mappings

//#endregion
