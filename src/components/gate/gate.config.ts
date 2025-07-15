export type TGateState = {
  name: string;
  direction: -1 | 0 | 1;
  startTime: number;
  scale: number;
  target: Phaser.Physics.Arcade.Sprite;
};

export type TQuadrantX = -1 | 0 | 1;
export const GATE_COMPONENT_SIZE = {
  width: 174,
  height: 174,
};
