export const enemyEntityConfig: {
  time: number;
  data: { x: number; type: "follow" | "straight" };
}[] = [
  { time: 2000, data: { x: 50, type: "straight" } },
  { time: 5500, data: { x: 80, type: "straight" } },
  { time: 7000, data: { x: 55, type: "straight" } },
  { time: 7500, data: { x: 25, type: "follow" } },
  { time: 8000, data: { x: 75, type: "follow" } },
  { time: 10000, data: { x: 45, type: "straight" } },
];

export const enemyEntityPresetConfig: {
  time: number;
  data: { x: number; type: "follow" | "straight" };
}[] = [
  { time: -500, data: { x: 20, type: "follow" } },
  { time: -1000, data: { x: 50, type: "straight" } },
  { time: -2000, data: { x: 30, type: "follow" } },
  { time: -4000, data: { x: 70, type: "follow" } },
  { time: -7000, data: { x: 20, type: "straight" } },
  { time: -8000, data: { x: 80, type: "straight" } },
  { time: -9000, data: { x: 100, type: "straight" } },
  { time: -10000, data: { x: 0, type: "follow" } },
  { time: -12000, data: { x: 20, type: "follow" } },
];
