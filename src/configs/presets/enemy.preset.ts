export const enemyEntityConfig: {
  time: number;
  index: number;
  data: { x: number; type: "follow" | "straight" }[];
}[] = [
  { time: 2000, index: 1, data: [{ x: 50, type: "follow" }] },
  { time: 7500, index: 2, data: [{ x: 20, type: "straight" }] },
  { time: 8000, index: 3, data: [{ x: -30, type: "follow" }] },
  { time: 17500, index: 4, data: [{ x: -30, type: "straight" }] },
  { time: 19000, index: 5, data: [{ x: 30, type: "follow" }] },
  { time: 21000, index: 6, data: [{ x: 20, type: "straight" }] },
  { time: 32500, index: 7, data: [{ x: 0, type: "follow" }] },
  { time: 33500, index: 8, data: [{ x: 20, type: "straight" }] },
];

export const enemyEntityPresetConfig: {
  time: number;
  data: { x: number; type: "follow" | "straight" };
}[] = [
  { time: -1000, data: { x: 50, type: "straight" } },
  { time: -2000, data: { x: 30, type: "follow" } },
  { time: -4000, data: { x: 70, type: "follow" } },
  { time: -7000, data: { x: 20, type: "straight" } },
  { time: -8000, data: { x: 80, type: "straight" } },
  { time: -9000, data: { x: 100, type: "straight" } },
  { time: -10000, data: { x: 0, type: "follow" } },
  { time: -12000, data: { x: 20, type: "follow" } },
];
