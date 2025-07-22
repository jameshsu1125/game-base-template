import { gateEntityConfig } from "@/configs/presets/gate.preset";
import { gamePreset } from "@/configs/presets/layout.preset";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

export default class GateEntity {
  private isStarted = false;
  private state = { startTime: 0, index: -1 };
  private entityConfig = gateEntityConfig.map((cfg, index) => ({
    ...cfg,
    index: index + 1,
  }));
  constructor() {}

  public onStart(time: number): void {
    this.isStarted = true;
    this.state.startTime = time;
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.gate.offsetTime = time;
  }

  public update(time: number): void {
    if (!this.isStarted) return;

    const currentTime = time - this.state.startTime;
    const [config] = this.entityConfig
      .filter(
        (config) =>
          currentTime >= config.time &&
          currentTime - config.time < gamePreset.preventJumpTime
      )
      .reverse();

    if (config && this.state.index !== config?.index) {
      this.state.index = config?.index || 0;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.gate.fire(currentTime, config);
    }
  }
}
