import { finishLineEntityConfig } from "@/configs/presets/finishLne.preset";
import { gamePreset } from "@/configs/presets/layout.preset";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

export default class FinishLineEntity {
  private isStarted = false;
  private state = { startTime: 0, index: 0 };
  constructor() {}

  public onStart(time: number): void {
    this.isStarted = true;
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.finishLine.offsetTime = time;
  }

  public update(time: number): void {
    if (!this.isStarted) return;

    const currentTime = time - this.state.startTime;
    const [config] = finishLineEntityConfig
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
      ).layoutContainers.finishLine.fire(currentTime);
    }
  }
}
