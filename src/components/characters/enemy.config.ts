import EnemyWithCounterComponent from "./enemyWithCounter.component";
import { PLAYER_COMPONENT_HEALTH_BAR_SIZE } from "./player.config";

export type TEnemyState = {
  startTime: number;
  target: EnemyWithCounterComponent;
};

export const HEALTH_BAR_TEXT_STYLE = {
  fontSize: "7px",
  color: "rgba(0,0,0,0)",
  fontFamily: "monospace",
  align: "center",
  fixedWidth: 20,
  fixedHeight: PLAYER_COMPONENT_HEALTH_BAR_SIZE.height - 2,
  shadow: {
    fill: true,
    color: "#000000",
    offsetX: 1,
    offsetY: 1,
    blur: 2,
    stroke: true,
  },
};
