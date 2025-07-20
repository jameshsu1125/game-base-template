import EnemyEntity from "@/entities/enemy.entity";
import FirepowerEntity from "@/entities/firepower.entity";
import GateEntity from "@/entities/gate.entity";
import SupplementEntity from "@/entities/supplement.entity";
import Phaser from "phaser";
import SceneLayoutManager from "../managers/layout/scene-layout.manager";
import ServiceLocator from "../services/service-locator/service-locator.service";
import ServiceRegistry from "../services/service-registry.service";
import EndScreenSystem from "../systems/end-screen.system";
import FinishLineEntity from "@/entities/finishLine.entity";
import { STOP_COLLISION } from "@/configs/constants/game.constants";
// import { DebugOverlay } from "../services/event-bus/debug-overlay";

export default class MainScene extends Phaser.Scene {
  private firepowerEntity?: FirepowerEntity;
  private gateEntity?: GateEntity;
  private enemyEntity?: EnemyEntity;
  private supplementEntity?: SupplementEntity;
  private finishLineEntity?: FinishLineEntity;

  private isGameOver = false;
  private updateTime: number = 0;
  public zIndex: number = 998;

  constructor() {
    super("MainScene");
  }

  /**
   * This fn gets called by Phaser.js when the scene is created
   */
  create() {
    // DebugOverlay.getInstance();
    new ServiceRegistry(this);
    this.initializeChoreography();
    this.initEventListeners();
  }

  private initializeChoreography(): void {
    this.initializeSystems();
  }

  private initializeSystems(): void {
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").createGameAreas();
    ServiceLocator.get<EndScreenSystem>("victorySystem").initialize();
  }

  private initEventListeners(): void {
    this.addOnStartListener();
    this.addEntityListener();
  }

  private addEntityListener(): void {
    this.firepowerEntity = new FirepowerEntity();
    this.gateEntity = new GateEntity();
    this.enemyEntity = new EnemyEntity();
    this.supplementEntity = new SupplementEntity();
    this.finishLineEntity = new FinishLineEntity();
  }

  private addOnStartListener(): void {
    const onUserInput = () => {
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").onStart(
        this.onGameOver.bind(this)
      );

      this.firepowerEntity?.onStart();
      this.gateEntity?.onStart(this.updateTime);
      this.enemyEntity?.onStart(this.updateTime);
      this.supplementEntity?.onStart(this.updateTime);
      this.finishLineEntity?.onStart(this.updateTime);

      window.removeEventListener("pointerdown", onUserInput);
      window.removeEventListener("keydown", onUserInput);
    };
    window.addEventListener("pointerdown", onUserInput);
    window.addEventListener("keydown", onUserInput);
    window.addEventListener("blur", () => {
      if (!STOP_COLLISION) return location.reload();
    });
  }

  public getIndex(): number {
    this.zIndex -= 1;
    return this.zIndex;
  }

  private onGameOver(): void {
    this.isGameOver = true;
  }

  update(time: number, delta: number): void {
    this.updateTime = time;
    if (this.isGameOver) return;
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").update(time);
    this.firepowerEntity?.update(time, delta);
    this.gateEntity?.update(time);
    this.enemyEntity?.update(time);
    this.supplementEntity?.update(time);
    this.finishLineEntity?.update(time);
  }
}
