export const gamePreset = {
  perspective: 0.1,
  delta: 16, // default delta when game are not lag
  preventJumpTime: 500,
};

export const logoPreset = {
  ratio: 99 / 320,
};

export const landingPreset = {
  finger: {
    ratio: 61 / 320,
  },
  leftArrow: {
    ratio: 114 / 320,
    offsetY: -20,
  },
  rightArrow: {
    ratio: 114 / 320,
    offsetY: -20,
  },
};

export const firepowerPreset = {
  perspective: 190,
  offsetY: -10,
  ratio: 23 / 320,
  speed: 800,
  reload: 500, // time ms
  damage: {
    level1: 50,
    level2: 100,
  },
  random: {
    enable: true,
    velocity: 200,
  },
};

export const playerPreset = {
  speedByInput: 5,
  ratio: (30 / 320) * 1.2,
  offsetY: -100,
  gap: 30,
  isRadom: false,
  randomGap: 10,
  healthBar: {
    offsetY: 10,
    width: 70,
    height: 25,
  },
};

export const enemyPreset = {
  damage: 100,
  perspective: 5,
  ratios: {
    boss: 300 / 320,
    ghost: 100 / 320,
  },
  randomWidth: 100,
  timeOffset: 570,
  duration: 20000 / 1.3,
  healthBar: {
    boss: {
      offsetY: -18,
      width: 150,
      height: 25,
    },
    ghost: {
      offsetY: -7,
      width: 70,
      height: 25,
    },
  },
};

export const gatePreset = {
  miss: 2, // Ratio to adjust the position of the gate when it is missed
  ratio: 160 / 320,
  duration: 20000 / 1.3,
  maxCount: 5,
  fontStyle: {
    fontSize: "44px",
    color: "#ffffff",
    fontFamily: "monospace",
    align: "center",
    fixedHeight: 44,
  },
};

export const supplementPreset = {
  miss: 1,
  ratio: 120 / 320,
  offsetY: -60,
  gap: 20,
  duration: 20000 / 1.3,
  fontStyle: {
    fontSize: "44px",
    color: "#ffffff",
    fontFamily: "monospace",
    align: "center",
    fixedHeight: 200,
    padding: {
      top: 145,
    },
  },
};

export const endPreset = {
  banner: {
    ratio: 300 / 320,
    offsetY: -50,
  },
  button: {
    ratio: 200 / 320,
    offsetY: 150,
  },
};

export const finishLinePreset = {
  miss: 150,
  ratio: 180 / 320,
  perspective: 0.4,
  duration: 20000 / 1.3,
  timeOffset: 0,
};
