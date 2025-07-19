import { TQuadrant } from "@/configs/constants/constants";
import SupplementWithCounterComponent from "./supplementWithCounter.component";

export type TSupplementState = {
  startTime: number;
  target: SupplementWithCounterComponent;
};

export type TSupplementType = "GUN" | "ARMY";

export type TConfig = {
  type: TSupplementType;
  count: number;
  quadrant: TQuadrant;
};
