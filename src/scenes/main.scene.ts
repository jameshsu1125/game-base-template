import Phaser from "phaser";
import SceneLayoutManager from "../managers/layout/scene-layout.manager";
import ServiceLocator from "../services/service-locator/service-locator.service";
import ServiceRegistry from "../services/service-registry.service";
import EndScreenSystem from "../systems/end-screen.system";
import FirepowerEntity from "@/entities/firepower.entity";
import GateEntity from "@/entities/gate.entity";
import EnemyEntity from "@/entities/enemy.entity";
// import { DebugOverlay } from "../services/event-bus/debug-overlay";

export default class MainScene extends Phaser.Scene {
  private firepowerEntity?: FirepowerEntity = undefined;
  private gateEntity?: GateEntity = undefined;
  private enemyEntity?: EnemyEntity = undefined;

  private isGameOver = false;

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
  }

  private addOnStartListener(): void {
    const onUserInput = () => {
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").onStart(
        this.onGameOver.bind(this)
      );

      this.firepowerEntity?.onStart();
      this.gateEntity?.onStart();
      this.enemyEntity?.onStart();

      window.removeEventListener("pointerdown", onUserInput);
      window.removeEventListener("keydown", onUserInput);
    };
    window.addEventListener("pointerdown", onUserInput);
    window.addEventListener("keydown", onUserInput);
  }

  private onGameOver(): void {
    this.isGameOver = true;
  }

  update(time: number, delta: number): void {
    if (this.isGameOver) return;
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").update(time);
    this.firepowerEntity?.update(time, delta);
    this.gateEntity?.update(time, delta);
    this.enemyEntity?.update(time, delta);
  }
}
