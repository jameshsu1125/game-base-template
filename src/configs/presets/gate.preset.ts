import { TQuadrant } from "../constants/constants";

export const gateEntityConfig: {
  time: number;
  index: number;
  data: { quadrant: TQuadrant; count: number }[];
}[] = [
  {
    time: 0,
    index: 1,
    data: [
      { quadrant: 1, count: -12 },
      { quadrant: -1, count: 1 },
    ],
  },
  {
    time: 15000,
    index: 2,
    data: [
      { quadrant: 1, count: 1 },
      { quadrant: -1, count: -30 },
    ],
  },
  { time: 20000, index: 3, data: [{ quadrant: 1, count: -231 }] },
  { time: 30000, index: 4, data: [{ quadrant: -1, count: -542 }] },
];

export const gateEntityPresetConfig: {
  time: number;
  index: number;
  data: { quadrant: TQuadrant; count: number }[];
}[] = [];
