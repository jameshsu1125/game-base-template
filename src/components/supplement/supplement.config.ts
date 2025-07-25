import { Image, Sprite, TQuadrant } from "@/configs/constants/constants";
import SupplementWithCounterComponent from "./supplementWithCounter.component";
import ServiceLocator from "@/services/service-locator/service-locator.service";
import SceneLayoutManager from "@/managers/layout/scene-layout.manager";

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

export const hitSupplementEffect = (items: (Sprite | Image)[]) => {
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

export const getSupplementItemEffect = (
  bucket: Sprite,
  item: Image,
  graphicsName: string,
  onStart: () => void,
  onComplete: () => void
) => {
  const { scene } = bucket;

  const originalX = bucket.x;
  const originalY = bucket.y;

  const shakeIntensity = 3;

  if (onStart) onStart();
  if (bucket.body) bucket.body.enable = false;

  const tweenQueue = {
    itemY: false,
    itemX: false,
    bucket: false,
  };

  const complete = () => {
    if (tweenQueue.itemY && tweenQueue.itemX && tweenQueue.bucket) {
      onComplete();
    }
  };

  scene.tweens.add({
    targets: bucket,
    x: originalX + shakeIntensity,
    y: originalY + shakeIntensity,
    duration: 50,
    yoyo: true,
    repeat: 3,
    ease: "Power2.easeInOut",
  });

  const color = { r: 255, g: 255, b: 255 };
  scene.tweens.add({
    targets: color,
    r: 0,
    g: 0,
    b: 0,
    duration: 400,
    ease: "Power2.easeIn",
    onUpdate: () => {
      const tint = Phaser.Display.Color.GetColor(
        Math.floor(color.r),
        Math.floor(color.g),
        Math.floor(color.b)
      );
      bucket.setTint(tint);
    },
    onComplete: () => {
      bucket.setTint(0x000000);
      tweenQueue.bucket = true;
      complete();
    },
  });

  const fireEmitter = scene.add.particles(bucket.x, bucket.y, graphicsName, {
    speed: { min: 180, max: 350 },
    angle: { min: 0, max: 360 },
    scale: { start: 0.3, end: 0 },
    blendMode: "ADD",
    lifespan: { min: 100, max: 500 },
    tint: [0xff0000, 0xffa500, 0xffff00],
    quantity: 40,
  });

  fireEmitter.explode(30);

  const { player } =
    ServiceLocator.get<SceneLayoutManager>("gameAreaManager").layoutContainers;

  scene.tweens.add({
    targets: item,
    x: player.players[0]?.player?.x || 0,
    duration: 400,
    ease: "Cubic.easeOut",
    onComplete: () => {
      tweenQueue.itemX = true;
      complete();
    },
  });

  scene.tweens.add({
    targets: item,
    y: player.players[0]?.player?.y || 0,
    alpha: 0,
    duration: 400,
    ease: "Back.easeIn",
    onComplete: () => {
      tweenQueue.itemY = true;
      complete();
    },
  });
};
