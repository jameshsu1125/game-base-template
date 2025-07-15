import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import Phaser from "phaser";
import {
  GATE_WIDTH_SCALE_RATIO,
  PLAYER_OFFSET_Y,
  SCENE_PERSPECTIVE,
} from "../../configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";
import {
  GAME_DELTA,
  GATE_DURATION,
  GATE_SPEED,
  STOP_COLLISION,
} from "@/configs/constants/game.constants";

type TGateState = {
  direction: -1 | 0 | 1;
  startTime: number;
  scale: number;
  target: Phaser.Physics.Arcade.Sprite;
};

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;

  public gateContainer: Phaser.Physics.Arcade.Sprite[] = [];
  public gateState: TGateState[] = [];

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    this.y = -this.scene.scale.height / 2;
  }

  public fire(time: number): void {
    const positionX = [0, -1, 1].sort(() => Math.random() - 0.5);

    [GAME_ASSET_KEYS.gatePositive, GAME_ASSET_KEYS.gateNegative]
      .sort(() => Math.random() - 0.5)
      .forEach((assetsKey, index) => {
        const gate = this.scene.physics.add.sprite(0, 0, assetsKey);
        const { width, height } = getDisplaySizeByWidthPercentage(
          gate,
          GATE_WIDTH_SCALE_RATIO
        );
        gate.setDisplaySize(width, height);
        gate.setPosition((positionX[index] * gate.width) / 2, this.y);
        this.add(gate);

        this.gateState.push({
          direction: positionX[index] as -1 | 0 | 1,
          startTime: time,
          target: gate,
          scale: gate.scale,
        });

        this.gateContainer.push(gate);
        if (!STOP_COLLISION) this.addCollision(gate);
      });
  }

  private addCollision(gate: Phaser.Physics.Arcade.Sprite) {
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.firepower.firepowerContainer.forEach((firepower) => {
      this.scene.physics.add.collider(
        gate,
        firepower,
        () => {
          gate.destroy();
          firepower.destroy();
        },
        () => {},
        this.scene
      );
      this.scene.physics.add.overlap(
        gate,
        firepower,
        () => {
          gate.destroy();
          firepower.destroy();
        },
        () => {},
        this.scene
      );
    });
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

  public onStart(): void {
    this.isStarted = true;
  }
}
