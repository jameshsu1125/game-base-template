import {
  GAME_MECHANIC_CONFIG_SCHEMA,
  GAME_MECHANIC_CONSTANTS,
} from "@/configs/constants/game-mechanic/game-mechanic.constants";
import { PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD } from "@/configs/constants/game.constants";
import Phaser from "phaser";
import PlayerWidthCounterComponent from "./playerWidthCounter.component";

export class PlayerComponent extends Phaser.GameObjects.Container {
  public group: Phaser.Physics.Arcade.StaticGroup | null = null;
  public players: PlayerWidthCounterComponent[] = [];
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys = undefined;

  private isStarted = false;
  private touchState = { isDown: false, playerX: 0, pointerX: 0 };
  public playersCount = GAME_MECHANIC_CONSTANTS.playerReinforce;
  private index = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    this.build();
  }

  private build(): void {
    this.cursors = this.scene.input.keyboard?.createCursorKeys();
    this.createPlayer(this.playersCount);
  }

  private createPlayer(count: number): void {
    const { max } = GAME_MECHANIC_CONFIG_SCHEMA.playerReinforce;
    const currentCount =
      this.players.length + count > max ? max - this.players.length : count;

    if (currentCount <= 0) return;

    [...new Array(currentCount).keys()].forEach(() => {
      const player = new PlayerWidthCounterComponent(
        this.scene,
        `player-${this.index++}`
      );
      this.group?.add(player);
      this.players.push(player);
    });
    this.calculatePlayersPosition();
  }

  private setCurrentPositionByUserInput(targetX: number, _: number): void {
    const [player] = this.players;
    if (player.player === null) return;
    const minX =
      -this.scene.scale.width * 0.5 + player.player!.displayWidth * 0.5;
    const maxX =
      this.scene.scale.width * 0.5 - player.player!.displayWidth * 0.5;
    const currentX = targetX < minX ? minX : targetX > maxX ? maxX : targetX;
    this.x = currentX;
    this.calculatePlayersPosition(currentX);
  }

  private calculatePlayersPosition(offset: number = 0): void {
    const total = this.players.length;
    this.players.forEach((player, index) => {
      if (!player.player) return;
      player.setPositionByIndex(index, offset, total);
    });
  }

  public increasePlayersCount(count: number = 1): void {
    if (count > 0) this.createPlayer(count);
    else {
      const currentDiscount = Math.min(
        this.players.length - 1,
        Math.abs(count)
      );

      this.players
        .splice(-currentDiscount, currentDiscount)
        .forEach((player) => {
          player.destroy();
        });
    }
  }

  public onStart(): void {
    this.isStarted = true;
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.touchState.isDown = true;
      this.touchState.playerX = this.x;
      this.touchState.pointerX = pointer.x;
    });
    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.touchState.isDown) {
        const deltaX = pointer.x - this.touchState.pointerX;
        const targetX = this.touchState.playerX + deltaX;
        this.setCurrentPositionByUserInput(targetX, deltaX);
      }
    });
    this.scene.input.on("pointerup", () => {
      this.touchState.isDown = false;
    });
  }

  public update(): void {
    if (!this.cursors || this.players.length === 0 || !this.isStarted) return;
    const deltaX = this.cursors.left.isDown
      ? -PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : this.cursors.right.isDown
      ? PLAYER_MOVE_SPEED_BY_INPUT_KEYBOARD
      : 0;
    const targetX = this.x + deltaX;
    this.setCurrentPositionByUserInput(targetX, deltaX);
  }
}
