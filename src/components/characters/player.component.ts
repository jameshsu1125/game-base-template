import Phaser from "phaser";
import { PLAYER_WIDTH_SCALE_RATIO } from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplaySizeByWidthPercentage,
  getDisplayPositionByBorderAlign,
} from "../../utils/layout.utils";
import {
  PLAYER_COMPONENT_HEALTH_BAR_SIZE,
  PLAYER_COMPONENT_SIZE,
} from "./player.config";
import { PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD } from "@/configs/constants/game.constants";

export class PlayerComponent extends Phaser.GameObjects.Container {
  public player: Phaser.Physics.Arcade.Sprite | null = null;
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
      getDisplayPositionByBorderAlign(this.player, this.scene, "BOTTOM")
    );
    this.add(this.player);
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.createHealthBar();
  }

  private createHealthBar(): void {
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

  private setCurrentPositionByUserInput(targetX: number, deltaX: number): void {
    const minX =
      -this.scene.scale.width * 0.5 + this.player!.displayWidth * 0.5;
    const maxX = this.scene.scale.width * 0.5 - this.player!.displayWidth * 0.5;
    const currentX = targetX < minX ? minX : targetX > maxX ? maxX : targetX;
    this.x = currentX;
  }

  public onStart(): void {
    this.isStarted = true;
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.touchState.isDown = true;
      this.touchState.playerX = this.x;
      this.touchState.pointerX = pointer.x;
    });
    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.touchState.isDown) {
        const deltaX = pointer.x - this.touchState.pointerX;
        const targetX = this.touchState.playerX + deltaX;
        this.setCurrentPositionByUserInput(targetX, deltaX);
      }
    });
    this.scene.input.on("pointerup", () => {
      this.touchState.isDown = false;
    });
  }

  update(): void {
    if (!this.cursors || !this.player || !this.isStarted) return;
    const deltaX = this.cursors.left.isDown
      ? -PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : this.cursors.right.isDown
      ? PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : 0;
    const targetX = this.x + deltaX;
    this.setCurrentPositionByUserInput(targetX, deltaX);
  }
}
