import {
  GATE_DURATION,
  STOP_COLLISION,
} from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";
import Phaser from "phaser";
import {
  GATE_WIDTH_SCALE_RATIO,
  PLAYER_OFFSET_Y,
  SCENE_PERSPECTIVE,
} from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { TGateState, TQuadrantX } from "./gate.config";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  private quadrantX: TQuadrantX[] = [-1, 0, 1]; // -1: left, 0: center, 1: right

  public gateContainer: Phaser.Physics.Arcade.Sprite[] = []; // Array to hold gate sprites
  public gateState: TGateState[] = []; // Array to hold gate states

  private increasePlayerCount: (count: number) => void;

  constructor(scene: Phaser.Scene, increasePlayerCount: () => void) {
    super(scene, 0, 0);
    this.increasePlayerCount = increasePlayerCount;
    this.build();
  }

  private build(): void {
    this.y = -this.scene.scale.height / 2;
  }

  public fire(time: number): void {
    const quadrant = [...this.quadrantX].sort(() => Math.random() - 0.5);

    [GAME_ASSET_KEYS.gatePositive, GAME_ASSET_KEYS.gateNegative]
      .sort(() => Math.random() - 0.5)
      .forEach((assetsKey, index) => {
        this.createGates(assetsKey, quadrant, index, time);
      });
  }

  private createGates(
    assetsKey: string,
    quadrant: TQuadrantX[],
    index: number,
    time: number
  ): void {
    const currentQuadrant = quadrant[index];
    const gate = this.scene.physics.add.sprite(0, 0, assetsKey);
    gate.setName(`gate-${index}`);

    const { width, height } = getDisplaySizeByWidthPercentage(
      gate,
      GATE_WIDTH_SCALE_RATIO
    );
    gate.setDisplaySize(width, height);
    gate.setPosition((currentQuadrant * gate.width) / 2, this.y);
    this.add(gate);

    this.gateState.push({
      name: gate.name,
      direction: currentQuadrant as -1 | 0 | 1,
      startTime: time,
      target: gate,
      scale: gate.scale,
    });

    this.gateContainer.push(gate);
    if (!STOP_COLLISION) this.addCollision(gate);
  }

  private addCollision(gate: Phaser.Physics.Arcade.Sprite): void {
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.firepower.firepowerContainer.forEach((firepower) => {
      this.scene.physics.add.collider(
        gate,
        firepower,
        () => this.onCollision(gate, firepower),
        () => {},
        this.scene
      );
      this.scene.physics.add.overlap(
        gate,
        firepower,
        () => this.onCollision(gate, firepower),
        () => {},
        this.scene
      );
    });
  }

  private onCollision(
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ): void {
    this.increasePlayerCount(Math.floor(Math.random() * 2) + 1);
    gate.destroy();
    firepower.destroy();
  }

  public onStart(): void {
    this.isStarted = true;
  }

  public update(time: number): void {
    if (!this.isStarted) return;

    this.gateState.forEach((state) => {
      const percent = (time - state.startTime) / GATE_DURATION;

      const scale =
        state.scale - state.scale * (1 - SCENE_PERSPECTIVE) * (1 - percent);
      state.target.setScale(scale, scale);

      const x = state.direction * state.target.displayWidth;

      const y =
        (this.scene.scale.height + state.target.displayHeight) * percent;

      state.target.setPosition(x, y);
    });

    this.gateContainer.forEach((gate) => {
      if (
        gate.y >
        this.scene.scale.height -
          gate.displayHeight * (2 + SCENE_PERSPECTIVE) -
          PLAYER_OFFSET_Y
      ) {
        gate.destroy();
        this.gateContainer.shift();
      }
    });
  }
}
