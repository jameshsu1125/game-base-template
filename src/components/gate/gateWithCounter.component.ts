import { Easing } from "@/configs/constants/layout.constants";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import {
  GATE_MISS_OFFSET_RATIO,
  GATE_TEXT_STYLE,
  TQuadrantX,
} from "./gate.config";
import {
  gamePreset,
  gatePreset,
  playerPreset,
} from "@/configs/presets/layout.preset";

export default class GateWithCounterComponent extends Phaser.GameObjects
  .Container {
  private isDestroyed = false;
  public num = 0;
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
    config: { quadrant: TQuadrantX; count: number },
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
    this.quadrant = config.quadrant;
    this.removeStateByName = removeStateByName;
    this.increaseGateCount = increaseGateCount;
    this.increasePlayerCount = increasePlayerCount;

    this.num = config.count;
    this.build();
  }

  private build(): void {
    const { ratio } = gatePreset;
    this.gate = this.scene.physics.add.staticSprite(
      0,
      0,
      this.num >= 0
        ? GAME_ASSET_KEYS.gatePositive
        : GAME_ASSET_KEYS.gateNegative
    );
    this.gate.setName(this.gateName);

    const { width, height } = getDisplaySizeByWidthPercentage(this.gate, ratio);
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
    const { perspective } = gamePreset;
    const { offsetY } = playerPreset;

    const easingPercentage = Easing(percentage);
    const currentScale =
      scale - scale * (1 - perspective) * (1 - easingPercentage);
    gate.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);

    const x = this.scene.scale.width / 2 + this.quadrant * gate.displayWidth;
    const y = (this.scene.scale.height + gate.displayHeight) * easingPercentage;

    this.setPxy(x, y);

    const missPositionY =
      this.scene.scale.height -
      gate.displayHeight * (GATE_MISS_OFFSET_RATIO + perspective) -
      offsetY;

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
