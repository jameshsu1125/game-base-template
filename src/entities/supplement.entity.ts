import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { SUPPLEMENT_ENTITY_CONFIG } from "./entity.config";

export default class SupplementEntity {
  private isStarted = false;
  private state = { startTime: 0, index: -1 };

  constructor() {}

  public onStart(time: number): void {
    this.isStarted = true;
    this.state.startTime = time;

    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.supplement.offsetTime = time;
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    if (this.state.startTime === 0) {
      this.state.startTime = time;
      return;
    }

    const currentTime = time - this.state.startTime;
    const [config] = SUPPLEMENT_ENTITY_CONFIG.filter(
      (config) => currentTime >= config.time
    ).reverse();

    if (config && this.state.index !== config?.index) {
      this.state.index = config?.index || 0;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.supplement.fire(time, config);
    }
  }
}
