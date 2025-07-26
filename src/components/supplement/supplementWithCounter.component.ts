import {
  Container,
  Image,
  Scene,
  Sprite,
  Text,
} from "@/configs/constants/constants";
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
import {
  getSupplementItemEffect,
  hitSupplementEffect,
  TConfig,
  TSupplementType,
} from "./supplement.config";
import MainScene from "@/scenes/main.scene";

export default class SupplementWithCounterComponent extends Container {
  public isDestroyed = false;
  public supplementName: string;

  private num = 0;
  private defaultScale = 1;

  // items
  public bucket?: Sprite;
  private text?: Text;
  private historyY: number = 0;
  private item?: Image;

  private graphicsName = "glow-particle";
  private graphics = this.scene.make.graphics();

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

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillCircle(16, 16, 16);
    this.graphics.generateTexture(this.graphicsName, 32, 32);
    this.graphics.destroy();

    this.removeStateByName = removeStateByName;
    this.increaseSupplementCountByType = increaseSupplementCountByType;
    this.decreaseSupplementCount = decreaseSupplementCount;

    this.build();
  }

  private build(): void {
    this.createBucket();
    this.createText();
    this.createItem();
  }

  private createItem(): void {
    const preset =
      this.config?.type === "GUN"
        ? supplementPreset.item.gun
        : supplementPreset.item.arm;
    const { ratio } = preset;

    this.item = this.scene.add.image(
      0,
      0,
      this.config?.type === "GUN" ? GAME_ASSET_KEYS.gun : GAME_ASSET_KEYS.army
    );
    const { width, height } = getSize(this.item, ratio);

    this.item.setDisplaySize(width, height);
    this.item.setOrigin(0.5, 1);

    this.add(this.item);
  }

  private createBucket(): void {
    const { ratio } = supplementPreset;
    this.bucket = this.scene.physics.add.staticSprite(
      0,
      0,
      GAME_ASSET_KEYS.bucket
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
      fixedHeight: this.bucket?.displayHeight,
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

  public setPxy(x: number, y: number, scale: number): void {
    const preset =
      this.config?.type === "GUN"
        ? supplementPreset.item.gun
        : supplementPreset.item.arm;

    const { offsetY } = preset;

    this.text?.setPosition(x, y);

    this.bucket?.setPosition(x, y);
    this.bucket?.refreshBody();

    const itemY = y - this.bucket!.displayHeight * 0.5 + offsetY * scale;
    this.item?.setPosition(x, itemY);

    // prevent item revert move
    if (this.bucket) this.setVisibility(this.bucket.y > this.historyY);
    this.historyY = this.y;
  }

  public destroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.item) {
      this.item.setVisible(false);
      this.item.destroy();
    }

    if (this.bucket) {
      this.bucket.setVisible(false);
      this.bucket.destroy();
      if (this.bucket.body) this.bucket.body.enable = false;
    }

    super.destroy();
    this.removeStateByName(this.supplementName);
  }

  public doAnimationAndDestroy(): void {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    if (this.bucket && this.item) {
      getSupplementItemEffect(
        this.bucket,
        this.item,
        this.graphicsName,
        () => {
          this.text?.destroy();
          this.text?.setVisible(false);
        },
        () => {
          this.bucket?.destroy();
          this.item?.destroy();
          this.bucket?.setVisible(false);
          this.item?.setVisible(false);
          super.destroy();

          this.removeStateByName(this.supplementName);
        }
      );
    }
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
      if (this.bucket && this.item)
        hitSupplementEffect([this.bucket, this.item]);
    }
  }

  setVisibility(value: boolean) {
    this.bucket?.setVisible(value);
    this.text?.setVisible(value);
    this.item?.setVisible(value);
  }

  public update(percentage: number): void {
    const { defaultScale: scale, item, bucket, text } = this;
    if (!bucket || !text || !item || this.isDestroyed) return;

    const { offsetY } = playerPreset;
    const { perspective } = gamePreset;
    const { gap, missOffsetY } = supplementPreset;

    const currentPercent = Easing(percentage);

    const currentScale =
      scale - scale * (1 - perspective) * (1 - currentPercent);
    bucket.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);
    item.setScale(currentScale, currentScale);

    const x =
      this.scene.scale.width / 2 +
      (this.config?.quadrant || 0) * (bucket.displayWidth + gap);
    const y =
      (this.scene.scale.height + Math.abs(bucket.displayHeight)) *
      currentPercent;

    this.setPxy(x, y, currentScale);

    const missPositionY =
      this.scene.scale.height - bucket.displayHeight - offsetY - missOffsetY;

    if (y > missPositionY) {
      this.destroy();
    }
  }
}
