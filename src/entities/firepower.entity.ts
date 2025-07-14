import { FIREPOWER_RELOAD_TIME } from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

/**
 * FirepowerEntity class representing the firepower component in the game.
 */
export default class FirepowerEntity {
  private isStarted = false;
  private state = { startTime: 0, index: -1 };

  constructor() {
    this.initialize();
  }

  private initialize(): void {}

  public onStart(): void {
    this.isStarted = true;
  }

  update(time: number, delta: number): void {
    if (!this.isStarted) return;
    if (this.state.startTime === 0) this.state.startTime = time;

    const index = Math.floor(
      (time - this.state.startTime) / (FIREPOWER_RELOAD_TIME * 1000)
    );
    if (index !== this.state.index && index > this.state.index) {
      this.state.index = index;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.firepower.fire(delta);
    }
  }
}
