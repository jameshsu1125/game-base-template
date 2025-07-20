import { TQuadrant } from "../constants/constants";

export const supplementEntityConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" }[];
}[] = [
  {
    time: 4000,
    data: [{ quadrant: 0, count: 30, type: "ARMY" }],
  },
];

export const supplementEntityPresetConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number; type: "ARMY" | "GUN" };
}[] = [
  { time: -5000, data: { quadrant: -1, count: 5, type: "ARMY" } },
  { time: -5000, data: { quadrant: 1, count: 5, type: "GUN" } },
];
