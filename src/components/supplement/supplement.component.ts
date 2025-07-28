import { Container } from "@/configs/constants/constants";
import { gatePreset, supplementPreset } from "@/configs/presets/layout.preset";
import {
  supplementEntityPresetConfig,
  supplementEntityConfig,
} from "@/configs/presets/supplement.preset";
import Phaser from "phaser";
import { TConfig, TSupplementState } from "./supplement.config";
import SupplementWithCounterComponent from "./supplementWithCounter.component";

export class SupplementComponent extends Container {
  private index = 0;
  private isStarted = false;
  public supplementState: TSupplementState[] = [];
  public offsetTime = 0;

  private increaseSupplementCountByType: (
    type: "ARMY" | "GUN",
    supplementName: string
  ) => void;

  constructor(
    scene: Phaser.Scene,
    increaseSupplementCountByType: (
      type: "ARMY" | "GUN",
      supplementName: string
    ) => void
  ) {
    super(scene, 0, 0);
    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);
    this.increaseSupplementCountByType = increaseSupplementCountByType;
    requestAnimationFrame(() => this.buildBeforeStart());
  }

  private buildBeforeStart(): void {
    const { duration } = supplementPreset;
    supplementEntityPresetConfig.reverse().forEach((cfg) => {
      const currentConfig = {
        quadrant: cfg.data.quadrant,
        count: cfg.data.count,
        type: cfg.data.type,
      };
      this.createSupplement(currentConfig, cfg.time);
    });

    this.supplementState.forEach((state) => {
      const percent = (0 - state.startTime) / duration;
      const { target } = state;
      target.update(percent);
    });
  }

  public fire(
    time: number,
    config: (typeof supplementEntityConfig)[number]
  ): void {
    if (!this.isStarted) return;

    [...config.data].forEach((cfg) => {
      this.createSupplement(cfg, time);
    });
  }

  private createSupplement(config: TConfig, time: number): void {
    const name = `supplement-${this.index++}`;
    const supplement = new SupplementWithCounterComponent(
      this.scene,
      config,
      name,
      this.removeStateByName.bind(this),
      this.decreaseSupplementCount,
      this.increaseSupplementCountByType
    );

    this.add(supplement);
    this.supplementState.push({
      startTime: time,
      target: supplement,
    });
  }

  public onStart(): void {
    this.isStarted = true;
  }

  public removeStateByName(name: string): void {
    const [state] = this.supplementState.filter(
      (state) => state.target.supplementName === name
    );

    if (state) {
      state.target.doAnimationAndDestroy();
    }

    this.supplementState = this.supplementState.filter(
      (state) => state.target.supplementName !== name
    );
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    const { duration } = gatePreset;
    this.supplementState.forEach((state) => {
      const percent = (time - state.startTime - this.offsetTime) / duration;
      const { target } = state;
      target.update(percent);
    });
  }

  public destroy(): void {
    this.supplementState.forEach((state) => {
      state.target.destroy();
    });
    this.supplementState = [];
  }

  public decreaseSupplementCount(supplementName: string): void {
    if (!this.supplementState) return;

    const [state] = this.supplementState?.filter(
      (state) => state.target.supplementName === supplementName
    );

    if (state) {
      state.target.decreaseNum();
    }
  }
}
