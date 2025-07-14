import { LOGO_WIDTH_SCALE_RATIO } from "../../configs/constants/layout.constants";
import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "../../utils/layout.utils";

export class LogoComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.logo);
    const { width, height } = getDisplaySizeByWidthPercentage(
      image,
      LOGO_WIDTH_SCALE_RATIO
    );
    image.setDisplaySize(width, height);
    image.setPosition(
      0,
      getDisplayPositionByBorderAlign(image, this.scene, "TOP")
    );

    this.add(image);
  }
}
