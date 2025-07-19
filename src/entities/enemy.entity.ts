import { enemyEntityConfig } from "@/configs/presets/enemy.preset";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

/**
 * FirepowerEntity class representing the firepower component in the game.
 */
export default class EnemyEntity {
  private isStarted = false;
  private state = { startTime: 0, index: -1 };

  constructor() {}

  public onStart(time: number): void {
    this.isStarted = true;
    this.state.startTime = time;
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.enemy.offsetTime = time;
  }

  public update(time: number, delta: number): void {
    if (!this.isStarted) return;

    const currentTime = time - this.state.startTime;
    const [config] = enemyEntityConfig
      .filter((config) => currentTime >= config.time)
      .reverse();

    if (config && this.state.index !== config?.index) {
      this.state.index = config?.index || 0;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.enemy.fire(currentTime, config);
    }
  }
}
