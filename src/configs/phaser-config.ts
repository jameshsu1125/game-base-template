// Phaser game configuration for Match & Fight Game
import Phaser from "phaser";
import BootScene from "../scenes/boot.scene";
import MainScene from "../scenes/main.scene";
import PreloadScene from "../scenes/preload.scene";

export const phaserConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#1a4f3c", // Dark green background
    parent: "game-container",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 400,
        height: 600,
        parent: "app",
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scene: [BootScene, PreloadScene, MainScene],
};

