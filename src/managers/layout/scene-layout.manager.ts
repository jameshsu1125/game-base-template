import Phaser from "phaser";
import {
    EndGameResult,
    EndScreenOverlayComponent,
} from "../../components/end-screen.component";

import { TileBoardContainer } from "../../components/tile-board/tile-board-container.component";
import { TopBarComponent } from "../../components/top-bar/top-bar.component";
import { TOP_BAR_OFFSET_Y } from "../../configs/constants/layout.constants";
import { MATCH_FIGHT_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { ANCHORS } from "../../utils/anchors.constants";
import { scaleImageToCover } from "../../utils/layout.utils";
import BaseLayoutManager from "./base-layout.manager";

type Background = Phaser.GameObjects.Image;

export interface LayoutContainers {
    sceneContainer: Phaser.GameObjects.Container;
    topBar: TopBarComponent;
    tileBoardContainer: TileBoardContainer;
    endScreenComponent: EndScreenOverlayComponent;
    background: Background;
}

const BOARD_CONTAINER_OFFSET_Y = 10;

export interface GameAreaConfig {
    containerWidth?: number;
    containerHeight?: number;
}

export default class SceneLayoutManager {
    private scene: Phaser.Scene;
    private constants: Required<GameAreaConfig>;
    private layoutManager: BaseLayoutManager;
    private layoutContainers!: LayoutContainers;

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
        this.layoutContainers.topBar = this.createTopBar();
        this.layoutContainers.tileBoardContainer =
            this.createTileBoardContainer();
        this.layoutContainers.endScreenComponent =
            this.createEndScreenOverlay();

        this.layoutContainers.sceneContainer.add([
            this.layoutContainers.background,
            this.layoutContainers.tileBoardContainer,
            this.layoutContainers.topBar,
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

    private createTopBar(): TopBarComponent {
        const topBar = new TopBarComponent(this.scene);
        topBar.setY(this.scene.scale.height * TOP_BAR_OFFSET_Y);
        return topBar;
    }

    private createBackground(): Background {
        const background = this.scene.add.image(
            0,
            0,
            MATCH_FIGHT_ASSET_KEYS.background
        );
        scaleImageToCover(
            background,
            this.constants.containerWidth,
            this.constants.containerHeight
        );
        return background;
    }

    private createTileBoardContainer(): TileBoardContainer {
        const boardContainer = new TileBoardContainer(this.scene);
        const containerHeight = this.constants.containerHeight;
        boardContainer.setPosition(
            0,
            containerHeight / 2 -
                boardContainer.height / 2 -
                BOARD_CONTAINER_OFFSET_Y // offset of BoardContainer border
        );
        return boardContainer;
    }

    private createEndScreenOverlay(): EndScreenOverlayComponent {
        const endScreenOverlay = new EndScreenOverlayComponent(this.scene);

        const overlayContainer = this.scene.add.container(0, 0);
        overlayContainer.add(endScreenOverlay);
        this.layoutManager.placeAt(overlayContainer, ANCHORS.CENTER);
        return endScreenOverlay;
    }

    public updateMoves(moves: number): void {
        this.layoutContainers.topBar.updateMoves(moves);
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
}

