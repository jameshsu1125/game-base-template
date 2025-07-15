import {
  HEALTH_BAR_OFFSET_Y,
  PLAYER_GROUP_GAP_X,
  PLAYER_OFFSET_Y,
  PLAYER_WIDTH_SCALE_RATIO,
} from "@/configs/constants/layout.constants";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import { PLAYER_COMPONENT_HEALTH_BAR_SIZE } from "./player.config";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";

export default class PlayerWidthCounterComponent extends Phaser.GameObjects
  .Container {
  private playerName: string;
  public player: Phaser.Physics.Arcade.Sprite | null = null;
  public healthBarBorder: Phaser.GameObjects.Graphics =
    this.scene.add.graphics();
  public healthBarMask: Phaser.GameObjects.Graphics = this.scene.make.graphics(
    {}
  );
  public healthBar: Phaser.GameObjects.Image = this.scene.add.image(
    0,
    0,
    GAME_ASSET_KEYS.healthBar
  );
  public healthText: Phaser.GameObjects.Text = this.scene.add.text(
    0,
    0,
    "100%",
    {
      fontSize: "7px",
      color: "#ffffff",
      fontFamily: "Arial",
      align: "center",
      fixedWidth: 32,
      fixedHeight: PLAYER_COMPONENT_HEALTH_BAR_SIZE.height - 2,
      shadow: {
        fill: true,
        color: "#000000",
        offsetX: 1,
        offsetY: 1,
        blur: 2,
        stroke: true,
      },
    }
  );
  public mask = new Phaser.Display.Masks.BitmapMask(
    this.scene,
    this.healthBarMask
  );

  public blood: number = 100;

  constructor(scene: Phaser.Scene, playerName: string) {
    super(scene, 0, 0);
    this.playerName = playerName;
    this.healthBarBorder.setDepth(1);
    this.healthBarMask.setDepth(2);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(2);
    this.healthText.setDepth(3);
    this.build();
  }

  private build(): void {
    this.addPlayer();
  }

  private addHealthBar(x: number, y: number): void {
    if (!this.player) return;
    const { scale, displayWidth, displayHeight } = this.player;
    const currentWidth = PLAYER_COMPONENT_HEALTH_BAR_SIZE.width * scale;
    const currentHeight = PLAYER_COMPONENT_HEALTH_BAR_SIZE.height * scale;

    const currentX = x - (displayWidth - currentWidth) / 2;
    const currentY = y - displayHeight / 2 + HEALTH_BAR_OFFSET_Y;

    this.healthBarBorder.clear();
    this.healthBarBorder.fillStyle(0xffffff, 1);
    this.healthBarBorder.fillRoundedRect(
      currentX,
      currentY,
      currentWidth,
      currentHeight,
      currentHeight * 0.5
    );

    this.healthBarMask.clear();
    this.healthBarMask.fillStyle(0x000000, 1);
    this.healthBarMask.fillRoundedRect(
      currentX + 2,
      currentY + 2,
      currentWidth - 4,
      currentHeight - 4,
      (currentHeight - 4) * 0.5
    );

    this.healthBar.setPosition(currentX, currentY);
    this.healthBar.setDisplaySize(currentWidth, currentHeight);
    this.healthBar.setMask(this.mask);

    this.healthText.setPosition(currentX, currentY + 3);
    this.healthText.width = currentWidth - 2;
  }

  private addPlayer(): void {
    const player = this.scene.physics.add.sprite(0, 0, "playerSheet");
    const { width, height } = getDisplaySizeByWidthPercentage(
      player,
      PLAYER_WIDTH_SCALE_RATIO
    );
    player.setName(this.playerName);
    player.setDisplaySize(width, height);

    player.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("playerSheet", {
        start: 0,
        end: 8,
      }),
      frameRate: 9,
      repeat: -1,
    });
    player.play("run", true);
    this.player = player;
  }

  public setPositionByIndex(index: number, offset: number, total: number) {
    if (this.player === null) return;

    const { left, top } = getDisplayPositionAlign(this.player, "CENTER_BOTTOM");
    const { displayWidth } = this.player;

    const maxWidth = displayWidth + PLAYER_GROUP_GAP_X * (total - 1);
    const currentX =
      left - maxWidth / 2 + PLAYER_GROUP_GAP_X * index + displayWidth / 2;

    this.player.setPosition(currentX + offset, top + PLAYER_OFFSET_Y);
    this.addHealthBar(currentX + offset, top + PLAYER_OFFSET_Y);
  }
}
