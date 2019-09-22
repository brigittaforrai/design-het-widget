const gridSettings = {
  // [min, max, step, randomMin, randomMax] // refact this
  tempo: [0, 1, 0.001, 0.02, 0.3],
  xgap: [20, 500, 1, 40, 200],
  zgap: [20, 500, 1, 40, 200],
  nodesize: [2, 100, 1, 5, 50],
  spacing: [0, 100, 0.1, 1, 100],
  ampl: [0, 200, 1, 50, 200],
  period: [1, 5000, 1, 1, 1000]
}

const defaultSettings = {
  xgap: 100,
  zgap: 100,
  // theta: 0.00,
  // nodesize: 6,
  // spacing: 3,
  tempo: 0
  // ampl: 20,
  // period: 500
}

export {
  gridSettings,
  defaultSettings
}
