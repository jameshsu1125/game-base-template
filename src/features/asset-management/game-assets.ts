// Game asset and text configuration for Match & Fight Game
// This object is the single source of truth for all asset paths and customizable text.
// To override assets/text at runtime (e.g., from a game builder), set localStorage.matchFight (preferred) or window.matchFight before the game loads.
// Example:
//   localStorage.setItem('matchFight', JSON.stringify({ assets: { background: 'custom-bg.png' }, text: { winText: 'Victory!' } }))
//
// The game will merge these overrides with the defaults below.

import deepMerge from "../../_NOT_STANDALONE_GAME_RELATED/deep-merge";
import getOverrides from "../../_NOT_STANDALONE_GAME_RELATED/get-overrides";
import { MATCH_FIGHT_GAME_NAME } from "../../configs/constants/constants";

export interface GameAssets {
    assets: {
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
        background: string;
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
        background: "assets/match-fight/background.png",

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
        instructions:
            "Match 3 or more tiles to deal damage to the enemy castle!",
        movesLabel: "Moves: ",
    },
} satisfies GameAssets;

export const gameAssets = deepMerge(
    structuredClone(defaultGameAssets),
    getOverrides(MATCH_FIGHT_GAME_NAME) as Partial<GameAssets>
);

export const MATCH_FIGHT_ASSET_KEYS = Object.keys(
    defaultGameAssets.assets
).reduce((acc, key) => {
    acc[key as MatchFightAssetKeys] = key;
    return acc;
}, {} as Record<MatchFightAssetKeys, string>);

//#region Builder Mappings

//#endregion

