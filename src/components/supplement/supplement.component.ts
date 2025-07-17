import { GATE_DURATION } from "@/configs/constants/game.constants";
import { SUPPLEMENT_ENTITY_CONFIG } from "@/entities/entity.config";
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

    this.build();
  }

  private build(): void {
    this.createSupplement({ count: 2, type: "ARMY", quadrant: 1 }, -7000);

    this.supplementState.forEach((state) => {
      const percent = (0 - state.startTime) / GATE_DURATION;
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
      state.target.destroy();
    }

    this.supplementState = this.supplementState.filter(
      (state) => state.target.supplementName !== name
    );
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    this.supplementState.forEach((state) => {
      const percent = (time - state.startTime) / GATE_DURATION;
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
    const [state] = this.supplementState.filter(
      (state) => state.target.supplementName === supplementName
    );
    if (state) {
      state.target.decreaseNum();
    }
  }
}
