import { TQuadrantX } from "@/components/gate/gate.config";

export const GATE_ENTITY_CONFIG: {
  time: number;
  index: number;
  data: { quadrant: TQuadrantX; count: number }[];
}[] = [
  { time: 0, index: 1, data: [{ quadrant: 0, count: -5 }] },
  { time: 10000, index: 2, data: [{ quadrant: 1, count: -30 }] },
  { time: 20000, index: 3, data: [{ quadrant: 1, count: -231 }] },
  { time: 30000, index: 4, data: [{ quadrant: -1, count: -542 }] },
];

export const SUPPLEMENT_ENTITY_CONFIG: {
  time: number;
  index: number;
  data: { quadrant: TQuadrantX; count: number; type: "ARMY" | "GUN" }[];
}[] = [
  { time: 5000, index: 1, data: [{ quadrant: -1, count: 30, type: "ARMY" }] },
  { time: 15000, index: 2, data: [{ quadrant: -1, count: 324, type: "GUN" }] },
  { time: 25000, index: 3, data: [{ quadrant: 0, count: 503, type: "ARMY" }] },
  { time: 35000, index: 4, data: [{ quadrant: 0, count: 873, type: "ARMY" }] },
];

export const ENEMY_ENTITY_CONFIG: {
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
