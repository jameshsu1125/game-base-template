import { adjustmentOffsetTime } from "@/configs/constants/layout.constants";
import {
  ENEMY_ENTITY_BEFORE_START_CONFIG,
  ENEMY_ENTITY_CONFIG,
} from "@/entities/entity.config";
import Phaser from "phaser";
import { TEnemyState } from "./enemy.config";
import EnemyWidthCounterComponent from "./enemyWithCounter.component";
import { gatePreset } from "@/configs/presets/layout.preset";

export class EnemyComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  public enemyState: TEnemyState[] = [];
  private index = 0;
  public offsetTime = 0;

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
    this.decreaseEnemyBlood = decreaseEnemyBlood;
    this.decreasePlayerBlood = decreasePlayerBlood;

    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);

    requestAnimationFrame(() => this.buildBeforeStart());
  }

  public buildBeforeStart(): void {
    const { duration } = gatePreset;
    ENEMY_ENTITY_BEFORE_START_CONFIG.forEach((cfg) => {
      const currentConfig = {
        x: cfg.data.x,
        type: cfg.data.type,
      };
      this.createEnemy(currentConfig, cfg.time);
    });

    this.enemyState.forEach((state) => {
      const percent = (0 - state.startTime) / duration;
      const { target } = state;
      target.setPositionByPercentage(percent);
      target.enemy?.refreshBody();
    });
  }

  public fire(
    time: number,
    config: (typeof ENEMY_ENTITY_CONFIG)[number]
  ): void {
    if (!this.isStarted) return;

    [...config.data].forEach((cfg) => {
      this.createEnemy(cfg, time);
    });
  }

  private createEnemy(
    config: {
      x: number;
      type: "follow" | "straight";
    },
    time: number
  ): void {
    const name = `enemy-${this.index++}`;
    const enemy = new EnemyWidthCounterComponent(
      this.scene,
      name,
      config,
      this.removeStateByName.bind(this),
      this.decreaseEnemyBlood,
      this.decreasePlayerBlood
    );
    this.add(enemy);

    this.enemyState.push({
      startTime: time,
      target: enemy,
    });
  }

  public onStart(): void {
    this.isStarted = true;
  }

  public removeStateByName(name: string): void {
    const [state] = this.enemyState.filter(
      (state) => state.target.enemyName === name
    );

    if (state) {
      state.target.destroy();
    }

    this.enemyState = this.enemyState.filter(
      (state) => state.target.enemyName !== name
    );
  }

  public loseBlood(enemy: Phaser.Physics.Arcade.Sprite) {
    const [state] = this.enemyState.filter(
      (state) => state.target.enemyName === enemy.name
    );

    if (state) {
      state.target.loseBlood();
    }
  }

  public update(time: number, delta: number): void {
    if (!this.isStarted) return;
    const { duration } = gatePreset;
    this.enemyState.forEach((state) => {
      const percent =
        (time - state.startTime - this.offsetTime + adjustmentOffsetTime) /
        duration;
      const { target } = state;
      target.setPositionByPercentage(percent);
    });
  }

  public destroy(): void {
    this.enemyState.forEach((state) => {
      state.target.destroy();
    });
    this.enemyState = [];
    super.destroy();
  }
}
