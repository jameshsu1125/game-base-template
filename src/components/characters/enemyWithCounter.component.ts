import { BitmapMask, Container, Sprite } from "@/configs/constants/constants";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
import { Easing } from "@/configs/constants/layout.constants";
import {
  enemyPreset,
  firepowerPreset,
  gamePreset,
} from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";

export default class EnemyWithCounterComponent extends Container {
  private isDestroyed = false;
  private defaultScale = 1;
  public enemyName = "";

  public enemy: Sprite | null = null;
  public blood: number = 100;

  public healthBarBorder = this.scene.add.graphics();
  public healthBarMask = this.scene.make.graphics({});
  public healthBar = this.scene.add.image(0, 0, GAME_ASSET_KEYS.healthBar);
  public mask = new BitmapMask(this.scene, this.healthBarMask);

  private removeStateByName: (name: string) => void;
  private decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void;
  private decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void;

  private config?: {
    x: number;
    type: "follow" | "straight";
  };

  constructor(
    scene: Phaser.Scene,
    name: string,
    config: {
      x: number;
      type: "follow" | "straight";
    },
    removeStateByName: (name: string) => void,
    decreaseEnemyBlood: (
      enemy: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void,
    decreasePlayerBlood: (
      player: Phaser.Physics.Arcade.Sprite,
      enemy: Phaser.Physics.Arcade.Sprite
    ) => void
  ) {
    super(scene, 0, 0);
    this.enemyName = name;
    this.removeStateByName = removeStateByName;
    this.decreaseEnemyBlood = decreaseEnemyBlood;
    this.decreasePlayerBlood = decreasePlayerBlood;

    this.config = config;

    this.healthBarBorder.setDepth(1);
    this.healthBarMask.setDepth(3);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(2);
    this.build();
    this.setHealthBar();
  }

  private build(): void {
    const { ratio, randomWidth } = enemyPreset;
    this.enemy = this.scene.physics.add.staticSprite(0, 0, "enemySheet");

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.enemy,
      ratio
    );
    const randomX =
      (this.scene.scale.width - randomWidth) / 2 + (this.config?.x || 0);
    this.enemy.setName(this.enemyName);
    this.enemy.setDisplaySize(width, height);
    this.enemy.setOrigin(0.5, 0.5);
    this.enemy.setPosition(randomX, -height / 2);

    this.defaultScale = this.enemy.scale;

    this.enemy.anims.create({
      key: "run",
      frames: this.scene.anims.generateFrameNumbers("enemySheet", {
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
      });
    }
  }

  private setHealthBar(): void {
    if (!this.enemy) return;
    const { offsetY, width, height } = enemyPreset.healthBar;

    const { scale, displayWidth, displayHeight } = this.enemy;
    const currentWidth = width * scale;
    const currentHeight = height * scale;

    const x = this.enemy.x;
    const y = this.enemy.y;

    const currentX = x - (displayWidth - currentWidth) / 2;
    const currentY = y - displayHeight / 2 + offsetY;

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

    if (this.blood <= 0) {
      this.destroy();
      this.removeStateByName(this.enemyName);
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.healthBarBorder.destroy();
    this.healthBarMask.destroy();
    this.healthBar.destroy();
    this.mask.destroy();
    if (this.enemy) {
      this.enemy.destroy(true);
      this.enemy = null;
    }
    super.destroy();
  }

  public setPositionByPercentage(percentage: number) {
    const { enemy } = this;
    if (!enemy || this.isDestroyed) return;

    const { player } =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    const currentPercent = Easing(percentage);
    const x =
      this.config?.type === "follow"
        ? this.enemy!.x +
          ((player.players[0].player?.x || 0) - this.enemy!.x) / 500
        : this.enemy!.x;

    const y = (this.scene.scale.height + enemy.displayHeight) * currentPercent;

    this.setPxy(x, y);
    this.update();
  }
}
