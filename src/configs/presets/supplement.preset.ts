import { TQuadrant } from "../constants/constants";

export const supplementEntityConfig: {
  time: number;
  index: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" }[];
}[] = [
  { time: 5000, index: 1, data: [{ quadrant: -1, count: 30, type: "ARMY" }] },
  { time: 15000, index: 2, data: [{ quadrant: -1, count: 324, type: "GUN" }] },
  { time: 25000, index: 3, data: [{ quadrant: 0, count: 503, type: "ARMY" }] },
  { time: 35000, index: 4, data: [{ quadrant: 0, count: 873, type: "ARMY" }] },
];

export const supplementEntityPresetConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" };
}[] = [
  { time: -10000, data: { quadrant: -1, count: 1, type: "ARMY" } },
  { time: -10000, data: { quadrant: 0, count: 1, type: "ARMY" } },
  { time: -10000, data: { quadrant: 1, count: 1, type: "ARMY" } },
  { time: -5000, data: { quadrant: 1, count: 20, type: "ARMY" } },
];
