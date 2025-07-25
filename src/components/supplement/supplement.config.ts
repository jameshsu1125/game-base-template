import { Image, Sprite, TQuadrant } from "@/configs/constants/constants";
import SupplementWithCounterComponent from "./supplementWithCounter.component";

export type TSupplementState = {
  startTime: number;
  target: SupplementWithCounterComponent;
};

export type TSupplementType = "GUN" | "ARMY";

export type TConfig = {
  type: TSupplementType;
  count: number;
  quadrant: TQuadrant;
};

export const hitSupplement = (items: (Sprite | Image)[]) => {
  const [supplement, item] = items;
  const { scene } = supplement;
  const originalScaleX = supplement.scaleX;
  const originalScaleY = supplement.scaleY;
  const holdDuration = 10; // Duration to hold the white flash effect

  scene.tweens.add({
    targets: [supplement, item],
    scaleX: originalScaleX * 1.05, // 5% scale up
    scaleY: originalScaleY * 1.05,
    duration: 10,
    hold: holdDuration,
    yoyo: true,
    ease: "Power2",
    onStart: () => {
      items.forEach((item) => {
        item.setTintFill(0xffffff); // White flash
      });
    },
    onYoyo: () => {
      items.forEach((item) => {
        item.clearTint(); // Remove tint on return
      });
    },
  });
};
