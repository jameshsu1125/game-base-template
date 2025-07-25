// PreloadScene: Loads all assets for the merge game
import Phaser from "phaser";
import { gameAssets } from "../features/asset-management/game-assets";
import { loadAssetsFromMap } from "../features/asset-management/load-assets-from-map";
import { SpriteConfig } from "@/types/sprite-config.types";
import spriteConfig from "@/configs/sprite-config.json";

export default class PreloadScene extends Phaser.Scene {
  private config: SpriteConfig;

  constructor() {
    super("PreloadScene");
    this.config = spriteConfig as SpriteConfig;
  }

  preload() {
    loadAssetsFromMap(this, gameAssets.assets);
    this.load.spritesheet(
      "playerSheet",
      "assets/choice-runner/player-sheet.png",
      {
        frameWidth: this.config.player.frameWidth,
        frameHeight: this.config.player.frameHeight,
      }
    );

    this.load.spritesheet(
      "enemySheet",
      "assets/choice-runner/enemy-sheet.png",
      {
        frameWidth: this.config.enemy.frameWidth,
        frameHeight: this.config.enemy.frameHeight,
      }
    );

    this.load.spritesheet(
      "bossSheet",
      "assets/choice-runner/enemy-boss-sheet.png",
      {
        frameWidth: this.config.enemyBoss.frameWidth,
        frameHeight: this.config.enemyBoss.frameHeight,
      }
    );
  }

  create() {
    this.scene.start("MainScene");
  }
}
