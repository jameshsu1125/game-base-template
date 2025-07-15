import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  GATE_MISS_OFFSET_RATIO,
  GATE_TEXT_STYLE,
  TQuadrantX,
} from "./gate.config";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import {
  GATE_WIDTH_SCALE_RATIO,
  PLAYER_OFFSET_Y,
  SCENE_PERSPECTIVE,
} from "@/configs/constants/layout.constants";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";

export default class GateWithCounterComponent extends Phaser.GameObjects
  .Container {
  private isDestroyed = false;
  private num = 0;
  private defaultScale: number = 1;
  public gateName = "";

  public gate: Phaser.Physics.Arcade.Sprite | null = null;
  private text: Phaser.GameObjects.Text | null = null;
  private quadrant: TQuadrantX = 0;

  private removeStateByName: (name: string) => void;
  private increaseGateCount: (
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;
  private increasePlayerCount: (count: number, gateName: string) => void;

  constructor(
    scene: Phaser.Scene,
    assetsKey: string,
    quadrant: TQuadrantX,
    name: string,
    removeStateByName: (name: string) => void,
    increaseGateCount: (
      gate: Phaser.Physics.Arcade.Sprite,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void,
    increasePlayerCount: (count: number, gateName: string) => void
  ) {
    super(scene, 0, 0);
    this.gateName = name;
    this.quadrant = quadrant;
    this.removeStateByName = removeStateByName;
    this.increaseGateCount = increaseGateCount;
    this.increasePlayerCount = increasePlayerCount;

    this.num =
      assetsKey === GAME_ASSET_KEYS.gatePositive
        ? 1 + Math.floor(Math.random() * 4)
        : -1 - Math.floor(Math.random() * 30);

    this.build(assetsKey);
  }

  private build(assetsKey: string): void {
    this.gate = this.scene.physics.add.staticSprite(0, 0, assetsKey);
    this.gate.setName(this.gateName);

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.gate,
      GATE_WIDTH_SCALE_RATIO
    );
    this.gate.setDisplaySize(width, height);

    this.gate.setOrigin(0.5, 0.5);
    const { left, top } = getDisplayPositionAlign(this.gate, "CENTER_TOP");
    this.gate.setPosition(
      left + this.quadrant * width,
      top - this.gate.displayHeight
    );
    this.defaultScale = this.gate.scale;

    this.text = this.scene.add.text(
      this.gate.x,
      this.gate.y,
      `${this.num > 0 ? "+" : this.num < 0 ? "-" : ""}${Math.abs(this.num)}`,
      {
        ...GATE_TEXT_STYLE,
        fixedWidth: this.gate.displayWidth,
        fixedHeight: 44,
      }
    );
    this.text.setOrigin(0.5, 0.5);

    this.add(this.gate);
    this.add(this.text);
    this.addCollision(this.gate);
  }

  private addCollision(gate: Phaser.Physics.Arcade.Sprite) {
    const layoutContainers =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    layoutContainers.firepower.firepowerContainer.forEach((firepower) => {
      this.scene.physics.add.collider(
        gate,
        firepower,
        () => this.increaseGateCount(gate, firepower),
        undefined,
        this.scene
      );
      this.scene.physics.add.overlap(
        gate,
        firepower,
        () => this.increaseGateCount(gate, firepower),
        undefined,
        this.scene
      );
    });

    layoutContainers.player.players.forEach((player) => {
      if (!player.player) return;
      this.scene.physics.add.collider(
        gate,
        player.player,
        () => this.increasePlayerCount(this.num, gate.name),
        undefined,
        this.scene
      );
      this.scene.physics.add.overlap(
        gate,
        player.player,
        () => this.increasePlayerCount(this.num, gate.name),
        undefined,
        this.scene
      );
    });
  }

  private updateText(): void {
    if (!this.text) return;
    this.text.setText(
      `${this.num > 0 ? "+" : this.num < 0 ? "-" : ""}${Math.abs(this.num)}`
    );
    if (this.num >= 0) this.gate?.setTexture(GAME_ASSET_KEYS.gatePositive);
  }

  public increaseNum(): void {
    this.num += 1;
    this.updateText();
  }

  public setPositionByPercentage(percentage: number) {
    const { defaultScale: scale, gate, text } = this;
    if (!gate || !text || this.isDestroyed) return;

    const currentScale =
      scale - scale * (1 - SCENE_PERSPECTIVE) * (1 - percentage);
    gate.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);

    const x = this.scene.scale.width / 2 + this.quadrant * gate.displayWidth;
    const y = (this.scene.scale.height + gate.displayHeight) * percentage;

    this.setPxy(x, y);

    const missPositionY =
      this.scene.scale.height -
      gate.displayHeight * (GATE_MISS_OFFSET_RATIO + SCENE_PERSPECTIVE) -
      PLAYER_OFFSET_Y;

    if (y > missPositionY) {
      this.isDestroyed = true;
      this.destroy();
      this.removeStateByName(this.gateName);
    }
  }

  public setPxy(x: number, y: number) {
    this.gate?.setPosition(x, y);
    this.text?.setPosition(x, y);
    this.gate?.refreshBody();
  }
}
