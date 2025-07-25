import { EnemyComponent } from "@/components/characters/enemy.component";
import { GateComponent } from "@/components/gate/gate.component";
import { LandingComponent } from "@/components/landing.component";
import { SupplementComponent } from "@/components/supplement/supplement.component";
import Phaser from "phaser";
import { PlayerComponent } from "../../components/characters/player.component";
import { EndComponent } from "../../components/end.component";
import { FirepowerComponent } from "../../components/firepower/firepower.component";
import { LogoComponent } from "../../components/logo/logo.component";
import { GAME_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { ANCHORS } from "../../utils/anchors.constants";
import { scaleImageToCover } from "../../utils/layout.utils";
import BaseLayoutManager from "./base-layout.manager";
import { FinishComponent } from "@/components/finishLine/finishLine.component";
import { gamePreset } from "@/configs/presets/layout.preset";

type Background = Phaser.GameObjects.Image;

export interface LayoutContainers {
  sceneContainer: Phaser.GameObjects.Container & { zIndex: number };

  landing: LandingComponent;
  background: Background;
  road: Phaser.GameObjects.Image;
  logo: LogoComponent;
  player: PlayerComponent;
  firepower: FirepowerComponent;
  gate: GateComponent;
  supplement: SupplementComponent;
  enemy: EnemyComponent;
  finishLine: FinishComponent;

  endScreenComponent: EndComponent;
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
  public isGameOver = false;
  private gameOverCallback: () => void = () => {};

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
    this.layoutContainers.gate = this.createGate();
    this.layoutContainers.enemy = this.createEnemy();
    this.layoutContainers.supplement = this.createSupplement();
    this.layoutContainers.player = this.createPlayer();
    this.layoutContainers.firepower = this.createFirepower();
    this.layoutContainers.logo = this.createLogo();
    this.layoutContainers.endScreenComponent = this.createEndScreenOverlay();
    this.layoutContainers.landing = this.createLanding();
    this.layoutContainers.finishLine = this.createFinishLine();

    this.layoutContainers.sceneContainer.add([
      this.layoutContainers.background,
      this.layoutContainers.road,
      this.layoutContainers.finishLine,
      this.layoutContainers.gate,
      this.layoutContainers.supplement,
      this.layoutContainers.enemy,
      this.layoutContainers.firepower,
      this.layoutContainers.player,
      this.layoutContainers.logo,
      this.layoutContainers.landing,
      this.layoutContainers.endScreenComponent,
    ]);

    return this.layoutContainers;
  }

  private createFinishLine(): FinishComponent {
    const finishLineComponent = new FinishComponent(
      this.scene,
      this.onGameVictory.bind(this)
    );
    return finishLineComponent;
  }

  private createSupplement(): SupplementComponent {
    const firepowerSupplement = new SupplementComponent(
      this.scene,
      this.increaseSupplementCountByType.bind(this)
    );
    return firepowerSupplement;
  }

  private createMainContainer(): void {
    const sceneContainer = this.scene.add.container(0, 0);
    this.layoutManager.placeAt(sceneContainer, ANCHORS.CENTER);
    this.layoutContainers = {
      sceneContainer: sceneContainer,
    } as LayoutContainers;
  }

  private createLanding(): LandingComponent {
    const landingComponent = new LandingComponent(this.scene);
    return landingComponent;
  }

  private createEnemy(): EnemyComponent {
    const enemyComponent = new EnemyComponent(
      this.scene,
      this.decreaseEnemyBlood.bind(this),
      this.decreasePlayerBlood.bind(this),
      this.onGameVictory.bind(this)
    );
    return enemyComponent;
  }

  private createFirepower(): FirepowerComponent {
    const firepowerComponent = new FirepowerComponent(
      this.scene,
      this.increaseGateCount.bind(this),
      this.decreaseEnemyBlood.bind(this),
      this.decreaseSupplementCount.bind(this)
    );
    return firepowerComponent;
  }

  private createPlayer(): PlayerComponent {
    const playerComponent = new PlayerComponent(
      this.scene,
      this.decreasePlayerBlood.bind(this),
      this.increasePlayerCount.bind(this),
      this.onGameOver.bind(this)
    );
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
    background.setDepth(1);

    return background;
  }

  private createRoad(): Phaser.GameObjects.Image {
    const road = this.scene.add.image(0, 0, GAME_ASSET_KEYS.road);
    scaleImageToCover(
      road,
      this.constants.containerWidth,
      this.constants.containerHeight
    );
    road.setDepth(1);
    return road;
  }

  private createEndScreenOverlay(): EndComponent {
    const endScreenOverlay = new EndComponent(this.scene);
    return endScreenOverlay;
  }

  public increasePlayerCount(count: number = 1, gateName: string): void {
    this.layoutContainers.player.increasePlayersCount(count);
    this.layoutContainers.gate.removeStateByName(gateName);
    if (count > 0) {
      this.scene.sound.add(GAME_ASSET_KEYS.audioAward).play({ volume: 0.5 });
    } else {
      this.scene.sound.add(GAME_ASSET_KEYS.audioDeath).play({ volume: 0.5 });
    }
  }

  public increaseGateCount(
    gate: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ) {
    this.layoutContainers.firepower.removeFirepowerByName(firepower.name);
    this.layoutContainers.gate.increaseGateCountByName(gate.name);
  }

  public decreasePlayerBlood(
    player: Phaser.Physics.Arcade.Sprite,
    enemy: Phaser.Physics.Arcade.Sprite
  ): void {
    this.layoutContainers.player.loseBlood(player);
    this.layoutContainers.enemy.removeStateByName(enemy.name);
    this.scene.sound.add(GAME_ASSET_KEYS.audioDeath).play({ volume: 0.5 });
  }

  public decreaseEnemyBlood(
    enemy: Phaser.Physics.Arcade.Sprite,
    firepower: Phaser.Physics.Arcade.Sprite
  ): void {
    this.layoutContainers.enemy.loseBlood(enemy);
    this.layoutContainers.firepower.removeFirepowerByName(firepower.name);
  }

  public decreaseSupplementCount(
    supplementName: string,
    firepower: Phaser.Physics.Arcade.Sprite
  ): void {
    this.layoutContainers.firepower.removeFirepowerByName(firepower.name);
    this.layoutContainers.supplement.decreaseSupplementCount(supplementName);
  }

  public increaseSupplementCountByType(
    type: "ARMY" | "GUN",
    supplementName: string
  ) {
    this.layoutContainers.supplement.removeStateByName(supplementName);
    if (type === "ARMY") this.layoutContainers.player.increasePlayersCount(1);
    else this.layoutContainers.firepower.increaseFirepowerLevel();

    this.scene.sound.add(GAME_ASSET_KEYS.audioAward).play({ volume: 0.5 });
  }

  public onGameOver(): void {
    this.isGameOver = true;
    this.gameOverCallback();

    Object.entries(this.layoutContainers).forEach(([key, container]) => {
      if (key === "sceneContainer") return;
      if (key === "endScreenComponent") {
        container.gameResult = "DEFEAT";
        container.setVisibility(true);
      }
    });

    this.layoutContainers.endScreenComponent.setVisibility(true);
    this.scene.sound.add(GAME_ASSET_KEYS.audioDefeat).play({ volume: 0.5 });
  }

  public onGameVictory(): void {
    this.isGameOver = true;
    this.gameOverCallback();

    Object.entries(this.layoutContainers).forEach(([key, container]) => {
      if (key === "sceneContainer") return;
      if (key === "endScreenComponent") {
        container.gameResult = "VICTORY";
        container.setVisibility(true);
      }
    });
    this.scene.sound.add(GAME_ASSET_KEYS.audioVictory).play({ volume: 0.5 });
  }

  public update(time: number): void {
    if (this.isGameOver) return;
    this.layoutContainers.player.update();
    this.layoutContainers.firepower.update();
    this.layoutContainers.gate.update(time);
    this.layoutContainers.enemy.update(time);
    this.layoutContainers.supplement.update(time);
    this.layoutContainers.finishLine.update(time);
  }

  public onStart(gameOver: () => void): void {
    this.gameOverCallback = gameOver;
    this.layoutContainers.player.onStart();
    this.layoutContainers.firepower.onStart();
    this.layoutContainers.gate.onStart();
    this.layoutContainers.enemy.onStart();
    this.layoutContainers.supplement.onStart();
    this.layoutContainers.finishLine.onStart();
    this.layoutContainers.landing.destroy();
    this.scene.sound
      .add(GAME_ASSET_KEYS.audioBGM)
      .play({ volume: 0.4, loop: true });
  }
}
