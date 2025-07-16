import { GAME_MECHANIC_CONFIG_SCHEMA } from "@/configs/constants/game-mechanic/game-mechanic.constants";
import {
  PLAYER_GROUP_GAP,
  PLAYER_HEALTH_BAR_OFFSET_Y,
  PLAYER_OFFSET_Y,
  PLAYER_WIDTH_SCALE_RATIO,
} from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import {
  PLAYER_COMPONENT_HEALTH_BAR_SIZE,
  PLAYER_FORMATION,
} from "./player.config";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import { ENEMY_DAMAGE } from "@/configs/constants/game.constants";

export default class PlayerWidthCounterComponent extends Phaser.GameObjects
  .Container {
  public playerName: string;
  private isDestroyed = false;
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
      color: "transparent",
      fontFamily: "monospace",
      align: "center",
      fixedWidth: 20,
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

  private decreasePlayerBlood: (
    player: Phaser.Physics.Arcade.Sprite,
    enemy: Phaser.Physics.Arcade.Sprite
  ) => void;

  private increasePlayerCount: (count: number, gateName: string) => void;
  private removePlayerByName: (name: string) => void;

  constructor(
    scene: Phaser.Scene,
    playerName: string,
    decreasePlayerBlood: (
      player: Phaser.Physics.Arcade.Sprite,
      enemy: Phaser.Physics.Arcade.Sprite
    ) => void,
    increasePlayerCount: (count: number, gateName: string) => void,
    removePlayerByName: (name: string) => void
  ) {
    super(scene, 0, 0);
    this.playerName = playerName;
    this.decreasePlayerBlood = decreasePlayerBlood;
    this.increasePlayerCount = increasePlayerCount;
    this.removePlayerByName = removePlayerByName;

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
    const currentY = y - displayHeight / 2 + PLAYER_HEALTH_BAR_OFFSET_Y;

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

    const percent = this.blood / 100;
    this.healthBar.setPosition(currentX, currentY);
    this.healthBar.setDisplaySize(currentWidth * percent, currentHeight);
    this.healthBar.setMask(this.mask);

    this.healthText.setPosition(currentX, currentY + 1);
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
    this.addCollider(player);
  }

  private addCollider(player: Phaser.Physics.Arcade.Sprite): void {
    if (!this.player) return;

    const { layoutContainers } =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager");

    layoutContainers.enemy.enemyState.forEach((enemyState) => {
      const { target } = enemyState;
      if (!target.enemy) {
        this.scene.physics.add.collider(
          player,
          target,
          () => this.decreasePlayerBlood(player, target.enemy!),
          () => {},
          this.scene
        );
      }
    });

    layoutContainers.gate.gateState.forEach((gateState) => {
      const { target } = gateState;
      this.scene.physics.add.collider(
        player,
        target,
        () => {
          this.increasePlayerCount(target.num, target.name);
          target.destroy();
        },
        () => {},
        this.scene
      );
    });
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.healthBarBorder.destroy();
    this.healthBarMask.destroy();
    this.healthBar.destroy();
    this.healthText.destroy();
    this.mask.destroy();
    if (this.player) {
      this.player.destroy(true);
      this.player = null;
    }
    super.destroy();
  }

  public loseBlood() {
    this.blood -= ENEMY_DAMAGE;

    if (this.blood <= 0) {
      if (this.blood < 0) this.blood = 0;
      this.removePlayerByName(this.playerName);
    }
  }

  public setPositionByIndex(index: number, offset: number, total: number) {
    if (this.player === null || this.isDestroyed) return;

    const currentTotal = Math.max(
      1,
      Math.min(total, GAME_MECHANIC_CONFIG_SCHEMA.playerReinforce.max)
    ) as keyof typeof PLAYER_FORMATION;

    const formation = PLAYER_FORMATION[currentTotal][index] || { x: 0, y: 0 };
    const { left, top } = getDisplayPositionAlign(this.player, "CENTER_BOTTOM");

    const currentX = left + formation.x * PLAYER_GROUP_GAP;
    const currentY = top + formation.y * PLAYER_GROUP_GAP;

    this.player.setPosition(currentX + offset, currentY + PLAYER_OFFSET_Y);
    this.addHealthBar(currentX + offset, currentY + PLAYER_OFFSET_Y);
  }
}
