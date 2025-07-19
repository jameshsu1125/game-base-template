import BezierEasing from "bezier-easing";

export const ENEMY_PERSPECTIVE = 5;

export const LOGO_WIDTH_SCALE_RATIO = 99 / 320;

export const PLAYER_WIDTH_SCALE_RATIO = 30 / 320;
export const PLAYER_OFFSET_Y = -100;
export const PLAYER_GROUP_GAP = 20; // each player gap
export const PLAYER_HEALTH_BAR_OFFSET_Y = 10;

export const ENEMY_WIDTH_SCALE_RATIO = 80 / 320;
export const ENEMY_HEALTH_BAR_OFFSET_Y = -7;
export const ENEMY_FAR_RANDOM_WIDTH = 100;

export const GATE_WIDTH_SCALE_RATIO = 160 / 320;

export const SUPPLEMENT_BUCKET_WIDTH_SCALE_RATIO = 120 / 320;
export const SUPPLEMENT_TEXT_OFFSET_Y = -60;
export const SUPPLEMENT_BUCKET_GAP = 20;

export const Easing = BezierEasing(0.55, 0.085, 0.68, 0.53);

export const adjustmentOffsetTime = 500; // 開始遊戲後，補給出現的時間延遲

export const END_CARD_RESULT_WIDTH_SCALE_RATIO = 300 / 320;
export const END_CARD_RESULT_OFFSET_Y = -50;
export const END_CARD_BUTTON_WIDTH_SCALE_RATIO = 200 / 320;
export const END_CARD_BUTTON_OFFSET_Y = 150;
