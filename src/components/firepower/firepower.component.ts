import Phaser from "phaser";
import {
  FIREPOWER_OFFSET_Y,
  FIREPOWER_WIDTH_SCALE_RATIO,
} from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplaySizeByWidthPercentage,
  getDisplayPositionByBorderAlign,
} from "../../utils/layout.utils";
import { PlayerComponent } from "../characters/player.component";

export class FirepowerComponent extends Phaser.GameObjects.Container {
  private player: PlayerComponent;

  private isStarted = false;
  public level = 1;

  constructor(scene: Phaser.Scene, player: PlayerComponent) {
    super(scene, 0, 0);
    this.player = player;
    this.build();
  }

  private build(): void {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xff0066, 1);
    graphics.fillRect(
      -FIREPOWER_OFFSET_Y,
      -FIREPOWER_OFFSET_Y,
      FIREPOWER_OFFSET_Y * 2,
      FIREPOWER_OFFSET_Y * 2
    );
    this.add(graphics);

    if (this.player && this.player.player) {
      this.setPosition(
        0,
        getDisplayPositionByBorderAlign(
          this.player.player,
          this.scene,
          "BOTTOM"
        ) -
          this.player.player.displayHeight * 0.5 -
          FIREPOWER_OFFSET_Y
      );
    }
  }

  public fire(): void {
    if (!this.isStarted || !this.player || !this.player.player) return;

    const firepower = this.scene.add.sprite(
      this.x,
      this.y,
      this.level === 1
        ? GAME_ASSET_KEYS.firepowerLevel1
        : GAME_ASSET_KEYS.firepowerLevel2
    );
    const { width, height } = getDisplaySizeByWidthPercentage(
      firepower,
      FIREPOWER_WIDTH_SCALE_RATIO
    );
    firepower.setDisplaySize(width, height);
    firepower.setPosition(0, 0 - firepower.displayHeight * 0.5);
    this.add(firepower);
  }

  public update(playerX: number): void {
    if (!this.isStarted) return;
    this.x = playerX;
  }

  public onStart(): void {
    this.isStarted = true;
  }
}
