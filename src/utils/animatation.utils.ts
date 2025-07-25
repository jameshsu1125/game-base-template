import { Image, Sprite } from "@/configs/constants/constants";
import Tweener from "lesca-object-tweener";

export const setAnimationAsBlank = (
  object: Sprite | Image,
  onComplete?: () => void
) => {
  const from = { time: 0 };
  const to = { time: 1 };
  const tweener = new Tweener({
    from,
    to,
    duration: 500,
    onComplete: () => {
      object.setTint(0xffffff);
    },
  });
  tweener.add({
    from: { time: 1 },
    to: { time: 0 },
    duration: 500,
    onComplete: () => {
      object.setTint(0xffffff);
      if (onComplete) onComplete();
    },
  });
  tweener.play();
};
