import { Easing } from "@/configs/constants/layout.constants";
import {
  gamePreset,
  gatePreset,
  playerPreset,
  supplementPreset,
} from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import { getDisplaySizeByWidthPercentage } from "@/utils/layout.utils";
import {
  SUPPLEMENT_MISS_OFFSET_RATIO,
  TQuadrantX,
  TSupplementType,
} from "./supplement.config";

export default class SupplementWithCounterComponent extends Phaser.GameObjects
  .Container {
  public isDestroyed = false;
  public supplementName: string;

  private defaultScale = 1;

  public bucket?: Phaser.Physics.Arcade.Sprite;
  private text?: Phaser.GameObjects.Text;
  private num = 0;

  private removeStateByName: (name: string) => void;
  private increaseSupplementCountByType: (
    type: "ARMY" | "GUN",
    supplementName: string
  ) => void;

  private decreaseSupplementCount: (
    supplementName: string,
    firepower: Phaser.Physics.Arcade.Sprite
  ) => void;

  private config?: {
    type: TSupplementType;
    count: number;
    quadrant: TQuadrantX;
  };

  constructor(
    scene: Phaser.Scene,
    config: {
      type: TSupplementType;
      count: number;
      quadrant: TQuadrantX;
    },
    name: string,
    removeStateByName: (name: string) => void,
    increaseSupplementCountByType: (
      type: "ARMY" | "GUN",
      supplementName: string
    ) => void,
    decreaseSupplementCount: (
      supplementName: string,
      firepower: Phaser.Physics.Arcade.Sprite
    ) => void
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
  }

  private createBucket(): void {
    const { fontStyle } = gatePreset;
    const { ratio } = supplementPreset;
    this.bucket = this.scene.physics.add.staticSprite(
      0,
      -200,
      this.config?.type === "ARMY" ? GAME_ASSET_KEYS.army : GAME_ASSET_KEYS.gun1
    );
    this.bucket.setName(this.supplementName);
    this.add(this.bucket);
    this.sendToBack(this.bucket);

    const { width, height } = getDisplaySizeByWidthPercentage(
      this.bucket,
      ratio
    );

    this.bucket.setDisplaySize(width, height);
    this.defaultScale = this.bucket.scale;

    this.text = this.scene.add.text(
      this.bucket.x,
      this.bucket.y,
      `${this.num}`,
      {
        ...fontStyle,
        fixedWidth: this.bucket.displayWidth,
        fixedHeight: 200,
        padding: {
          top: 145,
        },
      }
    );
    this.text.setOrigin(0.5, 0.5);
    this.add(this.bucket);
    this.add(this.text);

    this.addCollision(this.bucket);
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
          () => {
            this.decreaseSupplementCount(this.supplementName, firepower);
          },
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
    const { gap } = supplementPreset;

    const easingPercentage = Easing(percentage);

    const currentScale =
      scale - scale * (1 - perspective) * (1 - easingPercentage);
    bucket.setScale(currentScale, currentScale);
    text.setScale(currentScale, currentScale);

    const x =
      this.scene.scale.width / 2 +
      (this.config?.quadrant || 0) * (bucket.displayWidth + gap);
    const y =
      (this.scene.scale.height + bucket.displayHeight) * easingPercentage;

    this.setPxy(x, y);

    const missPositionY =
      this.scene.scale.height -
      bucket.displayHeight * (SUPPLEMENT_MISS_OFFSET_RATIO + perspective) -
      offsetY;

    if (y > missPositionY) {
      this.isDestroyed = true;
      this.destroy();
      this.removeStateByName(this.supplementName);
    }
  }
}
