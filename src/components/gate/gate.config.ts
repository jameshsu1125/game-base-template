import GateWithCounterComponent from "./gateWithCounter.component";

export type TGateState = {
  startTime: number;
  target: GateWithCounterComponent;
};

export type TQuadrantX = -1 | 0 | 1;
