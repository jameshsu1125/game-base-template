import {
  FIREPOWER_SPEED,
  GAME_DELTA,
  STOP_COLLISION,
} from "@/configs/constants/game.constants";
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
import Phaser from "phaser";
import { PlayerComponent } from "../characters/player.component";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";

export class FirepowerComponent extends Phaser.GameObjects.Container {
  private player: PlayerComponent;
  public firepowerContainer: Phaser.Physics.Arcade.Sprite[] = [];
  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  private isStarted = false;
  private baseScale = 1;
  public level = 1;
  private index = 0;

  constructor(
    scene: Phaser.Scene,
    increaseGateCount: (
      gate: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void
  ) {
    super(scene, 0, 0);

    this.increaseGateCount = increaseGateCount;

    this.player =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.player;

    this.build();
  }

  private build(): void {
    if (this.player && this.player.players.length > 0) {
      const [player] = this.player.players;
      this.setPosition(
        getDisplayPositionByBorderAlign(player, this.scene, "LEFT"),
        getDisplayPositionByBorderAlign(player, this.scene, "TOP") -
          player.displayHeight * 0.5 +
          FIREPOWER_OFFSET_Y
      );
    }
  }

  public fire(delta: number): void {
    if (!this.isStarted || !this.player || this.player.players.length === 0)
      return;

    this.player.players.forEach((player) => {
      const firepower = this.scene.physics.add
        .sprite(
          player.x,
          player.y - FIREPOWER_OFFSET_Y,
          this.level === 1
            ? GAME_ASSET_KEYS.firepowerLevel1
            : GAME_ASSET_KEYS.firepowerLevel2
        )
        .refreshBody();
      firepower.setName(`firepower-${this.index++}`);

      const { width, height } = getDisplaySizeByWidthPercentage(
        firepower,
        FIREPOWER_WIDTH_SCALE_RATIO
      );
      firepower.setDisplaySize(width, height);
      firepower.setPosition(
        player.x - player.displayWidth / 2,
        player.y - player.displayHeight / 2 + FIREPOWER_OFFSET_Y
      );
      this.baseScale = firepower.scale;
      firepower.setVelocityY(-(FIREPOWER_SPEED * GAME_DELTA) / delta);
      firepower.setVelocityX(
        (player.x - this.scene.scale.width / 2) *
          FIREPOWER_PERSPECTIVE *
          -1 *
          SCENE_PERSPECTIVE
      );
      firepower.setRotation(
        Phaser.Math.DegToRad(
          (player.x - this.scene.scale.width / 2) *
            FIREPOWER_PERSPECTIVE *
            -0.05 *
            SCENE_PERSPECTIVE
        )
      );

      this.add(firepower);
      if (!STOP_COLLISION) this.addCollision(firepower);
      this.firepowerContainer.push(firepower);
    });
  }

  private addCollision(firepower: Phaser.Physics.Arcade.Sprite) {
    const layoutContainers =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    layoutContainers.gate.gateState.forEach((state) => {
      if (state.target.gate) {
        this.scene.physics.add.collider(
          firepower,
          state.target.gate,
          () => {
            if (!state.target.gate) return;
            this.increaseGateCount(state.target.gate, firepower);
          },
          () => {},
          this.scene
        );

        this.scene.physics.add.overlap(
          firepower,
          state.target.gate,
          () => {
            if (!state.target.gate) return;
            this.increaseGateCount(state.target.gate, firepower);
          },
          () => {},
          this.scene
        );
      }
    });

    // ServiceLocator.get<SceneLayoutManager>(
    //   "gameAreaManager"
    // ).layoutContainers.gate.gateContainer.forEach((gate) => {
    //   this.scene.physics.add.collider(
    //     firepower,
    //     gate,
    //     () => {
    //       firepower.destroy();
    //       gate.destroy();
    //       this.firepowerContainer.shift();
    //     },
    //     () => {},
    //     this.scene
    //   );
    //   this.scene.physics.add.overlap(
    //     firepower,
    //     gate,
    //     () => {
    //       firepower.destroy();
    //       gate.destroy();
    //       this.firepowerContainer.shift();
    //     },
    //     () => {},
    //     this.scene
    //   );
    // });
  }

  removeFirepowerByName(name: string): void {
    const [firepower] = this.firepowerContainer.filter(
      (fp) => fp.name === name
    );

    if (firepower) {
      firepower.destroy();
      this.firepowerContainer = this.firepowerContainer.filter(
        (fp) => fp.name !== name
      );
    }
  }

  public update(): void {
    if (!this.isStarted) return;

    this.firepowerContainer.forEach((firepower) => {
      const scale =
        this.baseScale -
        this.baseScale *
          (1 - SCENE_PERSPECTIVE) *
          (Math.abs(this.scene.scale.height - firepower.y) /
            this.scene.scale.height);

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
