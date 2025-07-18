import { END_CARD_RESULT_WIDTH_SCALE_RATIO } from "@/configs/constants/layout.constants";
import { gameAssets } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import Phaser from "phaser";

export enum EndGameResult {
  VICTORY = "VICTORY",
  DEFEAT = "DEFEAT",
}

export interface ResultComponentConfig {
  type: EndGameResult;
  onRestart?: () => void;
}

export class EndScreenOverlayComponent extends Phaser.GameObjects.Container {
  public result: "victory" | "defeat" = "defeat";

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
  }

  private build(): void {
    this.createDarkScreen();
    this.createResult();
  }

  private createDarkScreen(): void {
    const darkScreen = this.scene.add.rectangle(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.5
    );
    darkScreen.setDepth(4);
    darkScreen.setOrigin(0, 0);
  }

  private createResult(): void {
    const assets =
      this.result === "victory"
        ? gameAssets.assets.endCardVictory
        : gameAssets.assets.endCardDefeat;

    console.log(assets);

    const result = this.scene.add.image(0, 0, assets);

    const { width, height } = getDisplaySizeByWidthPercentage(
      result,
      END_CARD_RESULT_WIDTH_SCALE_RATIO
    );

    result.setSize(width, height);

    const { left, top } = getDisplayPositionAlign(result, "CENTER_CENTER");
    result.setPosition(left, top);

    result.setDepth(4);
  }

  public show(): void {
    this.setVisible(true);
    if (this.parentContainer) {
      this.parentContainer.bringToTop(this);
    }
  }
}
