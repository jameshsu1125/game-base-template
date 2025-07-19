import { gateEntityConfig } from "@/configs/presets/gate.preset";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

export default class GateEntity {
  private isStarted = false;
  private state = { startTime: 0, index: 0 };
  constructor() {}

  public onStart(): void {
    this.isStarted = true;
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    if (this.state.startTime === 0) {
      this.state.startTime = time;
      return;
    }

    const currentTime = time - this.state.startTime;
    const [config] = gateEntityConfig
      .filter((config) => currentTime >= config.time)
      .reverse();

    if (config && this.state.index !== config?.index) {
      this.state.index = config?.index || 0;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.gate.fire(time, config);
    }
  }
}
