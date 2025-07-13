import { LOGO_WIDTH_SCALE_RATIO } from "../../configs/constants/layout.constants";
import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { getDisplaySizeByWidthPercentage } from "../../utils/layout.utils";

export class FirepowerComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.logo);
    const { width, height } = getDisplaySizeByWidthPercentage(image, 0.11);
    image.setDisplaySize(width, height);
    image.setPosition(0, 0);
    this.add(image);
    this.setPosition(0, this.scene.cameras.main.height / 2);
  }

  public update(playerX: number): void {
    if (!this.isStarted) return;
    this.x = playerX; // Update firepower position based on player position
  }

  public onStart(): void {
    this.isStarted = true;
  }
}
