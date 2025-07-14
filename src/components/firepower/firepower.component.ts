import {
  FIREPOWER_SPEED,
  GAME_DELTA,
  STOP_COLLISION,
} from "@/configs/constants/game.constants";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import Phaser from "phaser";
import {
  FIREPOWER_OFFSET_Y,
  FIREPOWER_PERSPECTIVE,
  FIREPOWER_WIDTH_SCALE_RATIO,
  SCENE_PERSPECTIVE,
} from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import { PlayerComponent } from "../characters/player.component";

export class FirepowerComponent extends Phaser.GameObjects.Container {
  private player: PlayerComponent;
  public firepowerContainer: Phaser.Physics.Arcade.Sprite[] = [];

  private isStarted = false;
  private baseScale = 1;
  public level = 1;

  constructor(scene: Phaser.Scene, player: PlayerComponent) {
    super(scene, 0, 0);
    this.player = player;
    this.build();
  }

  private build(): void {
    if (this.player && this.player.player) {
      this.setPosition(
        0,
        getDisplayPositionByBorderAlign(
          this.player.player,
          this.scene,
          "BOTTOM"
        ) -
          this.player.player.displayHeight * 0.5 -
          FIREPOWER_OFFSET_Y
      );
    }
  }

  public fire(delta: number): void {
    if (!this.isStarted || !this.player || !this.player.player) return;

    const firepower = this.scene.physics.add
      .sprite(
        this.x,
        this.y,
        this.level === 1
          ? GAME_ASSET_KEYS.firepowerLevel1
          : GAME_ASSET_KEYS.firepowerLevel2
      )
      .refreshBody();
    const { width, height } = getDisplaySizeByWidthPercentage(
      firepower,
      FIREPOWER_WIDTH_SCALE_RATIO
    );

    firepower.setDisplaySize(width, height);
    firepower.setPosition(this.player.x, 0 - firepower.displayHeight * 0.5);
    this.baseScale = firepower.scale;

    firepower.setVelocityY(-(FIREPOWER_SPEED * GAME_DELTA) / delta);
    firepower.setVelocityX(
      this.player.x * FIREPOWER_PERSPECTIVE * -1 * SCENE_PERSPECTIVE
    );
    firepower.setRotation(Phaser.Math.DegToRad(this.player.x * -0.1));

    this.add(firepower);
    if (!STOP_COLLISION) this.addCollision(firepower);

    this.firepowerContainer.push(firepower);
  }

  private addCollision(firepower: Phaser.Physics.Arcade.Sprite) {
    ServiceLocator.get<SceneLayoutManager>(
      "gameAreaManager"
    ).layoutContainers.gate.gateContainer.forEach((gate) => {
      this.scene.physics.add.collider(
        firepower,
        gate,
        () => {
          firepower.destroy();
          gate.destroy();
          this.firepowerContainer.shift();
        },
        () => {},
        this.scene
      );
      this.scene.physics.add.overlap(
        firepower,
        gate,
        () => {
          firepower.destroy();
          gate.destroy();
          this.firepowerContainer.shift();
        },
        () => {},
        this.scene
      );
    });
  }

  public update(): void {
    if (!this.isStarted) return;

    this.firepowerContainer.forEach((firepower) => {
      const scale =
        this.baseScale -
        this.baseScale *
          (1 - SCENE_PERSPECTIVE) *
          (Math.abs(firepower.y) / this.scene.scale.height);

      firepower.setScale(scale, scale);
      if (firepower.y < 0 - this.scene.scale.height) {
        firepower.destroy();
        this.firepowerContainer.shift();
      }
    });
  }

  public onStart(): void {
    this.isStarted = true;
  }
}
