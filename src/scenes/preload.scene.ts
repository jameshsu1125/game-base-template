// PreloadScene: Loads all assets for the merge game
import Phaser from "phaser";
import { gameAssets } from "../features/asset-management/game-assets";
import { loadAssetsFromMap } from "../features/asset-management/load-assets-from-map";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        loadAssetsFromMap(this, gameAssets.assets);
    }

    create() {
        this.scene.start("MainScene");
    }
}

