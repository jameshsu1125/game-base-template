import {
  ENEMY_FIRE_DELAY,
  ENEMY_FIRE_RATE,
  FIREPOWER_RELOAD_TIME,
} from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { ENEMY_ENTITY_CONFIG } from "./entity.config";

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
    if (this.state.startTime === 0) {
      this.state.startTime = time;
      return;
    }

    const currentTime = time - this.state.startTime;
    const [config] = ENEMY_ENTITY_CONFIG.filter(
      (config) => currentTime >= config.time
    ).reverse();

    if (config && this.state.index !== config?.index) {
      this.state.index = config?.index || 0;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.enemy.fire(time, config);
    }
  }
}
