import { Container, Sprite } from "@/configs/constants/constants";
import {
  enemyEntityPresetConfig,
  enemyEntityConfig,
} from "@/configs/presets/enemy.preset";
import { enemyPreset, gatePreset } from "@/configs/presets/layout.preset";
import Phaser from "phaser";
import { TEnemyState } from "./enemy.config";
import EnemyWidthCounterComponent from "./enemyWithCounter.component";

export class EnemyComponent extends Container {
  private isStarted = false;
  public enemyState: TEnemyState[] = [];
  private index = 0;
  public offsetTime = 0;

  private decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void;
  private decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void;

  constructor(
    scene: Phaser.Scene,
    decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void,
    decreasePlayerBlood: (player: Sprite, enemy: Sprite) => void
  ) {
    super(scene, 0, 0);

    this.decreaseEnemyBlood = decreaseEnemyBlood;
    this.decreasePlayerBlood = decreasePlayerBlood;
    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);

    requestAnimationFrame(() => this.buildBeforeStart());
  }

  public buildBeforeStart(): void {
    const { duration } = gatePreset;
    enemyEntityPresetConfig.forEach((cfg) => {
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

  public fire(time: number, config: (typeof enemyEntityConfig)[number]): void {
    if (!this.isStarted) return;
    [...config.data].forEach((cfg) => this.createEnemy(cfg, time));
  }

  private createEnemy(
    config: (typeof enemyEntityConfig)[number]["data"][number],
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

  public loseBlood(enemy: Sprite) {
    const [state] = this.enemyState.filter(
      (state) => state.target.enemyName === enemy.name
    );
    if (state) state.target.loseBlood();
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    const { timeOffset, duration } = enemyPreset;
    this.enemyState.forEach((state) => {
      const percent =
        (time - state.startTime - this.offsetTime + timeOffset) / duration;
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
