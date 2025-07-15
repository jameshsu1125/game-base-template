import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { TGateState, TQuadrantX } from "./gate.config";
import GateWithCounterComponent from "./gateWithCounter.component";
import { GATE_DURATION } from "@/configs/constants/game.constants";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  private quadrantX: TQuadrantX[] = [-1, 0, 1]; // -1: left, 0: center, 1: right
  public gateState: TGateState[] = [];
  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;
  private increasePlayerCount: (count: number, gateName: string) => void;

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

    const quadrant = [...this.quadrantX].sort(() => Math.random() - 0.5);

    [GAME_ASSET_KEYS.gatePositive, GAME_ASSET_KEYS.gateNegative]
      .sort(() => Math.random() - 0.5)
      .forEach((assetsKey, index) => {
        this.createGate(assetsKey, index, quadrant, time);
      });
  }

  private createGate(
    assetsKey: string,
    index: number,
    quadrant: TQuadrantX[],
    time: number
  ): void {
    const name = `${time}-${index}`;
    const gate = new GateWithCounterComponent(
      this.scene,
      assetsKey,
      quadrant[index],
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
}
