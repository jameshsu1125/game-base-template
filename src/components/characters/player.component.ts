import Phaser from "phaser";
import {
  PLAYER_GROUP_GAP_X,
  PLAYER_OFFSET_Y,
  PLAYER_WIDTH_SCALE_RATIO,
} from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import {
  getDisplaySizeByWidthPercentage,
  getDisplayPositionByBorderAlign,
  getDisplayPositionAlign,
} from "../../utils/layout.utils";
import {
  PLAYER_COMPONENT_HEALTH_BAR_SIZE,
  PLAYER_COMPONENT_SIZE,
} from "./player.config";
import { PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD } from "@/configs/constants/game.constants";
import {
  GAME_MECHANIC_CONFIG_SCHEMA,
  GAME_MECHANIC_CONSTANTS,
} from "@/configs/constants/game-mechanic/game-mechanic.constants";

export class PlayerComponent extends Phaser.GameObjects.Container {
  public group: Phaser.Physics.Arcade.StaticGroup | null = null;
  public players: Phaser.Physics.Arcade.Sprite[] = [];
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys = undefined;
  private healthBarBorder: Phaser.GameObjects.Graphics | null = null;
  private healthBarMask: Phaser.GameObjects.Graphics | null = null;
  private healthBar: Phaser.GameObjects.Image | null = null;
  private healthText: Phaser.GameObjects.Text | null = null;

  private isStarted = false;
  private touchState = { isDown: false, playerX: 0, pointerX: 0 };
  public playersCount = GAME_MECHANIC_CONSTANTS.playerReinforce;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.group = this.scene.physics.add.staticGroup();

    this.createPlayer(this.playersCount);
    this.createHealthBar();
  }

  private createPlayer(count: number): void {
    const { max } = GAME_MECHANIC_CONFIG_SCHEMA.playerReinforce;
    const currentCount =
      this.players.length + count > max ? max - this.players.length : count;

    if (currentCount <= 0) return;

    [...new Array(currentCount).keys()].forEach(() => {
      const player = this.group?.create(0, 0, GAME_ASSET_KEYS.player);
      const { width, height } = getDisplaySizeByWidthPercentage(
        player,
        PLAYER_WIDTH_SCALE_RATIO
      );
      player.setDisplaySize(width, height);
      this.players.push(player);
    });
    this.calculatePlayersPosition();
  }

  private createHealthBar(): void {
    if (this.players.length === 0) return;
    const [player] = this.players;
    const { displayHeight: height, scale } = player;

    const currentWidth = PLAYER_COMPONENT_HEALTH_BAR_SIZE.width * scale;

    const x = this.scene.scale.width * 0.5 - currentWidth * 0.5 + 2;
    const y =
      this.scene.scale.height - player.displayHeight + 2 + PLAYER_OFFSET_Y;

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

  private setCurrentPositionByUserInput(targetX: number, _: number): void {
    const [player] = this.players;
    const minX = -this.scene.scale.width * 0.5 + player!.displayWidth * 0.5;
    const maxX = this.scene.scale.width * 0.5 - player!.displayWidth * 0.5;
    const currentX = targetX < minX ? minX : targetX > maxX ? maxX : targetX;
    this.x = currentX;
    this.calculatePlayersPosition(currentX);

    this.group?.refresh();
    if (this.healthBarMask) this.healthBarMask.x = currentX;
  }

  private calculatePlayersPosition(offset: number = 0): void {
    const total = this.players.length;
    this.players.forEach((player, index) => {
      const { left, top } = getDisplayPositionAlign(player, "CENTER_BOTTOM");
      const maxWidth = player.displayWidth + PLAYER_GROUP_GAP_X * (total - 1);

      const currentX =
        left -
        maxWidth / 2 +
        PLAYER_GROUP_GAP_X * index +
        player.displayWidth / 2;

      player
        .setPosition(currentX + offset, top + PLAYER_OFFSET_Y)
        .refreshBody();
    });
  }

  public increasePlayersCount(count: number = 1): void {
    this.createPlayer(count);
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

  public update(): void {
    if (!this.cursors || this.players.length === 0 || !this.isStarted) return;
    const deltaX = this.cursors.left.isDown
      ? -PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : this.cursors.right.isDown
      ? PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : 0;
    const targetX = this.x + deltaX;
    this.setCurrentPositionByUserInput(targetX, deltaX);
  }
}
