import Phaser from "phaser";
import { listenMessagesForChangingAssets } from "./_NOT_STANDALONE_GAME_RELATED/handle-message";
import { phaserConfig } from "./configs/phaser-config";

listenMessagesForChangingAssets();
export const game = new Phaser.Game(phaserConfig);

