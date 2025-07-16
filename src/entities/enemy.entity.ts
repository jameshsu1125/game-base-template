import {
  ENEMY_FIRE_DELAY,
  ENEMY_FIRE_RATE,
  FIREPOWER_RELOAD_TIME,
} from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

/**
 * FirepowerEntity class representing the firepower component in the game.
 */
export default class EnemyEntity {
  private isStarted = false;
  private state = { startTime: 0, index: -1 };

  constructor() {}

  public onStart(): void {
    this.isStarted = true;
  }

  public update(time: number, delta: number): void {
    if (!this.isStarted) return;

    const enemy =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").layoutContainers
        .enemy;

    if (this.state.startTime === 0) {
      this.state.startTime = time;
      enemy.fire(time);
      return;
    }

    const index = Math.floor(
      (time - this.state.startTime - ENEMY_FIRE_DELAY) / ENEMY_FIRE_RATE
    );
    if (index !== this.state.index && index > this.state.index) {
      this.state.index = index;
      enemy.fire(time);
    }
  }
}
