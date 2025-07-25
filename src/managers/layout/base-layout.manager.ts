import Phaser from "phaser";

export interface AnchorPoint {
    x: number;
    y: number;
}

export interface PositionableGameObject {
    setPosition: (x: number, y: number) => any;
    setOrigin?: (x: number, y: number) => any;
}

export interface LayoutDimensions {
    width: number;
    height: number;
}

/**
 * BaseLayoutManager - Core positioning logic for all layout operations
 *
 * Responsibilities:
 * - Anchor-based positioning
 * - Grid-based positioning
 * - Percentage-based sizing
 * - Container-relative positioning
 * - Responsive calculations
 *
 * This class provides the foundation for all layout operations and ensures
 * consistent positioning across all UI elements.
 */
export default class BaseLayoutManager {
    protected scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    private getScreenDimensions(): LayoutDimensions {
        return {
            width: this.scene.scale.width,
            height: this.scene.scale.height,
        };
    }

    // Validation methods
    private validateAnchorPoint(anchor: AnchorPoint): void {
        if (
            !anchor ||
            typeof anchor.x !== "number" ||
            typeof anchor.y !== "number"
        ) {
            throw new Error("[BaseLayoutManager] Invalid anchor point");
        }
        if (anchor.x < 0 || anchor.x > 1 || anchor.y < 0 || anchor.y > 1) {
            throw new Error(
                "[BaseLayoutManager] Anchor values must be between 0 and 1"
            );
        }
    }

    private validateOffsetPercentages(offsetX: number, offsetY: number): void {
        if (typeof offsetX !== "number" || typeof offsetY !== "number") {
            throw new Error(
                "[BaseLayoutManager] Offset values must be numbers"
            );
        }
        // Allow negative offsets for positioning flexibility
        if (Math.abs(offsetX) > 2 || Math.abs(offsetY) > 2) {
            console.warn(
                "[BaseLayoutManager] Large offset values may cause positioning issues"
            );
        }
    }

    public placeAt(
        gameObject: PositionableGameObject,
        anchor: AnchorPoint,
        offsetXPercent: number = 0,
        offsetYPercent: number = 0
    ): void {
        this.validateAnchorPoint(anchor);
        this.validateOffsetPercentages(offsetXPercent, offsetYPercent);

        const { width, height } = this.getScreenDimensions();

        const xPos = width * anchor.x + width * offsetXPercent;
        const yPos = height * anchor.y + height * offsetYPercent;

        gameObject.setPosition(xPos, yPos);

        // Set origin to match anchor point if supported
        if (gameObject.setOrigin) {
            gameObject.setOrigin(anchor.x, anchor.y);
        }
    }

    public placeBelow(
        target: Phaser.GameObjects.GameObject & {
            x: number;
            y: number;
            displayHeight: number;
        },
        gameObject: PositionableGameObject & { displayHeight: number },
        padding: number = 0
    ): void {
        const yPos =
            target.y +
            target.displayHeight / 2 +
            padding +
            gameObject.displayHeight / 2;

        gameObject.setPosition(target.x, yPos);
    }
}

