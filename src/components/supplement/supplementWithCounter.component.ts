import { Container, Scene, Sprite, Text } from "@/configs/constants/constants";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
import { Easing } from "@/configs/constants/layout.constants";
import {
  gamePreset,
  playerPreset,
  supplementPreset,
} from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage as getSize } from "@/utils/layout.utils";
import { TConfig, TSupplementType } from "./supplement.config";
import MainScene from "@/scenes/main.scene";

export default class SupplementWithCounterComponent extends Container {
  public isDestroyed = false;
  public supplementName: string;

  private num = 0;
  private defaultScale = 1;

  public bucket?: Sprite;
  private text?: Text;

  private removeStateByName: (name: string) => void;
  private decreaseSupplementCount: (name: string, firepower: Sprite) => void;
  private increaseSupplementCountByType: (
    type: TSupplementType,
    name: string
  ) => void;

  private config?: TConfig;

  constructor(
    scene: Scene,
    config: TConfig,
    name: string,
    removeStateByName: (name: string) => void,
    decreaseSupplementCount: (name: string, firepower: Sprite) => void,
    increaseSupplementCountByType: (type: TSupplementType, name: string) => void
  ) {
    super(scene, 0, 0);

    this.supplementName = name;
    this.config = config;
    this.num = this.config?.count || 0;

    this.removeStateByName = removeStateByName;
    this.increaseSupplementCountByType = increaseSupplementCountByType;
    this.decreaseSupplementCount = decreaseSupplementCount;

    this.build();
  }

  private build(): void {
    this.createBucket();
    this.createText();
  }

  private createBucket(): void {
    const { ratio } = supplementPreset;
    this.bucket = this.scene.physics.add.staticSprite(
      0,
      -200,
      this.config?.type === "ARMY" ? GAME_ASSET_KEYS.army : GAME_ASSET_KEYS.gun1
    );
    this.bucket.setName(this.supplementName);
    this.add(this.bucket);
    this.sendToBack(this.bucket);

    const { width, height } = getSize(this.bucket, ratio);
    this.bucket.setDisplaySize(width, height);

    this.defaultScale = this.bucket.scale;
    this.bucket.setDepth((this.scene as MainScene).getIndex());

    this.add(this.bucket);

    if (STOP_COLLISION) this.addCollision(this.bucket);
  }

  private createText(): void {
    const { fontStyle } = supplementPreset;
    const { x, y } = this.bucket || { x: 0, y: 0 };
    this.text = this.scene.add.text(x, y, `${this.num}`, {
      ...fontStyle,
      fixedWidth: this.bucket!.displayWidth,
    });
    this.text.setOrigin(0.5, 0.5);
    this.text.setDepth((this.scene as MainScene).getIndex());
    this.add(this.text);
  }

  private addCollision(bucket: Phaser.Physics.Arcade.Sprite): void {
    const { firepower } =
      ServiceLocator.get<SceneLayoutManager>(
        "gameAreaManager"
      ).layoutContainers;

    if (firepower) {
      firepower.firepowerContainer.forEach((firepower) => {
        this.scene.physics.add.collider(
          bucket,
          firepower,
          () => this.decreaseSupplementCount(this.supplementName, firepower),
          undefined,
          this
        );

        this.scene.physics.add.overlap(
          bucket,
          firepower,
          () => this.decreaseSupplementCount(this.supplementName, firepower),
          undefined,
          this
        );
      });
    }
  }

  public setPxy(x: number, y: number): void {
    this.bucket?.setPosition(x, y);
    this.text?.setPosition(x, y);
    this.bucket?.refreshBody();
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.bucket?.destroy();
    this.text?.destroy();
    super.destroy();
  }

  public decreaseNum() {
    this.num -= 1;
    if (this.num <= 0) {
      this.num = 0;
      this.text?.setText(`${this.num}`);
      this.increaseSupplementCountByType(
        this.config?.type || "ARMY",
        this.supplementName
      );
    } else {
      this.text?.setText(`${this.num}`);
    }
  }

  setVisibility(value: boolean) {
    this.bucket?.setVisible(value);
    this.text?.setVisible(value);
  }

  public update(percentage: number): void {
    const { defaultScale: scale, bucket, text } = this;
    if (!bucket || !text || this.isDestroyed) return;

    const { offsetY } = playerPreset;
    const { perspective } = gamePreset;
    const { gap, miss } = supplementPreset;

    const currentPercent = Easing(percentage);

    const currentScale =
      scale - scale * (1 - perspective) * (1 - currentPercent);
    bucket.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);

    const x =
      this.scene.scale.width / 2 +
      (this.config?.quadrant || 0) * (bucket.displayWidth + gap);
    const y =
      (this.scene.scale.height + Math.abs(bucket.displayHeight)) *
      currentPercent;

    this.setPxy(x, y);

    const missPositionY =
      this.scene.scale.height -
      bucket.displayHeight * (miss + perspective) -
      offsetY;

    if (y > missPositionY) {
      this.isDestroyed = true;
      this.destroy();
      this.removeStateByName(this.supplementName);
    }
  }
}
