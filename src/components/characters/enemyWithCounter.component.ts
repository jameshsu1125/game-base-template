import { BitmapMask, Container, Sprite } from "@/configs/constants/constants";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
import { Easing } from "@/configs/constants/layout.constants";
import { enemyEntityConfig } from "@/configs/presets/enemy.preset";
import {
  enemyPreset,
  firepowerPreset,
  gamePreset,
} from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import MainScene from "@/scenes/main.scene";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";
import { enemyDeadEffect, hitEnemyEffect } from "./enemy.config";

export default class EnemyWithCounterComponent extends Container {
  private isDestroyed = false;
  private defaultScale = 1;
  public enemyName = "";

  public enemy: Sprite | null = null;
  public blood: number = 100;
  public maxBlood: number = 100;

  public healthBarBorder = this.scene.add.graphics();
  public healthBarMask = this.scene.make.graphics({});
  public healthBar = this.scene.add.image(0, 0, GAME_ASSET_KEYS.healthBar);
  public mask = new BitmapMask(this.scene, this.healthBarMask);

  private graphicsName = "glow-particle";
  private graphics = this.scene.make.graphics();

  private removeStateByName: (name: string) => void;
  private decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void;
  private decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void;
  private onGameVictory: () => void;
  private sheetName: string;

  private config?: (typeof enemyEntityConfig)[number]["data"];

  constructor(
    scene: Phaser.Scene,
    name: string,
    config: (typeof enemyEntityConfig)[number]["data"],
    removeStateByName: (name: string) => void,
    decreaseEnemyBlood: (
      enemy: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void,
    decreasePlayerBlood: (
      player: Phaser.Physics.Arcade.Sprite,
      enemy: Phaser.Physics.Arcade.Sprite
    ) => void,
    onGameVictory: () => void
  ) {
    super(scene, 0, 0);
    this.enemyName = name;
    this.removeStateByName = removeStateByName;
    this.decreaseEnemyBlood = decreaseEnemyBlood;
    this.decreasePlayerBlood = decreasePlayerBlood;
    this.onGameVictory = onGameVictory;

    this.config = config;
    this.sheetName =
      this.config.blood.type === "boss" ? "bossSheet" : "enemySheet";
    this.blood = config.blood.value;
    this.maxBlood = config.blood.max;

    this.healthBarBorder.setDepth(999);
    this.healthBarMask.setDepth(999);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(999);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(16, 16, 16);
    this.graphics.generateTexture(this.graphicsName, 32, 32);
    this.graphics.destroy();

    this.build();
    this.setHealthBar();
  }

  private build(): void {
    const { ratios, randomWidth } = enemyPreset;

    this.enemy = this.scene.physics.add.staticSprite(0, 0, this.sheetName);

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.enemy,
      this.config?.blood.type === "ghost" ? ratios.ghost : ratios.boss
    );
    const randomX =
      (this.scene.scale.width - randomWidth) / 2 + (this.config?.x || 0);
    this.enemy.setName(this.enemyName);
    this.enemy.setDisplaySize(width, height);
    this.enemy.setOrigin(0.5, 0.5);
    this.enemy.setPosition(randomX, -height / 2);
    this.enemy.setDepth((this.scene as MainScene).getIndex());

    this.defaultScale = this.enemy.scale;

    this.enemy.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers(this.sheetName, {
        start: 0,
        end: 7,
      }),
      frameRate: 8,
      repeat: -1,
    });
    this.enemy.play("run", true);

    if (!STOP_COLLISION) this.addCollision(this.enemy);
  }

  private addCollision(enemy: Phaser.Physics.Arcade.Sprite) {
    const layoutContainers =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    if (layoutContainers.firepower) {
      layoutContainers.firepower?.firepowerContainer.forEach((firepower) => {
        this.scene.physics.add.collider(
          enemy,
          firepower,
          () => this.decreaseEnemyBlood(enemy, firepower),
          undefined,
          this.scene
        );
        this.scene.physics.add.overlap(
          enemy,
          firepower,
          () => this.decreaseEnemyBlood(enemy, firepower),
          undefined,
          this.scene
        );
      });
    }

    if (layoutContainers.player) {
      layoutContainers.player.players.forEach((player) => {
        if (!player.player) return;
        this.scene.physics.add.collider(
          enemy,
          player.player,
          () => this.decreasePlayerBlood(player.player!, enemy),
          undefined,
          this.scene
        );
        this.scene.physics.add.overlap(
          enemy,
          player.player,
          () => this.decreasePlayerBlood(player.player!, enemy),
          undefined,
          this.scene
        );
      });
    }
  }

  private setHealthBar(): void {
    if (!this.enemy) return;
    const { offsetY, width, height } =
      this.config?.blood.type === "ghost"
        ? enemyPreset.healthBar.ghost
        : enemyPreset.healthBar.boss;

    const { scale, displayHeight } = this.enemy;
    const currentWidth = width * scale;
    const currentHeight = height * scale;

    const x = this.enemy.x;
    const y = this.enemy.y;

    const currentX = x - currentWidth / 2;
    const currentY = y - displayHeight / 2 + offsetY;
    const gap = 2 * scale;

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
      currentX + gap,
      currentY + gap,
      currentWidth - gap * 2,
      currentHeight - gap * 2,
      (currentHeight - gap * 2) * 0.5
    );

    const percent = this.blood / this.maxBlood;
    this.healthBar.setPosition(currentX, currentY);
    this.healthBar.setDisplaySize(currentWidth * percent, currentHeight);
    this.healthBar.setMask(this.mask);
  }

  public setPxy(x: number, y: number) {
    this.enemy?.setPosition(x, y);
    this.enemy?.refreshBody();
    this.setHealthBar();
  }

  public update(): void {
    if (!this.enemy || this.isDestroyed) return;
    const { perspective } = gamePreset;

    const scale =
      this.defaultScale -
      this.defaultScale *
        (1 - perspective) *
        (Math.abs(this.scene.scale.height - this.enemy.y) /
          this.scene.scale.height);
    this.enemy.setScale(scale, scale);
    this.setHealthBar();

    if (this.enemy.y > this.scene.scale.height - 150) {
      this.destroy();
      this.removeStateByName(this.enemyName);
    }
  }

  setVisibility(value: boolean) {
    this.enemy?.setVisible(value);
    this.healthBarBorder.setVisible(value);
    this.healthBarMask.setVisible(value);
    this.healthBar.setVisible(value);
  }

  public loseBlood(): void {
    if (!this.enemy || this.isDestroyed) return;
    const { damage } = firepowerPreset;

    const layoutContainers =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    const currentDamage =
      layoutContainers.firepower.level === 1 ? damage.level1 : damage.level2;
    this.blood -= currentDamage;

    hitEnemyEffect(this.enemy);

    if (this.blood <= 0) {
      this.scene.sound
        .add(GAME_ASSET_KEYS.audioEnemyDead)
        .play({ volume: 0.2 });
      this.destroy();
      this.removeStateByName(this.enemyName);

      if (this.config?.blood.type === "boss") {
        this.onGameVictory();
      }
    }
  }

  public destroy(): void {
    this.isDestroyed = true;

    // TODO=> add effects here

    if (this.enemy)
      enemyDeadEffect(
        this.enemy,
        this.graphicsName,
        () => {
          [this.healthBarBorder, this.healthBarMask, this.healthBar].forEach(
            (item) => {
              item.setVisible(false);
              item.destroy();
            }
          );
          this.mask.destroy();
        },
        () => {
          // Remove enemy from the scene
          this.enemy!.destroy(true);
          this.removeStateByName(this.enemyName);
        }
      );
  }

  public setPositionByPercentage(percentage: number) {
    const { enemy } = this;
    if (!enemy || this.isDestroyed) return;
    const { player } =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    const currentPercent = Easing(percentage);
    const [playerComponent] = player.players;
    const playerX = playerComponent?.player?.x || 0;

    const x =
      this.config?.type === "follow" &&
      this.enemy!.y > this.scene.scale.height / 3
        ? this.enemy!.x + (playerX - this.enemy!.x) / 200
        : this.enemy!.x +
          (this.enemy!.x > this.scene.scale.width / 2
            ? 0.5 * currentPercent
            : -0.5 * currentPercent);

    const y = (this.scene.scale.height + enemy.displayHeight) * currentPercent;

    this.setPxy(x, y);
    this.update();
  }
}
