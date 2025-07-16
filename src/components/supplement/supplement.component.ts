import { GATE_DURATION } from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import Phaser from "phaser";
import {
  TQuadrantX,
  TSupplementState,
  TSupplementType,
} from "./supplement.config";
import SupplementWithCounterComponent from "./supplementWithCounter.component";

export class SupplementComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  private quadrantX: TQuadrantX[] = [-1, 0, 1]; // -1: left, 0: center, 1: right
  public supplementState: TSupplementState[] = [];
  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;
  private increasePlayerCount: (count: number, gateName: string) => void;

  private index = 0;

  constructor(
    scene: Phaser.Scene,
    increaseGateCount: (
      gate: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void,
    increasePlayerCount: (count: number, gateName: string) => void
  ) {
    super(scene, 0, 0);

    this.increaseGateCount = increaseGateCount;
    this.increasePlayerCount = increasePlayerCount;

    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);
  }

  public fire(time: number): void {
    if (!this.isStarted) return;

    const { level } =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").layoutContainers
        .firepower;

    const type: TSupplementType =
      level > 1 ? "ARMY" : Math.random() > 0.5 ? "GUN" : "ARMY";
    const quadrant = [...this.quadrantX].sort(() => Math.random() - 0.5);
    const count = 1;

    [...new Array(count).keys()]
      .sort(() => Math.random() - 0.5)
      .forEach((index) => {
        this.createSupplement(type, quadrant[index], time);
      });
  }

  private createSupplement(
    type: TSupplementType,
    quadrant: TQuadrantX,
    time: number
  ): void {
    const name = `supplement-${this.index++}`;
    const supplement = new SupplementWithCounterComponent(
      this.scene,
      type,
      quadrant,
      name,
      this.removeStateByName.bind(this)
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

  public increaseGateCountByName(name: string): void {
    const [state] = this.supplementState.filter(
      (state) => state.target.supplementName === name
    );
    //if (state.target) state.target.increaseNum();
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
    console.log("decreaseSupplementCount called", supplementName);
    const [state] = this.supplementState.filter(
      (state) => state.target.supplementName === supplementName
    );
    if (state) {
      state.target.decreaseNum();
    }
  }
}
