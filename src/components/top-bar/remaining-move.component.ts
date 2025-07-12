import Phaser from "phaser";
import { GAME_MECHANIC_CONSTANTS } from "../../configs/constants/game-mechanic/game-mechanic.constants";
import { REMAINING_MOVES } from "../../configs/constants/layout.constants";
import { ContainerFrame } from "../reusables/container-frame.component";

export class RemainingMoves extends Phaser.GameObjects.Container {
    private movesCountText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);

        const containerFrame = new ContainerFrame(scene, this);

        const movesLabelText = scene.add
            .text(
                REMAINING_MOVES.MOVES_TEXT.OFFSET_X,
                REMAINING_MOVES.MOVES_TEXT.OFFSET_Y,
                "MOVES",
                {
                    fontSize: "12px",
                    fontStyle: "bold",
                    color: "yellow",
                    fontFamily: "LTMuseum-Light",
                }
            )
            .setOrigin(0.5, 0.5)
            .setResolution(2);

        this.movesCountText = scene.add
            .text(
                REMAINING_MOVES.MOVES_COUNT.OFFSET_X,
                REMAINING_MOVES.MOVES_COUNT.OFFSET_Y,
                `${GAME_MECHANIC_CONSTANTS.initialMoves}`,
                {
                    fontSize: "30px",
                    fontStyle: "bold",
                    color: "#ffffff",
                    fontFamily: "LTMuseum-Light",
                }
            )
            .setOrigin(0.5, 0.5)
            .setResolution(2);

        this.add([containerFrame, movesLabelText, this.movesCountText]);
        scene.add.existing(this);
    }

    public updateMoves(moves: number): void {
        this.movesCountText.setText(`${moves}`);
    }
}

