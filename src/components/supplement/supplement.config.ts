import SupplementWithCounterComponent from "./supplementWithCounter.component";

export type TQuadrantX = -1 | 0 | 1;
export type TSupplementState = {
  startTime: number;
  target: SupplementWithCounterComponent;
};

export type TSupplementType = "GUN" | "ARMY";
export type TConfig = {
  type: TSupplementType;
  count: number;
  quadrant: TQuadrantX;
};
