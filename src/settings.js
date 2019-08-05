const gridSettings = {
  // [min, max, step, randomMin, randomMax] // refact this
  xgap: [20, 500, 1, 40, 200],
  zgap: [20, 500, 1, 40, 200],
  nodesize: [2, 100, 1, 5, 50],
  spacing: [0, 100, 0.1, 1, 100],
  tempo: [0, 1, 0.001, 0.02, 0.3],
  ampl: [0, 200, 1, 50, 200],
  period: [1, 5000, 1, 1, 1000]
}

const defaultSettings = {
  xgap: 50,
  zgap: 50,
  theta: 0.00,
  nodesize: 6,
  spacing: 3,
  tempo: 0.05,
  ampl: 20,
  period: 500
}

export {
  gridSettings,
  defaultSettings
}
