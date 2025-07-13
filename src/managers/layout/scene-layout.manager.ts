import Phaser from "phaser";
import {
  EndGameResult,
  EndScreenOverlayComponent,
} from "../../components/end-screen.component";

import { PlayerComponent } from "../../components/characters/player.component";
import { LogoComponent } from "../../components/logo/logo.component";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { ANCHORS } from "../../utils/anchors.constants";
import { scaleImageToCover } from "../../utils/layout.utils";
import BaseLayoutManager from "./base-layout.manager";

type Background = Phaser.GameObjects.Image;

export interface LayoutContainers {
  sceneContainer: Phaser.GameObjects.Container;
  logo: LogoComponent;
  player: PlayerComponent;

  endScreenComponent: EndScreenOverlayComponent;
  background: Background;
}

export interface GameAreaConfig {
  containerWidth?: number;
  containerHeight?: number;
}

export default class SceneLayoutManager {
  private scene: Phaser.Scene;
  private constants: Required<GameAreaConfig>;
  private layoutManager: BaseLayoutManager;
  private layoutContainers!: LayoutContainers;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.layoutManager = new BaseLayoutManager(scene);
    this.constants = {
      containerWidth: this.scene.scale.width,
      containerHeight: this.scene.scale.height,
    };
  }

  public createGameAreas(): LayoutContainers {
    this.createMainContainer();
    this.layoutContainers.background = this.createBackground();

    this.layoutContainers.endScreenComponent = this.createEndScreenOverlay();
    this.layoutContainers.logo = this.createLogo();
    this.layoutContainers.player = this.createPlayer();
    this.layoutContainers.sceneContainer.add([
      this.layoutContainers.background,
      this.layoutContainers.logo,
      this.layoutContainers.player,
    ]);
    return this.layoutContainers;
  }

  public update(): void {
    this.layoutContainers.player.update();
  }

  private createMainContainer(): void {
    const sceneContainer = this.scene.add.container(0, 0);
    this.layoutManager.placeAt(sceneContainer, ANCHORS.CENTER);

    this.layoutContainers = {
      sceneContainer: sceneContainer,
    } as LayoutContainers;
  }

  private createPlayer(): PlayerComponent {
    const playerComponent = new PlayerComponent(this.scene);
    return playerComponent;
  }

  private createLogo(): LogoComponent {
    const logoComponent = new LogoComponent(this.scene);
    return logoComponent;
  }

  private createBackground(): Background {
    const background = this.scene.add.image(0, 0, GAME_ASSET_KEYS.background);
    scaleImageToCover(
      background,
      this.constants.containerWidth,
      this.constants.containerHeight
    );
    return background;
  }

  private createEndScreenOverlay(): EndScreenOverlayComponent {
    const endScreenOverlay = new EndScreenOverlayComponent(this.scene);

    const overlayContainer = this.scene.add.container(0, 0);
    overlayContainer.add(endScreenOverlay);
    this.layoutManager.placeAt(overlayContainer, ANCHORS.CENTER);
    return endScreenOverlay;
  }

  public showResultOverlay(
    endGameResult: EndGameResult,
    onRestart?: () => void
  ): void {
    this.layoutContainers.endScreenComponent.show({
      type: endGameResult,
      onRestart,
    });
  }
}
