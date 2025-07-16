import {
  ENEMY_FAR_RANDOM_WIDTH,
  ENEMY_HEALTH_BAR_OFFSET_Y,
  ENEMY_WIDTH_SCALE_RATIO,
  PLAYER_OFFSET_Y,
  SCENE_PERSPECTIVE,
} from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";
import { GATE_MISS_OFFSET_RATIO } from "../gate/gate.config";
import { HEALTH_BAR_TEXT_STYLE } from "./enemy.config";
import { PLAYER_COMPONENT_HEALTH_BAR_SIZE } from "./player.config";
import { STOP_COLLISION } from "@/configs/constants/game.constants";

export default class EnemyWithCounterComponent extends Phaser.GameObjects
  .Container {
  private isDestroyed = false;
  private defaultScale = 1;
  private defaultX = 0;
  private defaultY = 0;
  private defaultHealthBarScaleX = 1;
  private defaultHealthBarScaleY = 1;
  public enemyName = "";

  public enemy: Phaser.Physics.Arcade.Sprite | null = null;
  public blood: number = 100;

  public healthBarBorder = this.scene.add.graphics();
  public healthBarMask = this.scene.make.graphics({});
  public healthBar = this.scene.add.image(0, 0, GAME_ASSET_KEYS.healthBar);
  public healthText = this.scene.add.text(0, 0, "100%", HEALTH_BAR_TEXT_STYLE);
  public mask = new Phaser.Display.Masks.BitmapMask(
    this.scene,
    this.healthBarMask
  );

  private removeStateByName: (name: string) => void;

  private decreaseEnemyBlood: (
    enemy: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  private decreasePlayerBlood: (
    player: Phaser.Physics.Arcade.Sprite,
    enemy: Phaser.Physics.Arcade.Sprite
  ) => void;

  constructor(
    scene: Phaser.Scene,
    name: string,
    removeStateByName: (name: string) => void,
    randomY: number,
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

    this.defaultY = randomY;

    this.healthBarBorder.setDepth(1);
    this.healthBarMask.setDepth(3);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(2);
    this.healthText.setDepth(3);
    this.build();
    this.setHealthBar();
    this.setVisibility(false);
  }

  private build(): void {
    this.enemy = this.scene.physics.add.staticSprite(0, 0, "enemySheet");

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.enemy,
      ENEMY_WIDTH_SCALE_RATIO
    );
    const randomX =
      (this.scene.scale.width - ENEMY_FAR_RANDOM_WIDTH) / 2 +
      Math.random() * ENEMY_FAR_RANDOM_WIDTH;

    this.enemy.setName(this.enemyName);
    this.enemy.setDisplaySize(width, height);
    this.enemy.setOrigin(0.5, 0.5);
    this.enemy.setPosition(randomX, this.defaultY);

    this.defaultScale = this.enemy.scale;
    this.defaultX = randomX;

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
    const firepower =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").layoutContainers
        .firepower;

    firepower.firepowerContainer.forEach((firepower) => {
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
        () => {},
        undefined,
        this.scene
      );
    });

    // layoutContainers.player.players.forEach((player) => {
    //   if (!player.player) return;
    //   this.scene.physics.add.collider(
    //     gate,
    //     player.player,
    //     () => this.increasePlayerCount(this.num, gate.name),
    //     undefined,
    //     this.scene
    //   );
    //   this.scene.physics.add.overlap(
    //     gate,
    //     player.player,
    //     () => this.increasePlayerCount(this.num, gate.name),
    //     undefined,
    //     this.scene
    //   );
    // });
  }

  private setHealthBar(): void {
    if (!this.enemy) return;
    const { scale, displayWidth, displayHeight } = this.enemy;
    const currentWidth = PLAYER_COMPONENT_HEALTH_BAR_SIZE.width * scale;
    const currentHeight = PLAYER_COMPONENT_HEALTH_BAR_SIZE.height * scale;

    const x = this.enemy.x;
    const y = this.enemy.y;

    const currentX = x - (displayWidth - currentWidth) / 2;
    const currentY = y - displayHeight / 2 + ENEMY_HEALTH_BAR_OFFSET_Y;

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

    this.healthText.setPosition(currentX, currentY + 3);
    this.healthText.width = currentWidth - 2;
  }

  public setPxy(x: number, y: number) {
    this.enemy?.setPosition(x, y);
    this.enemy?.refreshBody();
    this.setHealthBar();
  }

  public update(): void {
    if (!this.enemy || this.isDestroyed) return;
    const scale =
      this.defaultScale -
      this.defaultScale *
        (1 - SCENE_PERSPECTIVE) *
        (Math.abs(this.scene.scale.height - this.enemy.y) /
          this.scene.scale.height);

    this.enemy.setScale(scale, scale);

    if (this.enemy.y > 50) {
      if (!this.enemy.visible) this.setVisibility(true);
    }
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
    this.healthText.setVisible(value);
  }

  public loseBlood(): void {
    if (!this.enemy || this.isDestroyed) return;

    this.blood -= 10;

    if (this.blood <= 0) {
      this.destroy();
      this.removeStateByName(this.enemyName);
    } else {
      this.healthText.setText(`${this.blood}%`);
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.healthBarBorder.destroy();
    this.healthBarMask.destroy();
    this.healthBar.destroy();
    this.healthText.destroy();
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

    const x =
      this.defaultX +
      (this.defaultX > this.scene.scale.width / 2 ? 1 : -1) * percentage * 20;
    const y =
      this.defaultY +
      (this.scene.scale.height + enemy.displayHeight) * percentage;

    this.setPxy(x, y);
    this.update();
  }
}
