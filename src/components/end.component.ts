import {
  Container,
  Image,
  Rectangle,
  Scene,
} from "@/configs/constants/constants";
import { endPreset } from "@/configs/presets/layout.preset";
import { GAME_ASSET_KEYS } from "@/features/asset-management/game-assets";
import {
  getDisplayPositionAlign as getAlign,
  getDisplaySizeByWidthPercentage as getSize,
} from "@/utils/layout.utils";
import { log } from "console";

export type EndGameResult = "VICTORY" | "DEFEAT";
export interface ResultComponentConfig {
  type: EndGameResult;
  onRestart?: () => void;
}

export class EndComponent extends Container {
  public gameResult: EndGameResult = "VICTORY";

  private darkScreen?: Rectangle;
  private banner?: Image;
  private button?: Image;
  private buttonScale: number = 1;

  constructor(scene: Scene) {
    super(scene);
    this.build();
    this.setDepth(1000);
    this.setVisibility(false);
  }

  private build(): void {
    this.createDarkScreen();
    this.createBanner();
    this.createButton();
  }

  private createDarkScreen(): void {
    const darkScreen = this.scene.add.rectangle(
      0,
      0,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      1
    );
    darkScreen.setOrigin(0, 0);
    darkScreen.setDepth(1001);
    darkScreen.setAlpha(0);
    this.darkScreen = darkScreen;
  }

  private createBanner(): void {
    const { ratio, offsetY } = endPreset.banner;
    const assets =
      this.gameResult === "VICTORY"
        ? GAME_ASSET_KEYS.endBannerVictory
        : GAME_ASSET_KEYS.endBannerDefeat;

    const image = this.scene.add.image(0, 0, assets);
    const { width, height } = getSize(image, ratio);
    image.setDisplaySize(width, height);
    const { left, top } = getAlign(image, "CENTER_CENTER");
    image.setPosition(left, top + offsetY + 100);
    image.setDepth(1001);
    image.setAlpha(0);

    this.banner = image;
  }

  private createButton(): void {
    const { ratio, offsetY } = endPreset.button;
    const image = this.scene.add.image(0, 0, GAME_ASSET_KEYS.endButton);
    image.setDepth(1001);

    const { width, height } = getSize(image, ratio);
    image.setDisplaySize(width, height);

    const { left, top } = getAlign(image, "CENTER_CENTER");
    image.setPosition(left, top + offsetY);

    this.buttonScale = image.scale;
    image.setScale(this.buttonScale * 2);
    image.setAlpha(0);

    image.setInteractive();
    image.on("pointerdown", () => location.reload());

    this.button = image;
  }

  setVisibility(visible: boolean): void {
    if (visible && this.banner) {
      this.banner.setTexture(
        this.gameResult === "VICTORY"
          ? GAME_ASSET_KEYS.endBannerVictory
          : GAME_ASSET_KEYS.endBannerDefeat
      );

      this.scene.tweens.add({
        targets: this.darkScreen,
        alpha: 0.5,
        duration: 500,
        ease: "Quart.easeOut",
      });

      if (Math.abs(this.banner.width) < Math.abs(this.banner.height)) {
        const { ratio } = endPreset.banner;
        this.banner.setRotation(-Math.PI / 2);

        const { width, height } = getSize(this.banner, (ratio * 438) / 600);
        this.banner.setDisplaySize(width, height);
      }

      this.scene.tweens.add({
        targets: this.banner,
        y: "-=100",
        alpha: 1,
        duration: 500,
        ease: "Quart.easeOut",
      });

      this.scene.tweens.add({
        targets: this.button,
        scale: this.buttonScale,
        alpha: 1,
        delay: 300,
        duration: 400,
        ease: "Back.easeOut",
      });
    }

    this.darkScreen?.setVisible(visible);
    this.banner?.setVisible(visible);
    this.button?.setVisible(visible);
  }
}
