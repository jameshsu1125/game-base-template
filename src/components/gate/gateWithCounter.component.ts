import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import { GATE_TEXT_STYLE, TQuadrantX } from "./gate.config";
import {
  getDisplayPositionAlign,
  getDisplaySizeByWidthPercentage,
} from "@/utils/layout.utils";
import { GATE_WIDTH_SCALE_RATIO } from "@/configs/constants/layout.constants";

export default class GateWithCounterComponent extends Phaser.GameObjects
  .Container {
  private gate: Phaser.Physics.Arcade.Sprite | null = null;
  private text: Phaser.GameObjects.Text | null = null;
  private num = 0;

  constructor(scene: Phaser.Scene, assetsKey: string, quadrant: TQuadrantX) {
    super(scene, 0, 0);
    this.num =
      assetsKey === GAME_ASSET_KEYS.gatePositive
        ? 1 + Math.floor(Math.random() * 4)
        : -1 - Math.floor(Math.random() * 4);

    this.build(assetsKey, quadrant);
  }

  private build(assetsKey: string, quadrant: TQuadrantX): void {
    this.gate = this.scene.physics.add.staticSprite(0, 0, assetsKey);

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.gate,
      GATE_WIDTH_SCALE_RATIO
    );
    this.gate.setDisplaySize(width, height);

    this.gate.setOrigin(0.5, 0.5);
    const { left, top } = getDisplayPositionAlign(this.gate, "CENTER_TOP");
    this.gate.setPosition(left + quadrant * width, top);

    this.text = this.scene.add.text(
      this.gate.x,
      this.gate.y,
      `${this.num > 0 ? "+" : this.num < 0 ? "-" : ""}${this.num}`,
      {
        ...GATE_TEXT_STYLE,
        fixedWidth: this.gate.displayWidth,
        fixedHeight: 44,
      }
    );
    this.text.setOrigin(0.5, 0.5);

    this.add(this.gate);
    this.add(this.text);
    this.gate.refreshBody();
  }

  public setPxy(x: number, y: number) {
    this.gate?.setPosition(x, y);
    this.text?.setPosition(x, y);
    this.gate?.refreshBody();
    this.destroy();
  }
}
