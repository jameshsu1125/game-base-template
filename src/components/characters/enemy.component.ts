import {
  ENEMY_MAX_COUNT_ONCE,
  GATE_DURATION,
} from "@/configs/constants/game.constants";
import Phaser from "phaser";
import { TEnemyState } from "./enemy.config";
import EnemyWidthCounterComponent from "./enemyWithCounter.component";

export class EnemyComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  public enemyState: TEnemyState[] = [];
  private index = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);
  }

  public fire(time: number): void {
    if (!this.isStarted) return;

    const count = 5 + Math.floor(Math.random() * ENEMY_MAX_COUNT_ONCE);

    const randomY = [...new Array(count).keys()]
      .map(() => -Math.random() * 30)
      .sort((a, b) => a - b);

    [...new Array(count).keys()].forEach((index) => {
      this.createEnemy(index, time, randomY);
    });
  }

  private createEnemy(index: number, time: number, randomY: number[]): void {
    const name = `enemy-${this.index++}`;
    const enemy = new EnemyWidthCounterComponent(
      this.scene,
      name,
      this.removeStateByName.bind(this),
      randomY[index]
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

  public update(time: number): void {
    if (!this.isStarted) return;
    this.enemyState.forEach((state, index) => {
      const percent = (time - state.startTime) / GATE_DURATION;
      const { target } = state;
      target.setPositionByPercentage(percent);
    });
  }
}
