import { Container, Sprite, TQuadrant } from "@/configs/constants/constants";
import {
  gateEntityConfig,
  gateEntityPresetConfig,
} from "@/configs/presets/gate.preset";
import { gatePreset } from "@/configs/presets/layout.preset";
import Phaser from "phaser";
import { TGateState } from "./gate.config";
import GateWithCounterComponent from "./gateWithCounter.component";

export class GateComponent extends Container {
  public gateState: TGateState[] = [];
  private increaseGateCount: (gate: Sprite, firepower: Sprite) => void;
  private increasePlayerCount: (count: number, gateName: string) => void;
  private index = 0;

  constructor(
    scene: Phaser.Scene,
    increaseGateCount: (gate: Sprite, firepower: Sprite) => void,
    increasePlayerCount: (count: number, gateName: string) => void
  ) {
    super(scene, 0, 0);

    this.increaseGateCount = increaseGateCount;
    this.increasePlayerCount = increasePlayerCount;

    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);

    requestAnimationFrame(() => this.buildBeforeStart());
  }

  private buildBeforeStart(): void {
    const { duration } = gatePreset;
    gateEntityPresetConfig.reverse().forEach((cfg) => {
      const currentConfig = {
        quadrant: cfg.data.quadrant,
        count: cfg.data.count,
      };
      this.createGate(currentConfig, cfg.time);
    });

    this.gateState.forEach((state) => {
      const percent = (0 - state.startTime) / duration;
      const { target } = state;
      target.setPositionByPercentage(percent);
    });
  }

  public fire(time: number, config: (typeof gateEntityConfig)[number]): void {
    [...config.data].forEach((cfg) => {
      this.createGate(cfg, time);
    });
  }

  private createGate(
    config: { quadrant: TQuadrant; count: number },
    time: number
  ): void {
    const name = `${time}-${this.index++}`;
    const gate = new GateWithCounterComponent(
      this.scene,
      config,
      name,
      this.increaseGateCount,
      this.increasePlayerCount
    );
    this.add(gate);
    this.gateState.push({
      startTime: time,
      target: gate,
    });
  }

  public removeStateByName(name: string): void {
    const [state] = this.gateState.filter(
      (state) => state.target.gateName === name
    );

    this.gateState = this.gateState.filter(
      (state) => state.target.gateName !== name
    );

    if (state) {
      state.target.doAnimationAndDestroy();
    }
  }

  public increaseGateCountByName(name: string): void {
    const [state] = this.gateState.filter(
      (state) => state.target.gateName === name
    );
    if (state.target) state.target.increaseNum();
  }

  public update(time: number): void {
    const { duration } = gatePreset;
    this.gateState.forEach((state) => {
      const percent = (time - state.startTime) / duration;
      const { target } = state;
      target.setPositionByPercentage(percent);
    });
  }

  public destroy(): void {
    this.gateState.forEach((state) => {
      state.target.destroy();
    });
    this.gateState = [];
  }
}
