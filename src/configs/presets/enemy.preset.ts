type TBlood = {
  type: "ghost" | "boss";
  max: number;
  value: number;
  color: number;
};

type TEnemyPresetConfig = {
  time: number;
  data: {
    x: number;
    type: "follow" | "straight";
    blood: {
      type: "ghost" | "boss";
      max: number;
      value: number;
      color: number;
    };
  };
};

const practiceEnemy: TBlood = {
  type: "ghost",
  max: 100,
  value: 100,
  color: 0x60df4a,
};

const smallEnemy: TBlood = {
  type: "ghost",
  max: 400,
  value: 400,
  color: 0x7055b7,
};

const boss: TBlood = {
  type: "boss",
  max: 7000,
  value: 7000,
  color: 0xff6600,
};

export const enemyEntityConfig: TEnemyPresetConfig[] = [
  { time: 2000, data: { x: 50, type: "follow", blood: smallEnemy } },
  { time: 3500, data: { x: 25, type: "follow", blood: smallEnemy } },
  { time: 4500, data: { x: 45, type: "follow", blood: smallEnemy } },
  { time: 5500, data: { x: 75, type: "follow", blood: smallEnemy } },
  { time: 7500, data: { x: 25, type: "follow", blood: smallEnemy } },
  { time: 8500, data: { x: 75, type: "follow", blood: smallEnemy } },
  { time: 9000, data: { x: 25, type: "follow", blood: smallEnemy } },
  { time: 12300, data: { x: 15, type: "follow", blood: smallEnemy } },
  { time: 13000, data: { x: 75, type: "follow", blood: smallEnemy } },
  { time: 13800, data: { x: 35, type: "follow", blood: smallEnemy } },
  { time: 16000, data: { x: 25, type: "follow", blood: smallEnemy } },
  { time: 17500, data: { x: 55, type: "follow", blood: smallEnemy } },
  { time: 18300, data: { x: 50, type: "follow", blood: smallEnemy } },
  { time: 19700, data: { x: 70, type: "follow", blood: smallEnemy } },
  { time: 21900, data: { x: 55, type: "follow", blood: smallEnemy } },
  { time: 23900, data: { x: 25, type: "follow", blood: smallEnemy } },
  { time: 26800, data: { x: 55, type: "follow", blood: smallEnemy } },
  { time: 27400, data: { x: 70, type: "follow", blood: smallEnemy } },
  { time: 28000, data: { x: 20, type: "follow", blood: smallEnemy } },
  { time: 28800, data: { x: 50, type: "follow", blood: smallEnemy } },
  { time: 29400, data: { x: 34, type: "follow", blood: smallEnemy } },
  { time: 30000, data: { x: 55, type: "follow", blood: boss } },
];

export const enemyEntityPresetConfig: TEnemyPresetConfig[] = [
  { time: -500, data: { x: 20, type: "follow", blood: practiceEnemy } },
  { time: -1000, data: { x: 50, type: "follow", blood: practiceEnemy } },
  { time: -1500, data: { x: 76, type: "follow", blood: practiceEnemy } },
  { time: -2000, data: { x: 30, type: "follow", blood: practiceEnemy } },
  { time: -3000, data: { x: 45, type: "follow", blood: practiceEnemy } },
  { time: -4000, data: { x: 70, type: "follow", blood: practiceEnemy } },
  { time: -6000, data: { x: 20, type: "follow", blood: practiceEnemy } },
  { time: -7000, data: { x: 80, type: "follow", blood: practiceEnemy } },
];
