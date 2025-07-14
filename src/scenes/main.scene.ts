import Phaser from "phaser";
import SceneLayoutManager from "../managers/layout/scene-layout.manager";
import ServiceLocator from "../services/service-locator/service-locator.service";
import ServiceRegistry from "../services/service-registry.service";
import EndScreenSystem from "../systems/end-screen.system";
import FirepowerEntity from "@/entities/firepower.entity";
// import { DebugOverlay } from "../services/event-bus/debug-overlay";

export default class MainScene extends Phaser.Scene {
  private firepowerEntity?: FirepowerEntity = undefined;

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
  }

  private addOnStartListener(): void {
    const onUserInput = () => {
      ServiceLocator.get<SceneLayoutManager>("gameAreaManager").onStart();
      this.firepowerEntity?.onStart();
      window.removeEventListener("pointerdown", onUserInput);
      window.removeEventListener("keydown", onUserInput);
    };
    window.addEventListener("pointerdown", onUserInput);
    window.addEventListener("keydown", onUserInput);
  }

  update() {
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").update();
    this.firepowerEntity?.update();
  }
}
