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
    this.state.startTime = Date.now();
  }

  update(): void {
    if (!this.isStarted) return;
    const now = Date.now();
    const index = Math.floor((now - this.state.startTime) / 1000);
    if (index !== this.state.index && index > this.state.index) {
      this.state.index = index;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.firepower.fire();
    }
  }
}
