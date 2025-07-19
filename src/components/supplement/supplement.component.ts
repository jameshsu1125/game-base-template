import { gatePreset } from "@/configs/presets/layout.preset";
import {
  SUPPLEMENT_ENTITY_BEFORE_START_CONFIG,
  SUPPLEMENT_ENTITY_CONFIG,
} from "@/entities/entity.config";
import Phaser from "phaser";
import {
  TQuadrantX,
  TSupplementState,
  TSupplementType,
} from "./supplement.config";
import SupplementWithCounterComponent from "./supplementWithCounter.component";

export class SupplementComponent extends Phaser.GameObjects.Container {
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
    const { duration } = gatePreset;
    SUPPLEMENT_ENTITY_BEFORE_START_CONFIG.forEach((cfg) => {
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
    config: (typeof SUPPLEMENT_ENTITY_CONFIG)[number]
  ): void {
    if (!this.isStarted) return;

    [...config.data].forEach((cfg) => {
      this.createSupplement(cfg, time);
    });
  }

  private createSupplement(
    config: {
      type: TSupplementType;
      count: number;
      quadrant: TQuadrantX;
    },
    time: number
  ): void {
    const name = `supplement-${this.index++}`;
    const supplement = new SupplementWithCounterComponent(
      this.scene,
      config,
      name,
      this.removeStateByName.bind(this),
      this.increaseSupplementCountByType,
      this.decreaseSupplementCount
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
      state.target.destroy();
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
    super.destroy();
  }

  public decreaseSupplementCount(supplementName: string): void {
    console.log(this, this.supplementState, supplementName);

    const [state] = this.supplementState?.filter(
      (state) => state.target.supplementName === supplementName
    );

    if (state) {
      state.target.decreaseNum();
    }
  }
}
