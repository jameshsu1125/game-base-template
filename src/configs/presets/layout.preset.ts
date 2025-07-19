export const gamePreset = {
  perspective: 0.1,
  delta: 16, // default delta when game are not lag
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
  perspective: 12,
  offsetY: -10,
  ratio: 23 / 320,
  speed: 800,
  reload: 500, // time ms
  damage: {
    level1: 50,
    level2: 100,
  },
};

export const playerPreset = {
  speedByInput: 5,
  ratio: 30 / 320,
  offsetY: -100,
  gap: 20,
  healthBar: {
    offsetY: 10,
  },
};

export const enemyPreset = {
  damage: 100,
  perspective: 5,
  ratio: 100 / 320,
  randomWidth: 100,
  healthBar: {
    offsetY: -7,
  },
};

export const gatePreset = {
  ratio: 160 / 320,
  duration: 20000,
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

export const supplementPreset = {
  ratio: 120 / 320,
  offsetY: -60,
  gap: 20,
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
