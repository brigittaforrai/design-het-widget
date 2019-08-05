const gridSettings = {
  // [min, max, step]
  xgap: [20, 500, 1],
  zgap: [20, 500, 1],
  nodesize: [5, 100, 1],
  spacing: [0, 100, 0.1],
  tempo: [0, 1, 0.001],
  ampl: [0, 200, 1],
  period: [1, 5000, 1]
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
