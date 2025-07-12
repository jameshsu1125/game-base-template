import Phaser from "phaser";
import { ENEMY_AVATAR } from "../../configs/constants/layout.constants";
import { MATCH_FIGHT_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { getDisplaySizeByWidthPercentage } from "../../utils/layout.utils";
import { ContainerFrame } from "../reusables/container-frame.component";

export class EnemyAvatarComponent extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.build();
    }

    private build(): void {
        const avatarImage = this.scene.add.image(
            0,
            0,
            MATCH_FIGHT_ASSET_KEYS.enemyAvatar
        );
        const { width: avatarWidth, height: avatarHeight } =
            getDisplaySizeByWidthPercentage(
                avatarImage,
                ENEMY_AVATAR.IMAGE.WIDTH_SCALE_RATIO
            );

        const avatarContainer = this.scene.add.container(0, 0);
        avatarImage.setDisplaySize(avatarWidth, avatarHeight);
        avatarContainer.add(avatarImage);

        const avatarFrame = new ContainerFrame(this.scene, avatarContainer);
        this.add(avatarFrame);
    }
}

