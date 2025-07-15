import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { TQuadrantX } from "./gate.config";
import GateWithCounterComponent from "./gateWithCounter.component";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  private quadrantX: TQuadrantX[] = [-1, 0, 1]; // -1: left, 0: center, 1: right

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.setPosition(-scene.scale.width / 2, -scene.scale.height / 2);
    this.build();
  }

  private build(): void {}

  public fire(time: number): void {
    const quadrant = [...this.quadrantX].sort(() => Math.random() - 0.5);

    [GAME_ASSET_KEYS.gatePositive, GAME_ASSET_KEYS.gateNegative]
      .sort(() => Math.random() - 0.5)
      .forEach((assetsKey, index) => {
        this.createGate(assetsKey, index, quadrant);
      });
  }
  private createGate(
    assetsKey: string,
    index: number,
    quadrant: TQuadrantX[]
  ): void {
    const gate = new GateWithCounterComponent(
      this.scene,
      assetsKey,
      quadrant[index]
    );
    gate.setPxy(100, 100);

    this.add(gate);
  }

  public onStart(): void {
    this.isStarted = true;
  }
}
