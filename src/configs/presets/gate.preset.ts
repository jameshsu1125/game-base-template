import { TQuadrant } from "../constants/constants";

export const gateEntityConfig: {
  time: number;
  data: { quadrant: TQuadrant; count: number }[];
}[] = [
  {
    time: 0,
    data: [
      { quadrant: 1, count: -12 },
      { quadrant: -1, count: 1 },
    ],
  },
  {
    time: 10000,
    data: [
      { quadrant: 1, count: 0 },
      { quadrant: -1, count: -23 },
    ],
  },
  {
    time: 20000,
    data: [
      { quadrant: 1, count: -5 },
      { quadrant: -1, count: -3 },
    ],
  },
];

export const gateEntityPresetConfig: {
  time: number;
  index: number;
  data: { quadrant: TQuadrant; count: number };
}[] = [];
