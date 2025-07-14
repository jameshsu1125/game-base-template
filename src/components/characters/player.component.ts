import Phaser from "phaser";
import {
  PLAYER_OFFSET_Y,
  PLAYER_WIDTH_SCALE_RATIO,
} from "../../configs/constants/layout.constants";
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
  private healthBarBorder: Phaser.GameObjects.Graphics | null = null;
  private healthBarMask: Phaser.GameObjects.Graphics | null = null;
  private healthBar: Phaser.GameObjects.Image | null = null;
  private healthText: Phaser.GameObjects.Text | null = null;

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
      getDisplayPositionByBorderAlign(this.player, this.scene, "BOTTOM") +
        PLAYER_OFFSET_Y
    );
    this.add(this.player);
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.createHealthBar();
  }

  private createHealthBar(): void {
    if (!this.player) return;
    const { displayHeight: height, scale } = this.player;

    const currentWidth = PLAYER_COMPONENT_HEALTH_BAR_SIZE.width * scale;

    const x = this.scene.scale.width * 0.5 - currentWidth * 0.5 + 2;
    const y =
      this.scene.scale.height - this.player.displayHeight + 2 + PLAYER_OFFSET_Y;

    const currentX = -currentWidth * 0.5;
    const currentY = this.scene.scale.height * 0.5 - height + PLAYER_OFFSET_Y;
    const currentHeight = PLAYER_COMPONENT_HEALTH_BAR_SIZE.height * scale;

    this.healthBarBorder = this.scene.add.graphics();
    this.healthBarBorder.fillStyle(0xffffff, 1);
    this.healthBarBorder.fillRoundedRect(
      currentX,
      currentY,
      currentWidth,
      currentHeight,
      currentHeight * 0.5
    );

    this.healthBarMask = this.scene.make.graphics({});
    this.healthBarMask.fillStyle(0x000000, 1);
    this.healthBarMask.fillRoundedRect(
      x,
      y,
      currentWidth - 4,
      currentHeight - 4,
      (currentHeight - 4) * 0.5
    );
    const mask = new Phaser.Display.Masks.BitmapMask(
      this.scene,
      this.healthBarMask
    );

    this.healthBar = this.scene.add.image(
      currentX,
      currentY,
      GAME_ASSET_KEYS.healthBar
    );
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDisplaySize(currentWidth, currentHeight);
    this.healthBar.setMask(mask);

    this.healthText = this.scene.add.text(currentX, currentY + 2, "100%", {
      fontSize: "7px",
      color: "#000000",
      fontFamily: "Arial",
      align: "center",
      fixedWidth: currentWidth - 2,
      fixedHeight: PLAYER_COMPONENT_HEALTH_BAR_SIZE.height - 2,
    });

    this.add(this.healthBarBorder);
    this.add(this.healthBar);
    this.add(this.healthBarMask);
    this.add(this.healthText);
  }

  private setCurrentPositionByUserInput(targetX: number, deltaX: number): void {
    const minX =
      -this.scene.scale.width * 0.5 + this.player!.displayWidth * 0.5;
    const maxX = this.scene.scale.width * 0.5 - this.player!.displayWidth * 0.5;
    const currentX = targetX < minX ? minX : targetX > maxX ? maxX : targetX;
    this.x = currentX;
    if (this.healthBarMask) this.healthBarMask.x = currentX;
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
