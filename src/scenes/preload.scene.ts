// PreloadScene: Loads all assets for the merge game
import Phaser from "phaser";
import { gameAssets } from "../features/asset-management/game-assets";
import { loadAssetsFromMap } from "../features/asset-management/load-assets-from-map";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    loadAssetsFromMap(this, gameAssets.assets);
    this.load.spritesheet(
      "playerSheet",
      "assets/choice-runner/player-sheet.png",
      {
        frameWidth: 128,
        frameHeight: 224,
      }
    );

    this.load.spritesheet(
      "enemySheet",
      "assets/choice-runner/enemy-sheet.png",
      {
        frameWidth: 127,
        frameHeight: 133,
      }
    );

    this.load.spritesheet(
      "bossSheet",
      "assets/choice-runner/enemy-boss-sheet.png",
      {
        frameWidth: 297,
        frameHeight: 165,
      }
    );
  }

  create() {
    this.scene.start("MainScene");
  }
}
