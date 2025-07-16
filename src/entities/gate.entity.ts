import { GATE_FIRE_RATE } from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";

export default class GateEntity {
  private isStarted = false;
  private state = { startTime: 0, index: 0 };
  constructor() {}

  public onStart(): void {
    this.isStarted = true;
  }

  public update(time: number, delta: number): void {
    if (!this.isStarted) return;
    if (this.state.startTime === 0) {
      this.state.startTime = time;
    }

    const index = Math.floor((time - this.state.startTime) / GATE_FIRE_RATE);
    if (index !== this.state.index && index > this.state.index) {
      this.state.index = index;
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.gate.fire(time);
    }
  }
}
