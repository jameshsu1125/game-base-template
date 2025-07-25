import { Sprite } from "@/configs/constants/constants";
import GateWithCounterComponent from "./gateWithCounter.component";

export type TGateState = {
  startTime: number;
  target: GateWithCounterComponent;
};

export const hitGateEffect = (object: Sprite, invalid: boolean) => {
  const { scene } = object;
  const originalScaleX = object.scaleX;
  const originalScaleY = object.scaleY;

  const currentColor = invalid ? 0x00ffff : 0xffffff; // Red for invalid, Green for valid

  const holdDuration = 10; // Duration to hold the white flash effect

  scene.tweens.add({
    targets: object,
    scaleX: originalScaleX * 1.05, // 5% scale up
    scaleY: originalScaleY * 1.05,
    duration: 10,
    hold: holdDuration,
    yoyo: true,
    ease: "Power2",
    onStart: () => {
      object.setTintFill(currentColor); // White flash
    },
    onYoyo: () => {
      object.clearTint(); // Remove tint on return
    },
  });
};
