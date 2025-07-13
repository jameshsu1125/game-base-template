import Phaser from "phaser";
import { PLAYER_WIDTH_SCALE_RATIO } from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplaySizeByWidthPercentage,
  setDisplayPositionByBorderAlign,
} from "../../utils/layout.utils";
import {
  PLAYER_COMPONENT_HEALTH_BAR_SIZE,
  PLAYER_COMPONENT_SIZE,
} from "./player.config";

export class PlayerComponent extends Phaser.GameObjects.Container {
  private player: Phaser.Physics.Arcade.Sprite | null = null;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys = undefined;
  private healthBar: Phaser.GameObjects.Graphics | null = null;

  private isStarted = false;
  private touchState = { isDown: false, playerX: 0, pointerX: 0 };

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    this.player = this.scene.physics.add.sprite(
      PLAYER_COMPONENT_SIZE.width,
      PLAYER_COMPONENT_SIZE.height,
      GAME_ASSET_KEYS.player
    );
    const { width, height } = getDisplaySizeByWidthPercentage(
      this.player,
      PLAYER_WIDTH_SCALE_RATIO
    );

    this.player.setDisplaySize(width, height);
    this.player.setPosition(
      0,
      setDisplayPositionByBorderAlign(this.player, this.scene, "BOTTOM")
    );
    this.add(this.player);
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.createHealthBar();
  }

  update(): void {
    if (!this.cursors || !this.player || !this.isStarted) return;

    if (this.cursors.left.isDown) {
      this.x -= 5;
    } else if (this.cursors.right.isDown) {
      this.x += 5;
    }
  }

  createHealthBar() {
    if (!this.player) return;
    const { width, height, scale } = this.player;

    const currentX = -width * scale * 0.5;
    const currentY = this.scene.scale.height * 0.5 - height * scale;
    const currentWidth = PLAYER_COMPONENT_HEALTH_BAR_SIZE.width * scale;
    const currentHeight = PLAYER_COMPONENT_HEALTH_BAR_SIZE.height * scale;

    this.healthBar = this.scene.add.graphics();
    this.healthBar.fillStyle(0xff6600, 1);
    this.healthBar.fillRect(currentX, currentY, currentWidth, currentHeight);
    this.add(this.healthBar);
  }

  onStart(): void {
    this.isStarted = true;
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.touchState.isDown = true;
      this.touchState.playerX = this.x;
      this.touchState.pointerX = pointer.x;
    });
    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.touchState.isDown) {
        const deltaX = pointer.x - this.touchState.pointerX;
        this.x = this.touchState.playerX + deltaX;
      }
    });
    this.scene.input.on("pointerup", () => {
      this.touchState.isDown = false;
    });
  }
}
