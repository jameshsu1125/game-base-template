import {
  LANDING_ARROW_LEFT_WIDTH_SCALE_RATIO,
  LANDING_ARROW_OFFSET_Y,
  LANDING_ARROW_RIGHT_WIDTH_SCALE_RATIO,
  LANDING_FINGER_WIDTH_SCALE_RATIO,
} from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import Phaser from "phaser";

export class LandingComponent extends Phaser.GameObjects.Container {
  private fingerWidth: number = 0;
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
  }

  private build(): void {
    this.createFinger();
    this.createArrows();
  }

  private createArrows(): void {
    const arrowLeft = this.scene.add.image(0, 0, GAME_ASSET_KEYS.arrowLeft);
    const arrowRight = this.scene.add.image(0, 0, GAME_ASSET_KEYS.arrowRight);

    const { width: leftWidth, height: leftHeight } =
      getDisplaySizeByWidthPercentage(
        arrowLeft,
        LANDING_ARROW_LEFT_WIDTH_SCALE_RATIO
      );
    const { width: rightWidth, height: rightHeight } =
      getDisplaySizeByWidthPercentage(
        arrowRight,
        LANDING_ARROW_RIGHT_WIDTH_SCALE_RATIO
      );

    arrowLeft.setDisplaySize(leftWidth, leftHeight);
    arrowRight.setDisplaySize(rightWidth, rightHeight);

    arrowLeft.setPosition(
      0 - this.fingerWidth / 2 - leftWidth / 2,
      getDisplayPositionByBorderAlign(arrowLeft, this.scene, "BOTTOM") +
        LANDING_ARROW_OFFSET_Y
    );
    arrowRight.setPosition(
      0 + this.fingerWidth / 2 + rightWidth / 2,
      getDisplayPositionByBorderAlign(arrowLeft, this.scene, "BOTTOM") +
        LANDING_ARROW_OFFSET_Y
    );

    this.add([arrowLeft, arrowRight]);
  }

  private createFinger(): void {
    const finger = this.scene.add.image(0, 0, GAME_ASSET_KEYS.finger);
    const { width, height } = getDisplaySizeByWidthPercentage(
      finger,
      LANDING_FINGER_WIDTH_SCALE_RATIO
    );
    const y = getDisplayPositionByBorderAlign(finger, this.scene, "BOTTOM");

    finger.setDisplaySize(width, height);
    finger.setPosition(0, y);
    this.fingerWidth = width;

    this.add(finger);
  }
}
