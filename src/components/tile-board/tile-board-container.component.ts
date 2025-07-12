import Phaser from "phaser";
import { TILES_CONTAINER_SCALE_RATIO } from "../../configs/constants/layout.constants";
import { MATCH_FIGHT_ASSET_KEYS } from "../../features/asset-management/game-assets";

interface BoardConfig {}

const DEFAULT_CONFIG: Required<Omit<BoardConfig, "width" | "height">> = {};

export class TileBoardContainer extends Phaser.GameObjects.Container {
    private boardImage!: Phaser.GameObjects.Image;
    private readonly config: Required<BoardConfig> & {
        width: number;
        height: number;
    } = {
        width: this.scene.scale.width * TILES_CONTAINER_SCALE_RATIO,
        height: this.scene.scale.width * TILES_CONTAINER_SCALE_RATIO,
        ...DEFAULT_CONFIG,
    };

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);

        this.boardImage = this.scene.add.image(
            0,
            0,
            MATCH_FIGHT_ASSET_KEYS.gameBoardContainer
        );
        this.add(this.boardImage);
        this.boardImage.setDisplaySize(
            this.config.width * 1.075,
            this.config.height * 1.075
        );

        // Set the container size for hit area and positioning
        this.setSize(this.config.width, this.config.height);
    }

    public getBounds(): Phaser.Geom.Rectangle {
        return new Phaser.Geom.Rectangle(
            this.x - this.config.width / 2,
            this.y - this.config.height / 2,
            this.config.width,
            this.config.height
        );
    }

    public isPointInside(x: number, y: number): boolean {
        const bounds = this.getBounds();
        return bounds.contains(x, y);
    }
}

