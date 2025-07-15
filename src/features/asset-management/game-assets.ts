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

    enemyAvatar: string;
    enemyAvatarContainer: string;
    enemyAvatarContainerOuterShadow: string;
    enemyAvatarContainerInnerShadow: string;
    enemyAvatarContainerWithShadow: string;
    gameBoardContainer: string;
    enemy: string;
    archEnemy: string;
    healthBarContainer: string;
    gameLogo: string;
    ctaButtonFrame: string;
    moveContainer: string;
    victoryFrame: string;
    defeatFrame: string;
    winSound: string;
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

    enemyAvatar: "assets/match-fight/enemy-avatar.png",
    enemyAvatarContainer: "assets/match-fight/enemy-avatar-container.svg",
    enemyAvatarContainerOuterShadow:
      "assets/match-fight/enemy-avatar-container-outer-shadow.svg",
    enemyAvatarContainerInnerShadow:
      "assets/match-fight/enemy-avatar-container-inner-shadow.svg",
    enemyAvatarContainerWithShadow:
      "assets/match-fight/enemy-avatar-container-with-shadow.svg",
    gameBoardContainer: "assets/match-fight/game-board-container.svg",
    enemy: "assets/match-fight/enemy.png",
    archEnemy: "assets/match-fight/arch-enemy.png", // Will be rendered as emoji/shape in code
    healthBarContainer: "assets/match-fight/health-bar-container.png", // Will be rendered as emoji/shape in code
    gameLogo: "assets/match-fight/game-logo.png", // Will be rendered as emoji/shape in code
    ctaButtonFrame: "assets/match-fight/cta-button-frame.png", // Will be rendered as emoji/shape in code
    moveContainer: "assets/match-fight/moves-container.png",
    victoryFrame: "assets/match-fight/victory-frame.png",
    defeatFrame: "assets/match-fight/defeat-frame.png",
    winSound: "assets/match-fight/sound/win.mp3",
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
