import { Container, Scene } from "@/configs/constants/constants";
import { logoPreset } from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign as getAlign,
  getDisplaySizeByWidthPercentage as getSize,
} from "../../utils/layout.utils";

export class LogoComponent extends Container {
  constructor(scene: Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    const { ratio } = logoPreset;

    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.logo);
    const { width, height } = getSize(image, ratio);
    image.setDisplaySize(width, height);
    image.setPosition(
      getAlign(image, this.scene, "LEFT"),
      getAlign(image, this.scene, "TOP")
    );
    this.add(image);
  }
}
