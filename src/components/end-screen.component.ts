import {
  END_CARD_BUTTON_OFFSET_Y,
  END_CARD_BUTTON_WIDTH_SCALE_RATIO,
  END_CARD_RESULT_OFFSET_Y,
  END_CARD_RESULT_WIDTH_SCALE_RATIO,
} from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import Phaser from "phaser";

export type EndGameResult = "VICTORY" | "DEFEAT";
export interface ResultComponentConfig {
  type: EndGameResult;
  onRestart?: () => void;
}

export class EndScreenOverlayComponent extends Phaser.GameObjects.Container {
  public gameResult: EndGameResult = "VICTORY";
  public elements: (Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image)[] =
    [];

  private card: Phaser.GameObjects.Image | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
    this.setVisibility(false);
  }

  private build(): void {
    this.createDarkScreen();
    this.createResultCard();
    this.createButton();
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
    darkScreen.setOrigin(0, 0);
    darkScreen.setDepth(4);
    this.elements.push(darkScreen);
  }

  private createResultCard(): void {
    const assets =
      this.gameResult === "VICTORY"
        ? GAME_ASSET_KEYS.endCardVictory
        : GAME_ASSET_KEYS.endCardDefeat;

    const image = this.scene.add.image(0, 0, assets);
    const { width, height } = getDisplaySizeByWidthPercentage(
      image,
      END_CARD_RESULT_WIDTH_SCALE_RATIO
    );
    image.setDisplaySize(width, height);
    const { left, top } = getDisplayPositionAlign(image, "CENTER_CENTER");
    image.setPosition(left, top + END_CARD_RESULT_OFFSET_Y);
    image.setDepth(4);
    this.card = image;
    this.elements.push(image);
  }

  private createButton(): void {
    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.endCardPlayAgain);
    const { width, height } = getDisplaySizeByWidthPercentage(
      image,
      END_CARD_BUTTON_WIDTH_SCALE_RATIO
    );
    image.setDisplaySize(width, height);
    const { left, top } = getDisplayPositionAlign(image, "CENTER_CENTER");
    image.setPosition(left, top + END_CARD_BUTTON_OFFSET_Y);
    image.setDepth(4);

    image.setInteractive();
    image.on("pointerdown", () => {
      location.reload();
    });

    this.elements.push(image);
  }

  setVisibility(visible: boolean): void {
    this.elements.forEach((element) => {
      if (visible && this.card) {
        this.card.setTexture(
          this.gameResult === "VICTORY"
            ? GAME_ASSET_KEYS.endCardVictory
            : GAME_ASSET_KEYS.endCardDefeat
        );
      }
      element.setVisible(visible);
    });
  }
}
