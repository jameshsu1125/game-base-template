import SupplementWithCounterComponent from "./supplementWithCounter.component";

export type TQuadrantX = -1 | 0 | 1;
export type TSupplementState = {
  startTime: number;
  target: SupplementWithCounterComponent;
};

export const SUPPLEMENT_MISS_OFFSET_RATIO = 2.8; // Ratio to adjust the position of the gate when it is missed

export type TSupplementType = "GUN" | "ARMY";
