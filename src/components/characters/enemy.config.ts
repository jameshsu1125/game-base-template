import EnemyWithCounterComponent from "./enemyWithCounter.component";
import { PLAYER_COMPONENT_HEALTH_BAR_SIZE } from "./player.config";

export type TEnemyState = {
  startTime: number;
  target: EnemyWithCounterComponent;
};
