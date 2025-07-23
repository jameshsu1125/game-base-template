import { TQuadrant } from "../constants/constants";

export const supplementEntityConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" }[];
}[] = [
  {
    time: 5000,
    data: [{ quadrant: 0, count: 50, type: "ARMY" }],
  },
  {
    time: 15000,
    data: [{ quadrant: 1, count: 90, type: "ARMY" }],
  },
  {
    time: 25000,
    data: [{ quadrant: -1, count: 105, type: "ARMY" }],
  },
];

export const supplementEntityPresetConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" };
}[] = [
  { time: -5000, data: { quadrant: -1, count: 4, type: "ARMY" } },
  { time: -5000, data: { quadrant: 1, count: 3, type: "GUN" } },
];
