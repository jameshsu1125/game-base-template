import Phaser from "phaser";

export enum EndGameResult {
  VICTORY = "VICTORY",
  DEFEAT = "DEFEAT",
}

export interface ResultComponentConfig {
  type: EndGameResult;
  onRestart?: () => void;
}

export class EndScreenOverlayComponent extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.build();
    this.setVisible(false);
  }

  private build(): void {}

  public show(): void {
    this.setVisible(true);
    if (this.parentContainer) {
      this.parentContainer.bringToTop(this);
    }
  }
}
