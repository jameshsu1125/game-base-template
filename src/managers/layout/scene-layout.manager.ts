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
import { EnemyComponent } from "@/components/characters/enemy.component";

type Background = Phaser.GameObjects.Image;

export interface LayoutContainers {
  sceneContainer: Phaser.GameObjects.Container;

  background: Background;
  road: Phaser.GameObjects.Image;
  logo: LogoComponent;
  player: PlayerComponent;
  firepower: FirepowerComponent;
  gate: GateComponent;
  enemy: EnemyComponent;

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
    this.layoutManager = new BaseLayoutManager(scene);
    this.constants = {
      containerWidth: this.scene.scale.width,
      containerHeight: this.scene.scale.height,
    };
  }

  public createGameAreas(): LayoutContainers {
    this.createMainContainer();
    this.layoutContainers.background = this.createBackground();
    this.layoutContainers.road = this.createRoad();
    this.layoutContainers.endScreenComponent = this.createEndScreenOverlay();
    this.layoutContainers.logo = this.createLogo();
    this.layoutContainers.player = this.createPlayer();
    this.layoutContainers.firepower = this.createFirepower();
    this.layoutContainers.gate = this.createGate();
    this.layoutContainers.enemy = new EnemyComponent(this.scene);

    this.layoutContainers.sceneContainer.add([
      this.layoutContainers.background,
      this.layoutContainers.road,
      this.layoutContainers.gate,
      this.layoutContainers.enemy,
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
      this.increaseGateCount.bind(this)
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
    const gateComponent = new GateComponent(
      this.scene,
      this.increaseGateCount.bind(this),
      this.increasePlayerCount.bind(this)
    );
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

  private createRoad(): Phaser.GameObjects.Image {
    const road = this.scene.add.image(0, 0, GAME_ASSET_KEYS.road);
    scaleImageToCover(
      road,
      this.constants.containerWidth,
      this.constants.containerHeight
    );
    return road;
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

  public increasePlayerCount(count: number = 1, gateName: string): void {
    this.layoutContainers.player.increasePlayersCount(count);
    this.layoutContainers.gate.removeStateByName(gateName);
  }

  public increaseGateCount(
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) {
    this.layoutContainers.firepower.removeFirepowerByName(firepower.name);
    this.layoutContainers.gate.increaseGateCountByName(gate.name);
  }

  public update(time: number): void {
    this.layoutContainers.player.update();
    this.layoutContainers.firepower.update();
    this.layoutContainers.gate.update(time);
  }

  public onStart(): void {
    this.layoutContainers.player.onStart();
    this.layoutContainers.firepower.onStart();
    this.layoutContainers.gate.onStart();
  }
}
