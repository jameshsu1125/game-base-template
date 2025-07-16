import GateWithCounterComponent from "./gateWithCounter.component";

export type TGateState = {
  startTime: number;
  target: GateWithCounterComponent;
};

export type TQuadrantX = -1 | 0 | 1;

export const GATE_COMPONENT_SIZE = {
  width: 154,
  height: 154,
};

export const GATE_MISS_OFFSET_RATIO = 1.8; // Ratio to adjust the position of the gate when it is missed

export const GATE_TEXT_STYLE = {
  fontSize: "44px",
  color: "#ffffff",
  fontFamily: "monospace",
  align: "center",
};
