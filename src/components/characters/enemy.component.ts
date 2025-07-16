import {
  ENEMY_MAX_COUNT_ONCE,
  GATE_DURATION,
} from "@/configs/constants/game.constants";
import Phaser from "phaser";
import { TEnemyState } from "./enemy.config";
import EnemyWidthCounterComponent from "./enemyWithCounter.component";
import { ENEMY_ENTITY_CONFIG } from "@/entities/entity.config";

export class EnemyComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  public enemyState: TEnemyState[] = [];
  private index = 0;
  private fireTime = 0;

  private numberOfEnemies = [1, 2, 3];

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

  public update(time: number): void {
    if (!this.isStarted) return;
    this.enemyState.forEach((state, index) => {
      const percent = (time - state.startTime) / GATE_DURATION;
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
