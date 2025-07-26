import {
  Container,
  Scene,
  Sprite,
  Text,
  TQuadrant,
} from "@/configs/constants/constants";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
import { Easing } from "@/configs/constants/layout.constants";
import {
  gamePreset,
  gatePreset,
  playerPreset,
} from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import MainScene from "@/scenes/main.scene";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import {
  getDisplayPositionAlign as getAlign,
  getDisplaySizeByWidthPercentage as getSize,
} from "@/utils/layout.utils";
import { getGateReward, hitGateEffect } from "./gate.config";

export default class GateWithCounterComponent extends Container {
  private isDestroyed = false;
  private defaultScale: number = 1;
  private quadrant: TQuadrant = 0;

  public gateName = "";
  public num = 0;

  public gate?: Sprite;
  private text?: Text;

  private graphicsName = "glow-particle";
  private graphics = this.scene.make.graphics();

  private increaseGateCount: (gate: Sprite, firepower: Sprite) => void;
  private increasePlayerCount: (count: number, gateName: string) => void;

  constructor(
    scene: Scene,
    config: { quadrant: TQuadrant; count: number },
    name: string,
    increaseGateCount: (gate: Sprite, firepower: Sprite) => void,
    increasePlayerCount: (count: number, gateName: string) => void
  ) {
    super(scene, 0, 0);
    this.gateName = name;
    this.quadrant = config.quadrant;
    this.increaseGateCount = increaseGateCount;
    this.increasePlayerCount = increasePlayerCount;

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(16, 16, 16);
    this.graphics.generateTexture(this.graphicsName, 32, 32);
    this.graphics.destroy();

    this.num = config.count;
    this.build();
    this.setDepth((this.scene as MainScene).getIndex());
  }

  private createGate(): void {
    const { ratio } = gatePreset;
    this.gate = this.scene.physics.add.staticSprite(
      0,
      0,
      this.num >= 0
        ? GAME_ASSET_KEYS.gatePositive
        : GAME_ASSET_KEYS.gateNegative
    );

    this.gate.setName(this.gateName);
    this.gate.setOrigin(0.5, 0.5);

    const { width, height } = getSize(this.gate, ratio);
    this.gate.setDisplaySize(width, height);

    const { left, top } = getAlign(this.gate, "CENTER_TOP");
    this.gate.setPosition(
      left + this.quadrant * width,
      top - this.gate.displayHeight
    );

    this.defaultScale = this.gate.scale;
    this.add(this.gate);
  }

  private createText(): void {
    const { fontStyle } = gatePreset;
    this.text = this.scene.add.text(
      this.gate!.x,
      this.gate!.y,
      `${this.num > 0 ? "+" : this.num < 0 ? "-" : ""}${Math.abs(this.num)}`,
      {
        ...fontStyle,
        fixedWidth: this.gate!.displayWidth,
      }
    );
    this.text.setOrigin(0.5, 0.5);
    this.add(this.text);
  }

  private build(): void {
    this.createGate();
    this.createText();
    if (!STOP_COLLISION) this.addCollision(this.gate!);
  }

  private addCollision(gate: Sprite) {
    const { layoutContainers } =
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager");

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
    const { maxCount } = gatePreset;

    this.text.setText(
      `${this.num > 0 ? "+" : this.num < 0 ? "-" : ""}${Math.abs(this.num)}`
    );

    if (this.num >= maxCount) {
      this.gate?.setTexture(GAME_ASSET_KEYS.gatePositiveMax);
    } else if (this.num >= 0) {
      this.gate?.setTexture(GAME_ASSET_KEYS.gatePositive);
    }
  }

  public increaseNum(): void {
    const { maxCount } = gatePreset;

    this.num = Math.min(this.num + 1, maxCount);
    if (this.num >= maxCount) {
      if (this.gate) hitGateEffect(this.gate, false);
    } else {
      if (this.gate) hitGateEffect(this.gate, false);
    }

    this.updateText();
  }

  public doAnimationAndDestroy(): void {
    if (this.gate) {
      getGateReward(this.gate, this.graphicsName);
      this.destroy();
    }
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.gate) {
      this.gate.destroy();
      this.gate.setVisible(false);
      if (this.gate.body) this.gate.body.enable = false;
    }
    if (this.text) {
      this.text.destroy();
      this.text.setVisible(false);
    }
    super.destroy();
  }

  public setPositionByPercentage(percentage: number) {
    const { defaultScale: scale, gate, text } = this;
    if (!gate || !text || this.isDestroyed) return;

    const { perspective } = gamePreset;
    const { offsetY } = playerPreset;
    const { missOffsetY } = gatePreset;

    const easingPercentage = Easing(percentage);
    const currentScale =
      scale - scale * (1 - perspective) * (1 - easingPercentage);
    gate.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);

    const x = this.scene.scale.width / 2 + this.quadrant * gate.displayWidth;
    const y = (this.scene.scale.height + gate.displayHeight) * easingPercentage;
    this.setPxy(x, y);

    const missPositionY =
      this.scene.scale.height - gate.displayHeight - offsetY - missOffsetY;

    if (y > missPositionY) {
      this.destroy();
    }
  }

  public setPxy(x: number, y: number) {
    this.gate?.setPosition(x, y);
    this.text?.setPosition(x, y);
    this.gate?.refreshBody();
  }
}
