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
import {
  GATE_MISS_OFFSET_RATIO,
  textStyle,
  TGateState,
  TQuadrantX,
} from "./gate.config";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  private quadrantX: TQuadrantX[] = [-1, 0, 1]; // -1: left, 0: center, 1: right
  private totalGate = 0;

  public gateContainer: Phaser.Physics.Arcade.Sprite[] = []; // Array to hold gate sprites
  public gateState: TGateState[] = []; // Array to hold gate states

  private increasePlayerCount: (count: number) => void;
  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  constructor(
    scene: Phaser.Scene,
    increasePlayerCount: () => void,
    increaseGateCount: () => void
  ) {
    super(scene, 0, 0);
    this.increasePlayerCount = increasePlayerCount;
    this.increaseGateCount = increaseGateCount;
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
    this.totalGate++;

    const name = `gate-${this.totalGate}`;
    const currentQuadrant = quadrant[index];
    const gate = this.scene.physics.add.sprite(0, 0, assetsKey);
    gate.body.setMass(100000);
    const { width, height } = getDisplaySizeByWidthPercentage(
      gate,
      GATE_WIDTH_SCALE_RATIO
    );

    gate.setName(name);
    gate.setDisplaySize(width, height);
    gate.setPosition((currentQuadrant * width) / 2, this.y);
    this.add(gate);

    const count =
      assetsKey === GAME_ASSET_KEYS.gatePositive
        ? 1 + Math.floor(Math.random() * 4)
        : -1 - Math.floor(Math.random() * 4);

    const text = this.scene.add.text(gate.x, gate.y, `${count}`, {
      ...textStyle,
      fixedWidth: width * 0.68,
      fixedHeight: 44,
    });

    text.setName(name);
    this.add(text);

    this.gateState.push({
      name,
      gate,
      text,
      count,
      quadrant: currentQuadrant,
      startTime: time,
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
        undefined,
        this.scene
      );
      this.scene.physics.add.overlap(
        gate,
        firepower,
        () => this.onCollision(gate, firepower),
        undefined,
        this.scene
      );
    });

    const group =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").layoutContainers
        .player.group;
    if (group) {
      this.scene.physics.add.collider(
        gate,
        group,
        () => {
          this.removeGate(gate.name);
        },
        () => {},
        this.scene
      );
    }
  }

  private onCollision(
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ): void {
    this.increaseGateCount(gate, firepower);
    // console.log(firepower);

    // const [state] = this.gateState.filter((state) => state.name !== gate.name);
    // const { count, text } = state;
    // text.setText(`${count + 1}`);

    // // this.increasePlayerCount(Math.floor(Math.random() * 2) + 1);
    // // gate.destroy();
    // firepower.destroy();
  }

  public increaseCountByGate(gate: Phaser.Physics.Arcade.Sprite): void {
    console.log(gate);
  }

  public onStart(): void {
    this.isStarted = true;
  }

  public removeGate(name: string): void {
    const [state] = this.gateState.filter((state) => state.name === name);
    if (!state) return;

    state.text.destroy();
    state.gate.destroy();

    this.gateState = this.gateState.filter((s) => s.name !== name);
    this.gateContainer = this.gateContainer.filter((g) => g.name !== name);
  }

  public update(time: number): void {
    if (!this.isStarted) return;

    this.gateState.forEach((state) => {
      const percent = (time - state.startTime) / GATE_DURATION;
      const { scale, gate, text, quadrant } = state;

      const currentScale =
        scale - scale * (1 - SCENE_PERSPECTIVE) * (1 - percent);
      gate.setScale(currentScale, currentScale);
      text.setScale(currentScale, currentScale);

      const x = quadrant * gate.displayWidth;
      const y = (this.scene.scale.height + gate.displayHeight) * percent;

      gate.setPosition(x, y);
      text.setPosition(x - gate.displayWidth / 2, y - text.displayHeight * 0.5);
    });

    this.gateContainer.forEach((gate) => {
      if (
        gate.y >
        this.scene.scale.height -
          gate.displayHeight * (GATE_MISS_OFFSET_RATIO + SCENE_PERSPECTIVE) -
          PLAYER_OFFSET_Y
      ) {
        this.removeGate(gate.name);
      }
    });
  }
}
