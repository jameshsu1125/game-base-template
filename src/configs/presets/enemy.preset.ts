const ghostBlood: { type: "ghost" | "boss"; max: number; value: number } = {
  type: "ghost",
  max: 100,
  value: 100,
};

const bossBlood: { type: "ghost" | "boss"; max: number; value: number } = {
  type: "boss",
  max: 10000,
  value: 10000,
};

export const enemyEntityConfig: {
  time: number;
  data: {
    x: number;
    type: "follow" | "straight";
    blood: {
      type: "ghost" | "boss";
      max: number;
      value: number;
    };
  };
}[] = [
  { time: 2000, data: { x: 50, type: "straight", blood: ghostBlood } },
  { time: 4500, data: { x: 25, type: "straight", blood: ghostBlood } },
  { time: 5500, data: { x: 75, type: "straight", blood: ghostBlood } },
  { time: 7500, data: { x: 25, type: "straight", blood: ghostBlood } },
  { time: 8500, data: { x: 75, type: "follow", blood: ghostBlood } },
  { time: 9000, data: { x: 25, type: "straight", blood: ghostBlood } },
  { time: 10000, data: { x: 65, type: "straight", blood: ghostBlood } },
  { time: 12300, data: { x: 15, type: "straight", blood: ghostBlood } },
  { time: 13000, data: { x: 75, type: "follow", blood: ghostBlood } },
  { time: 13800, data: { x: 35, type: "straight", blood: ghostBlood } },
  { time: 16000, data: { x: 25, type: "straight", blood: ghostBlood } },
  { time: 17500, data: { x: 55, type: "straight", blood: ghostBlood } },
  { time: 18300, data: { x: 50, type: "straight", blood: ghostBlood } },
  { time: 19700, data: { x: 70, type: "follow", blood: ghostBlood } },
  { time: 21900, data: { x: 55, type: "straight", blood: ghostBlood } },
  { time: 23900, data: { x: 25, type: "follow", blood: ghostBlood } },
  { time: 26800, data: { x: 55, type: "follow", blood: ghostBlood } },
  { time: 27400, data: { x: 70, type: "straight", blood: ghostBlood } },
  { time: 28000, data: { x: 20, type: "follow", blood: ghostBlood } },
  { time: 28800, data: { x: 50, type: "straight", blood: ghostBlood } },
  { time: 29400, data: { x: 34, type: "follow", blood: ghostBlood } },
  { time: 31400, data: { x: 54, type: "straight", blood: ghostBlood } },
  { time: 32400, data: { x: 24, type: "follow", blood: ghostBlood } },
  { time: 33100, data: { x: 74, type: "straight", blood: ghostBlood } },
  { time: 34400, data: { x: 54, type: "straight", blood: ghostBlood } },
  { time: 35678, data: { x: 24, type: "follow", blood: ghostBlood } },
  { time: 36678, data: { x: 32, type: "follow", blood: ghostBlood } },
  { time: 37542, data: { x: 14, type: "straight", blood: ghostBlood } },
  { time: 38492, data: { x: 34, type: "follow", blood: ghostBlood } },
  { time: 39042, data: { x: 72, type: "follow", blood: ghostBlood } },
  { time: 40000, data: { x: 55, type: "follow", blood: bossBlood } },
];

export const enemyEntityPresetConfig: {
  time: number;
  data: {
    x: number;
    type: "follow" | "straight";
    blood: {
      type: "ghost" | "boss";
      max: number;
      value: number;
    };
  };
}[] = [
  { time: -500, data: { x: 20, type: "follow", blood: ghostBlood } },
  { time: -1000, data: { x: 50, type: "straight", blood: ghostBlood } },
  { time: -2000, data: { x: 30, type: "follow", blood: ghostBlood } },
  { time: -4000, data: { x: 70, type: "follow", blood: ghostBlood } },
  { time: -7000, data: { x: 20, type: "straight", blood: ghostBlood } },
  { time: -8000, data: { x: 80, type: "straight", blood: ghostBlood } },
  { time: -9000, data: { x: 100, type: "straight", blood: ghostBlood } },
  { time: -10000, data: { x: 0, type: "follow", blood: ghostBlood } },
  { time: -12000, data: { x: 55, type: "follow", blood: ghostBlood } },
];
