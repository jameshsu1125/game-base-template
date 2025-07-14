import {
  GATE_WIDTH_SCALE_RATIO,
  LOGO_WIDTH_SCALE_RATIO,
} from "../../configs/constants/layout.constants";
import Phaser from "phaser";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { getDisplaySizeByWidthPercentage } from "../../utils/layout.utils";
import { GATE_SPEED } from "@/configs/constants/game.constants";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";

export class GateComponent extends Phaser.GameObjects.Container {
  private isStarted = false;
  public gateContainer: Phaser.Physics.Arcade.Sprite[] = [];
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    this.y = -this.scene.scale.height / 2;
  }

  public fire(delta: number): void {
    const gate = this.scene.physics.add.sprite(
      this.x,
      this.y,
      GAME_ASSET_KEYS.gateBlue
    );
    const { width, height } = getDisplaySizeByWidthPercentage(
      gate,
      GATE_WIDTH_SCALE_RATIO
    );
    gate.setDisplaySize(width, height);
    gate.setPosition(0, 0);
    gate.setVelocityY(GATE_SPEED * delta);
    this.add(gate);
    this.addCollision(gate);

    this.gateContainer.push(gate);
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
          this.gateContainer.shift();
          console.log("a");
        },
        () => {
          console.log("b");
        },
        this.scene
      );
    });
  }

  public update(): void {
    if (!this.isStarted) return;

    this.gateContainer.forEach((gate) => {
      if (gate.y > this.scene.scale.height + gate.displayHeight) {
        gate.destroy();
        this.gateContainer.shift();
      }
    });
  }

  public onStart(): void {
    this.isStarted = true;
  }
}
