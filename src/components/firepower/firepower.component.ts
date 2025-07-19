import {
  FIREPOWER_SPEED,
  GAME_DELTA,
  STOP_COLLISION,
} from "@/configs/constants/game.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import Phaser from "phaser";
import { PlayerComponent } from "../characters/player.component";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import { firepowerPreset, gamePreset } from "@/configs/presets/layout.preset";

export class FirepowerComponent extends Phaser.GameObjects.Container {
  private player: PlayerComponent;
  public firepowerContainer: Phaser.Physics.Arcade.Sprite[] = [];

  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  private decreaseEnemyBlood: (
    enemy: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  private decreaseSupplementCount: (
    supplementName: string,
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
    ) => void,
    decreaseEnemyBlood: (
      enemy: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void,
    decreaseSupplementCount: (
      supplementName: string,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void
  ) {
    super(scene, 0, 0);

    this.increaseGateCount = increaseGateCount;
    this.decreaseEnemyBlood = decreaseEnemyBlood;
    this.decreaseSupplementCount = decreaseSupplementCount;

    this.player =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers.player;

    this.build();
  }

  private build(): void {
    if (this.player && this.player.players.length > 0) {
      const [player] = this.player.players;
      const { offsetY } = firepowerPreset;

      if (player.player) {
        this.setPosition(
          getDisplayPositionByBorderAlign(player.player, this.scene, "LEFT"),
          getDisplayPositionByBorderAlign(player.player, this.scene, "TOP") -
            player.displayHeight * 0.5 +
            offsetY
        );
      }
    }
  }

  public fire(delta: number): void {
    if (!this.isStarted || !this.player || this.player.players.length === 0)
      return;

    const { perspective } = gamePreset;
    const { perspective: firePerspective, offsetY, ratio } = firepowerPreset;

    this.player.players.forEach((player) => {
      if (!player.player) return;

      const firepower = this.scene.physics.add
        .sprite(
          player.player.x,
          player.player.y - offsetY,
          this.level === 1
            ? GAME_ASSET_KEYS.firepowerLevel1
            : GAME_ASSET_KEYS.firepowerLevel2
        )
        .refreshBody();
      firepower.setName(`firepower-${this.index++}`);

      const { width, height } = getDisplaySizeByWidthPercentage(
        firepower,
        ratio
      );
      firepower.setDisplaySize(width, height);
      firepower.setPosition(
        player.player.x - player.player.displayWidth / 2,
        player.player.y - player.displayHeight + offsetY - 100
      );
      this.baseScale = firepower.scale;
      firepower.setVelocityY(-(FIREPOWER_SPEED * GAME_DELTA) / delta);
      firepower.setVelocityX(
        (player.player.x - this.scene.scale.width / 2) *
          firePerspective *
          -1 *
          perspective
      );
      firepower.setRotation(
        Phaser.Math.DegToRad(
          (player.player.x - this.scene.scale.width / 2) *
            firePerspective *
            -0.05 *
            perspective
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

    layoutContainers.enemy.enemyState.forEach((state) => {
      if (state.target.enemy) {
        this.scene.physics.add.collider(
          firepower,
          state.target.enemy,
          () => this.decreaseEnemyBlood(state.target.enemy!, firepower),
          undefined,
          this.scene
        );

        this.scene.physics.add.overlap(
          firepower,
          state.target.enemy,
          () => this.decreaseEnemyBlood(state.target.enemy!, firepower),
          undefined,
          this.scene
        );
      }
    });

    layoutContainers.supplement.supplementState.forEach((state) => {
      if (state.target.bucket) {
        this.scene.physics.add.collider(
          firepower,
          state.target.bucket,
          () =>
            this.decreaseSupplementCount(
              state.target.supplementName,
              firepower
            ),
          undefined,
          this.scene
        );

        this.scene.physics.add.overlap(
          firepower,
          state.target.bucket,
          () =>
            this.decreaseSupplementCount(
              state.target.supplementName,
              firepower
            ),
          undefined,
          this.scene
        );
      }
    });
  }

  public increaseFirepowerLevel(): void {
    this.level += 1;
    if (this.level > 2) this.level = 2;

    this.firepowerContainer.forEach((firepower) => {
      firepower.setTexture(
        this.level === 1
          ? GAME_ASSET_KEYS.firepowerLevel1
          : GAME_ASSET_KEYS.firepowerLevel2
      );
    });
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
    const { perspective } = gamePreset;

    this.firepowerContainer.forEach((firepower) => {
      const scale =
        this.baseScale -
        this.baseScale *
          (1 - perspective) *
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

  public destroy(): void {
    this.firepowerContainer.forEach((firepower) => {
      firepower.destroy();
    });
    this.firepowerContainer = [];
    super.destroy();
  }
}
