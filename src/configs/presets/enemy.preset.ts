export const enemyEntityConfig: {
  time: number;
  data: { x: number; type: "follow" | "straight" };
}[] = [
  { time: 2000, data: { x: 50, type: "straight" } },
  { time: 4500, data: { x: 25, type: "straight" } },
  { time: 5500, data: { x: 75, type: "straight" } },
  { time: 7500, data: { x: 25, type: "straight" } },
  { time: 8500, data: { x: 75, type: "follow" } },
  { time: 9000, data: { x: 25, type: "straight" } },
  { time: 10000, data: { x: 65, type: "straight" } },
  { time: 12300, data: { x: 15, type: "straight" } },
  { time: 13000, data: { x: 75, type: "follow" } },
  { time: 13800, data: { x: 35, type: "straight" } },
  { time: 16000, data: { x: 25, type: "straight" } },
  { time: 17500, data: { x: 55, type: "straight" } },
  { time: 18300, data: { x: 50, type: "straight" } },
  { time: 19700, data: { x: 70, type: "follow" } },
  { time: 21900, data: { x: 55, type: "straight" } },
  { time: 23900, data: { x: 25, type: "follow" } },
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
