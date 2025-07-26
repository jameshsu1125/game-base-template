const ghost: {
  type: "ghost" | "boss";
  max: number;
  value: number;
  color: number;
} = {
  type: "ghost",
  max: 100,
  value: 100,
  color: 0x60df4a,
};

const minorBoss: {
  type: "ghost" | "boss";
  max: number;
  value: number;
  color: number;
} = {
  type: "ghost",
  max: 5000,
  value: 5000,
  color: 0x7055b7,
};

const boss: {
  type: "ghost" | "boss";
  max: number;
  value: number;
  color: number;
} = {
  type: "boss",
  max: 8000,
  value: 8000,
  color: 0x60df4a,
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
      color: number;
    };
  };
}[] = [
  { time: 2000, data: { x: 50, type: "follow", blood: ghost } },
  { time: 3500, data: { x: 25, type: "follow", blood: ghost } },
  { time: 4500, data: { x: 45, type: "follow", blood: ghost } },
  { time: 5500, data: { x: 75, type: "follow", blood: ghost } },
  { time: 7500, data: { x: 25, type: "follow", blood: ghost } },
  { time: 8500, data: { x: 75, type: "follow", blood: ghost } },
  { time: 9000, data: { x: 25, type: "follow", blood: ghost } },
  { time: 10000, data: { x: 65, type: "follow", blood: ghost } },
  { time: 12300, data: { x: 15, type: "follow", blood: ghost } },
  { time: 13000, data: { x: 75, type: "follow", blood: ghost } },
  { time: 13800, data: { x: 35, type: "follow", blood: ghost } },
  { time: 16000, data: { x: 25, type: "follow", blood: ghost } },
  { time: 17500, data: { x: 55, type: "follow", blood: ghost } },
  { time: 18300, data: { x: 50, type: "follow", blood: ghost } },
  { time: 19700, data: { x: 70, type: "follow", blood: ghost } },
  { time: 21900, data: { x: 55, type: "follow", blood: ghost } },
  { time: 23900, data: { x: 25, type: "follow", blood: ghost } },
  { time: 26800, data: { x: 55, type: "follow", blood: ghost } },
  { time: 27400, data: { x: 70, type: "follow", blood: ghost } },
  { time: 28000, data: { x: 20, type: "follow", blood: ghost } },
  { time: 28800, data: { x: 50, type: "follow", blood: ghost } },
  { time: 29400, data: { x: 34, type: "follow", blood: ghost } },
  { time: 31400, data: { x: 54, type: "follow", blood: ghost } },
  { time: 32400, data: { x: 24, type: "follow", blood: ghost } },
  { time: 33100, data: { x: 74, type: "follow", blood: ghost } },
  { time: 34400, data: { x: 54, type: "follow", blood: ghost } },
  { time: 35678, data: { x: 24, type: "follow", blood: ghost } },
  { time: 36678, data: { x: 32, type: "follow", blood: ghost } },
  { time: 37542, data: { x: 14, type: "follow", blood: ghost } },
  { time: 38492, data: { x: 34, type: "follow", blood: ghost } },
  { time: 39042, data: { x: 72, type: "follow", blood: ghost } },
  { time: 40000, data: { x: 55, type: "follow", blood: boss } },
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
  { time: -500, data: { x: 20, type: "follow", blood: ghost } },
  { time: -1000, data: { x: 50, type: "follow", blood: ghost } },
  { time: -1500, data: { x: 76, type: "follow", blood: ghost } },
  { time: -2000, data: { x: 30, type: "follow", blood: ghost } },
  { time: -3000, data: { x: 45, type: "follow", blood: ghost } },
  { time: -4000, data: { x: 70, type: "follow", blood: ghost } },
  { time: -6000, data: { x: 20, type: "follow", blood: ghost } },
  { time: -7000, data: { x: 80, type: "follow", blood: ghost } },
  { time: -8000, data: { x: 100, type: "follow", blood: ghost } },
];
