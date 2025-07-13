import Phaser from "phaser";
import { VICTORY_OFFSET_Y } from "../configs/constants/layout.constants";
import {
  GAME_ASSET_KEYS,
  gameAssets,
} from "../features/asset-management/game-assets";
import BaseLayoutManager from "../managers/layout/base-layout.manager";
import { getDisplaySizeByWidthPercentage } from "../utils/layout.utils";

export enum EndGameResult {
  VICTORY = "VICTORY",
  DEFEAT = "DEFEAT",
}

export interface ResultComponentConfig {
  type: EndGameResult;
  onRestart?: () => void;
}

export class EndScreenOverlayComponent extends Phaser.GameObjects.Container {
  private layoutManager: BaseLayoutManager;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.layoutManager = new BaseLayoutManager(scene);
    this.setVisible(false);
  }

  public show(config: ResultComponentConfig): void {
    if (config.type === EndGameResult.VICTORY) {
      this.scene.sound.play(GAME_ASSET_KEYS.winSound);
    }
    this.createContent(config);
    this.setVisible(true);

    if (this.parentContainer) {
      this.parentContainer.bringToTop(this);
    }
  }

  public hide(): void {
    this.setVisible(false);
    this.removeAll(true);
  }

  private createContent(config: ResultComponentConfig): void {
    const { type, onRestart } = config;
    const isVictory = type === EndGameResult.VICTORY;

    const frameKey = isVictory
      ? GAME_ASSET_KEYS.victoryFrame
      : GAME_ASSET_KEYS.defeatFrame;
    const titleText = isVictory
      ? gameAssets.text.winText
      : gameAssets.text.loseText;

    // Add dark background overlay
    const darkBg = this.scene.add.rectangle(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.5
    );
    darkBg.setOrigin(0.5);
    this.add(darkBg);

    const resultFrame = this.scene.add.image(0, 0, frameKey);
    resultFrame.setOrigin(0.5);
    resultFrame.setPosition(0, this.scene.scale.height * VICTORY_OFFSET_Y);
    const { width, height } = getDisplaySizeByWidthPercentage(resultFrame, 0.8);
    resultFrame.setDisplaySize(width, height);
    this.add(resultFrame);

    const resultText = this.scene.add.text(0, 0, titleText.toUpperCase(), {
      fontSize: "28px",
      color: "#FFFFFF",
      fontStyle: "bold",
      fontFamily: "Arial",
    });
    resultText.setOrigin(0.5);
    this.add(resultText);
    this.layoutManager.placeBelow(resultFrame, resultText, -70);

    const ctaButton = this.scene.add
      .image(0, 0, GAME_ASSET_KEYS.ctaButtonFrame)
      .setInteractive({ useHandCursor: true });
    ctaButton.setOrigin(0.5);
    const { width: ctaButtonWidth, height: ctaButtonHeight } =
      getDisplaySizeByWidthPercentage(ctaButton, 0.6);
    ctaButton.setDisplaySize(ctaButtonWidth, ctaButtonHeight);
    this.add(ctaButton);

    this.layoutManager.placeBelow(resultFrame, ctaButton, 20);

    const ctaText = this.scene.add.text(
      ctaButton.x,
      ctaButton.y,
      gameAssets.text.playAgain.toUpperCase(),
      {
        fontSize: "24px",
        color: "#FFFFFF",
        fontStyle: "bold",
        fontFamily: "Arial",
      }
    );
    ctaText.setOrigin(0.5);
    this.add(ctaText);

    if (onRestart) {
      ctaButton.on("pointerdown", () => {
        this.hide();
        onRestart();
      });
    }
  }
}
