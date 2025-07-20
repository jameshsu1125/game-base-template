import { Container, Scene } from "@/configs/constants/constants";
import { landingPreset } from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionByBorderAlign as getAlign,
  getDisplaySizeByWidthPercentage as setSize,
} from "@/utils/layout.utils";

export class LandingComponent extends Container {
  private fingerWidth: number = 0;

  constructor(scene: Scene) {
    super(scene);
    this.build();
    this.setDepth(1000);
  }

  private build(): void {
    this.createFinger();
    this.createArrows();
  }

  private createLeftArrow() {
    const { ratio, offsetY } = landingPreset.leftArrow;
    const arrow = this.scene.add.image(0, 0, GAME_ASSET_KEYS.arrowLeft);

    const { width, height } = setSize(arrow, ratio);
    arrow.setDisplaySize(width, height);

    const x = -this.fingerWidth / 2 - width / 2;
    const y = getAlign(arrow, this.scene, "BOTTOM") + offsetY;
    arrow.setPosition(x, y);

    this.add(arrow);
  }

  private createRightArrow(): void {
    const { ratio, offsetY } = landingPreset.rightArrow;

    const arrow = this.scene.add.image(0, 0, GAME_ASSET_KEYS.arrowRight);

    const { width: rightWidth, height: rightHeight } = setSize(arrow, ratio);
    arrow.setDisplaySize(rightWidth, rightHeight);

    const x = 0 + this.fingerWidth / 2 + rightWidth / 2;
    const y = getAlign(arrow, this.scene, "BOTTOM") + offsetY;
    arrow.setPosition(x, y);

    this.add(arrow);
  }

  private createArrows(): void {
    this.createLeftArrow();
    this.createRightArrow();
  }

  private createFinger(): void {
    const { ratio } = landingPreset.finger;

    const finger = this.scene.add.image(0, 0, GAME_ASSET_KEYS.finger);
    const { width, height } = setSize(finger, ratio);
    const y = getAlign(finger, this.scene, "BOTTOM");

    finger.setDisplaySize(width, height);
    finger.setPosition(0, y);

    this.fingerWidth = width;

    this.add(finger);
  }
}
