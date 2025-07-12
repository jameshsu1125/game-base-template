import {
    emitGameEvent,
    GameEvents,
} from "../services/event-bus/events.constants";

export interface EnemyConfig {
    id?: string;
    maxHealth?: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}

export default class Enemy {
    private health: number;
    private maxHealth: number;
    private isDestroyed: boolean = false;
    private isActive: boolean = true;
    private position: { x: number; y: number };
    private size: { width: number; height: number };
    private id: string;

    private gameObject?: Phaser.GameObjects.Container;

    constructor(config: EnemyConfig = {}) {
        this.maxHealth = config.maxHealth!;
        this.health = this.maxHealth;
        this.position = config.position ?? { x: 0, y: 0 };
        this.size = config.size ?? { width: 60, height: 60 };
        this.id = config.id ?? "";
    }

    /**
     * Take damage and handle destruction logic
     */
    public takeDamage(damage: number): boolean {
        if (this.isDestroyed || !this.isActive) {
            return false;
        }

        this.health = Math.max(0, this.health - damage);

        // Emit damage event
        // Don't destroy immediately - let the hit animation finish first
        // The VisualEffectsManager will check HP on animation completion
        emitGameEvent(GameEvents.TOWER_DAMAGED, {
            damage,
            previousHealth: this.maxHealth,
            currentHealth: this.health,
            towerId: this.getId(),
        });

        return true;
    }

    public destroy(): void {
        this.isDestroyed = true;
        this.isActive = false;

        emitGameEvent(GameEvents.TOWER_DESTROYED, {
            towerId: this.getId(),
        });

        if (this.gameObject) {
            this.gameObject.setAlpha(0.5);
        }
    }

    /**
     * Get tower bounds for collision detection
     */
    public getBounds(): {
        x: number;
        y: number;
        width: number;
        height: number;
    } {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.size.width,
            height: this.size.height,
        };
    }

    /**
     * Get unique identifier
     */
    public getId(): string {
        return this.id;
    }

    //#region Getters
    public getPosition(): { x: number; y: number } {
        return { ...this.position };
    }

    public getType(): EntityType {
        return EntityType.TOWER;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getIsDestroyed(): boolean {
        return this.isDestroyed;
    }

    public getIsActive(): boolean {
        return this.isActive;
    }

    public getSize(): { width: number; height: number } {
        return this.size;
    }

    public getGameObject(): Phaser.GameObjects.Container | undefined {
        return this.gameObject;
    }
    //#endregion
}

export enum EntityType {
    ENEMY = "ENEMY",
    TOWER = "TOWER",
}

