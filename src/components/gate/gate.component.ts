import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { TGateState, TQuadrantX } from "./gate.config";
import GateWithCounterComponent from "./gateWithCounter.component";
import { GATE_DURATION } from "@/configs/constants/game.constants";
import { GATE_ENTITY_CONFIG } from "@/entities/entity.config";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  public gateState: TGateState[] = [];
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

  public fire(time: number, config: (typeof GATE_ENTITY_CONFIG)[number]): void {
    if (!this.isStarted) return;

    [...config.data].forEach((cfg) => {
      this.createGate(cfg, time);
    });
  }

  private createGate(
    config: { quadrant: TQuadrantX; count: number },
    time: number
  ): void {
    const name = `${time}-${this.index++}`;
    const gate = new GateWithCounterComponent(
      this.scene,
      config,
      name,
      this.removeStateByName.bind(this),
      this.increaseGateCount,
      this.increasePlayerCount
    );
    this.add(gate);
    this.gateState.push({
      startTime: time,
      target: gate,
    });
  }

  public onStart(): void {
    this.isStarted = true;
  }

  public removeStateByName(name: string): void {
    const [state] = this.gateState.filter(
      (state) => state.target.gateName === name
    );

    if (state) {
      state.target.destroy();
    }

    this.gateState = this.gateState.filter(
      (state) => state.target.gateName !== name
    );
  }

  public increaseGateCountByName(name: string): void {
    const [state] = this.gateState.filter(
      (state) => state.target.gateName === name
    );
    if (state.target) state.target.increaseNum();
  }

  public update(time: number): void {
    if (!this.isStarted) return;
    this.gateState.forEach((state) => {
      const percent = (time - state.startTime) / GATE_DURATION;
      const { target } = state;
      target.setPositionByPercentage(percent);
    });
  }

  public destroy(): void {
    this.gateState.forEach((state) => {
      state.target.destroy();
    });
    this.gateState = [];
    super.destroy();
  }
}
