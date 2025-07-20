import { Container, Scene, Sprite } from "@/configs/constants/constants";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
import { firepowerPreset, gamePreset } from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import {
  getDisplayPositionByBorderAlign as getAlign,
  getDisplaySizeByWidthPercentage as getSize,
} from "@/utils/layout.utils";
import Phaser from "phaser";
import { PlayerComponent } from "../characters/player.component";

export class FirepowerComponent extends Container {
  private isStarted = false;
  private baseScale = 1;
  private index = 0;

  public level = 1;

  private player: PlayerComponent;
  public firepowerContainer: Sprite[] = [];

  private increaseGateCount: (gate: Sprite, firepower: Sprite) => void;
  private decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void;
  private decreaseSupplementCount: (name: string, firepower: Sprite) => void;

  constructor(
    scene: Scene,
    increaseGateCount: (gate: Sprite, firepower: Sprite) => void,
    decreaseEnemyBlood: (enemy: Sprite, firepower: Sprite) => void,
    decreaseSupplementCount: (name: string, firepower: Sprite) => void
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
    this.setDepth(999);
  }

  private build(): void {
    if (this.player && this.player.players.length > 0) {
      const [player] = this.player.players;
      const { offsetY } = firepowerPreset;

      if (player.player) {
        this.setPosition(
          getAlign(player.player, this.scene, "LEFT"),
          getAlign(player.player, this.scene, "TOP") -
            player.displayHeight * 0.5 +
            offsetY
        );
      }
    }
  }

  public fire(delta: number): void {
    if (!this.isStarted || !this.player || this.player.players.length === 0)
      return;

    const { perspective, delta: gameDelta } = gamePreset;
    const { perspective: firePerspective, offsetY, ratio } = firepowerPreset;
    const { speed } = firepowerPreset;

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

      const { width, height } = getSize(firepower, ratio);
      firepower.setDisplaySize(width, height);

      firepower.setPosition(
        player.player.x - player.player.displayWidth / 2,
        player.player.y - player.displayHeight + offsetY - 100
      );
      this.baseScale = firepower.scale;
      firepower.setVelocityY(-(speed * gameDelta) / delta);
      firepower.setVelocityX(
        ((player.player.x - this.scene.scale.width / 2) *
          firePerspective *
          -1 *
          perspective *
          (700 / player.player.y)) /
          delta
      );
      firepower.setRotation(
        Phaser.Math.DegToRad(
          (player.player.x - this.scene.scale.width / 2) *
            firePerspective *
            -0.005 *
            perspective
        )
      );
      this.add(firepower);

      if (!STOP_COLLISION) this.addCollision(firepower);
      this.firepowerContainer.push(firepower);
    });
  }

  private addCollision(firepower: Sprite) {
    const { layoutContainers } =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager");

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
    this.level = Math.min(this.level + 1, 2);

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
