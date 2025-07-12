import Phaser from "phaser";
import {
    ENEMY_AVATAR,
    MATCH_FIGHT_LOGO_WIDTH_SCALE_RATIO,
    REMAINING_MOVES,
} from "../../configs/constants/layout.constants";
import { MATCH_FIGHT_ASSET_KEYS } from "../../features/asset-management/game-assets";
import { getDisplaySizeByWidthPercentage } from "../../utils/layout.utils";
import { EnemyAvatarComponent } from "./enemy-avatar.component";
import { RemainingMoves } from "./remaining-move.component";

export class TopBarComponent extends Phaser.GameObjects.Container {
    private remainingMoves: RemainingMoves;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);

        const enemyAvatar = this.createEnemyAvatar();
        const logo = this.createLogo();
        this.remainingMoves = this.createRemainingMoves();

        this.add([enemyAvatar, logo, this.remainingMoves]);
    }

    private createLogo(): Phaser.GameObjects.Image {
        const logo = this.scene.add.image(
            0,
            0,
            MATCH_FIGHT_ASSET_KEYS.gameLogo
        );
        logo.setPosition(0, 0);
        const { width: logoWidth, height: logoHeight } =
            getDisplaySizeByWidthPercentage(
                logo,
                MATCH_FIGHT_LOGO_WIDTH_SCALE_RATIO
            );
        logo.setDisplaySize(logoWidth, logoHeight);
        return logo;
    }

    private createEnemyAvatar(): EnemyAvatarComponent {
        const enemyAvatar = new EnemyAvatarComponent(this.scene);
        const enemyAvatarX =
            this.scene.scale.width * ENEMY_AVATAR.CONTAINER.OFFSET_X;
        enemyAvatar.setPosition(enemyAvatarX, 0);
        return enemyAvatar;
    }

    private createRemainingMoves(): RemainingMoves {
        const remainingMoves = new RemainingMoves(this.scene);
        const remainingMovesX =
            this.scene.scale.width * REMAINING_MOVES.OFFSET_X;
        remainingMoves.setPosition(remainingMovesX, 0);
        return remainingMoves;
    }

    public updateMoves(moves: number): void {
        this.remainingMoves.updateMoves(moves);
    }
}

