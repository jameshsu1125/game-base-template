import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "../../utils/layout.utils";
import { logoPreset } from "@/configs/presets/layout.preset";

export class LogoComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    const { ratio } = logoPreset;

    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.logo);
    const { width, height } = getDisplaySizeByWidthPercentage(image, ratio);
    image.setDisplaySize(width, height);
    image.setPosition(
      getDisplayPositionByBorderAlign(image, this.scene, "LEFT"),
      getDisplayPositionByBorderAlign(image, this.scene, "TOP")
    );
    this.add(image);

    image.parentContainer.setDepth(1000);
  }

  update() {
    if (this.parentContainer) {
      this.parentContainer.bringToTop(this);
      this.setDepth(1000);
    }
  }
}
