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
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
    this.setVisible(false);
  }

  private build(): void {
    const image = this.scene.add
      .text(0, 0, "End Screen Overlay", {
        fontSize: "32px",
        color: "#FFFFFF",
        backgroundColor: "#000000",
        fontStyle: "bold",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    this.add(image);
  }

  public show(): void {
    this.setVisible(true);
    if (this.parentContainer) {
      this.parentContainer.bringToTop(this);
    }
  }
}
