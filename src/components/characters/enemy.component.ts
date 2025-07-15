import {
  LOGO_WIDTH_SCALE_RATIO,
  PLAYER_WIDTH_SCALE_RATIO,
} from "../../configs/constants/layout.constants";
import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "../../utils/layout.utils";

export class EnemyComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    const image = this.scene.add.sprite(0, 0, "enemySheet");
    const { width, height } = getDisplaySizeByWidthPercentage(
      image,
      PLAYER_WIDTH_SCALE_RATIO
    );
    image.setDisplaySize(width, height);
    image.setPosition(
      0,
      getDisplayPositionByBorderAlign(image, this.scene, "TOP")
    );

    this.add(image);
  }
}
