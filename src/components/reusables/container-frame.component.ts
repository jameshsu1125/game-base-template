import Phaser from "phaser";
import { MATCH_FIGHT_ASSET_KEYS } from "../../features/asset-management/game-assets";

export class ContainerFrame extends Phaser.GameObjects.Container {
    constructor(
        scene: Phaser.Scene,
        innerContainer: Phaser.GameObjects.Container
    ) {
        super(scene);
        this.assembleComponents(innerContainer);
    }

    private assembleComponents(
        innerContainer: Phaser.GameObjects.Container
    ): void {
        // Add the new frame with shadow asset
        const frame = this.scene.add.image(
            0,
            0,
            MATCH_FIGHT_ASSET_KEYS.enemyAvatarContainerWithShadow
        );
        frame.setOrigin(0.5, 0.5);
        frame.setScale(1.3);
        this.add(frame);

        this.add(innerContainer);
    }
}

