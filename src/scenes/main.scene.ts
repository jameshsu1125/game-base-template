import Phaser from "phaser";
import SceneLayoutManager from "../managers/layout/scene-layout.manager";
import ServiceLocator from "../services/service-locator/service-locator.service";
import ServiceRegistry from "../services/service-registry.service";

// import { DebugOverlay } from "../services/event-bus/debug-overlay";
import EndScreenSystem from "../systems/end-screen.system";

export default class MainScene extends Phaser.Scene {
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
  }

  private initializeChoreography(): void {
    this.initializeSystems();
  }

  private initializeSystems(): void {
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").createGameAreas();
    ServiceLocator.get<EndScreenSystem>("victorySystem").initialize();
  }

  update() {
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").update();
  }
}
