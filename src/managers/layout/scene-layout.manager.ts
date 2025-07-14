import Phaser from "phaser";
import { PlayerComponent } from "../../components/characters/player.component";
import {
  EndGameResult,
  EndScreenOverlayComponent,
} from "../../components/end-screen.component";
import { FirepowerComponent } from "../../components/firepower/firepower.component";
import { LogoComponent } from "../../components/logo/logo.component";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { ANCHORS } from "../../utils/anchors.constants";
import { scaleImageToCover } from "../../utils/layout.utils";
import BaseLayoutManager from "./base-layout.manager";
import { GateComponent } from "@/components/gate/gate.component";

type Background = Phaser.GameObjects.Image;

export interface LayoutContainers {
  sceneContainer: Phaser.GameObjects.Container;

  background: Background;
  logo: LogoComponent;
  player: PlayerComponent;
  firepower: FirepowerComponent;
  gate: GateComponent;

  endScreenComponent: EndScreenOverlayComponent;
}

export interface GameAreaConfig {
  containerWidth?: number;
  containerHeight?: number;
}

export default class SceneLayoutManager {
  private scene: Phaser.Scene;
  private constants: Required<GameAreaConfig>;
  private layoutManager: BaseLayoutManager;
  public layoutContainers!: LayoutContainers;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // this.scene.matter.world.setFrictionAir(0);
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
    this.layoutContainers.firepower = this.createFirepower();
    this.layoutContainers.gate = this.createGate();

    this.layoutContainers.sceneContainer.add([
      this.layoutContainers.background,
      this.layoutContainers.gate,
      this.layoutContainers.firepower,
      this.layoutContainers.player,
      this.layoutContainers.logo,
    ]);
    return this.layoutContainers;
  }

  private createMainContainer(): void {
    const sceneContainer = this.scene.add.container(0, 0);
    this.layoutManager.placeAt(sceneContainer, ANCHORS.CENTER);
    this.layoutContainers = {
      sceneContainer: sceneContainer,
    } as LayoutContainers;
  }

  private createFirepower(): FirepowerComponent {
    const firepowerComponent = new FirepowerComponent(
      this.scene,
      this.layoutContainers.player
    );
    return firepowerComponent;
  }

  private createPlayer(): PlayerComponent {
    const playerComponent = new PlayerComponent(this.scene);
    return playerComponent;
  }

  private createLogo(): LogoComponent {
    const logoComponent = new LogoComponent(this.scene);
    return logoComponent;
  }

  private createGate(): GateComponent {
    const gateComponent = new GateComponent(this.scene);
    return gateComponent;
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

  public update(): void {
    this.layoutContainers.player.update();
    this.layoutContainers.firepower.update();
    this.layoutContainers.gate.update();
  }

  public onStart(): void {
    this.layoutContainers.player.onStart();
    this.layoutContainers.firepower.onStart();
    this.layoutContainers.gate.onStart();
  }
}
