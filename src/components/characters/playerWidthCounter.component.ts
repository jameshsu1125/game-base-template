import {
  BitmapMask,
  Container,
  Graphics,
  Image,
  Sprite,
} from "@/configs/constants/constants";
import { enemyPreset, playerPreset } from "@/configs/presets/layout.preset";
import { playerFormation } from "@/configs/presets/player.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import {
  getDisplayPositionAlign as getAlign,
  getDisplaySizeByWidthPercentage as getSize,
} from "@/utils/layout.utils";
import Tweener, { Bezier } from "lesca-object-tweener";

export default class PlayerWidthCounterComponent extends Container {
  private isDestroyed = false;
  private randomOffset = {
    x:
      -playerPreset.randomGap * 0.5 +
      Math.random() * -playerPreset.randomGap * 0.5,
    y:
      -playerPreset.randomGap * 0.5 +
      Math.random() * -playerPreset.randomGap * 0.5,
  };
  public tweenProperty = { y: -20 };

  public playerName: string;
  public blood: number = 100;

  public player?: Sprite;
  public healthBarBorder: Graphics = this.scene.add.graphics();
  public healthBarMask: Graphics = this.scene.make.graphics({});
  public mask = new BitmapMask(this.scene, this.healthBarMask);
  public healthBar: Image = this.scene.add.image(
    0,
    0,
    GAME_ASSET_KEYS.healthBar
  );

  private increasePlayerCount: (count: number, gateName: string) => void;
  private removePlayerByName: (name: string) => void;
  private decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void;

  constructor(
    scene: Phaser.Scene,
    playerName: string,
    decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void,
    increasePlayerCount: (count: number, gateName: string) => void,
    removePlayerByName: (name: string) => void
  ) {
    super(scene, 0, 0);
    this.playerName = playerName;
    this.decreasePlayerBlood = decreasePlayerBlood;
    this.increasePlayerCount = increasePlayerCount;
    this.removePlayerByName = removePlayerByName;

    this.healthBarBorder.setDepth(1000);
    this.healthBarMask.setDepth(1000);
    this.healthBar.setOrigin(0, 0);
    this.healthBar.setDepth(1000);
    this.build();
  }

  private build(): void {
    this.addPlayer();
  }

  private addHealthBar(x: number, y: number): void {
    if (!this.player) return;
    const { offsetY, width, height } = playerPreset.healthBar;
    const { scale, displayWidth, displayHeight } = this.player;

    const currentWidth = width * scale;
    const currentHeight = height * scale;
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

  private addPlayer(): void {
    const { ratio } = playerPreset;
    const player = this.scene.physics.add.sprite(0, 0, "playerSheet");
    const { width, height } = getSize(player, ratio);
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
    this.player = player;
    this.player.setDepth(999);
    this.addCollider(player);
  }

  public runAnimationSheet(): void {
    this.player?.play("run", true);
    new Tweener({
      from: this.tweenProperty,
      to: { y: 0 },
      duration: 500,
      delay: Math.random() * 100,
      easing: Bezier.easeOutQuart,
      onUpdate: (property: { y: number }) => {
        this.tweenProperty = property;
      },
    }).play();
  }

  private addCollider(player: Sprite): void {
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
    this.mask.destroy();
    if (this.player) {
      this.player.destroy(true);
      this.player = undefined;
    }
    super.destroy();
  }

  public loseBlood() {
    const { damage } = enemyPreset;
    this.blood -= damage;

    if (this.blood <= 0) {
      if (this.blood < 0) this.blood = 0;
      this.removePlayerByName(this.playerName);
    }
  }

  public setPositionByIndex(index: number, offset: number) {
    if (this.player === null || this.isDestroyed) return;
    const { gap, offsetY, isRadom } = playerPreset;

    const position = playerFormation[index] || { x: 0, y: 0, depth: 0 };
    const { left, top } = getAlign(this.player!, "CENTER_BOTTOM");

    const randomX = isRadom ? this.randomOffset.x : 0;
    const randomY = isRadom ? this.randomOffset.y : 0;

    const currentX = left + position.x * gap + randomX;
    const currentY = top + position.y * gap + randomY + this.tweenProperty.y;

    this.player!.setDepth(position.depth);
    this.player!.setPosition(currentX + offset, currentY + offsetY);
    this.addHealthBar(currentX + offset, currentY + offsetY);
  }
}
