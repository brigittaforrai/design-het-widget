const gridSettings = {
  // [min, max, step]
  xgap: [40, 200, 1],
  zgap: [40, 200, 1],
  nodesize: [5, 50, 1],
  spacing: [1, 100, 0.1],
  tempo: [0.02, 0.3, 0.001],
  ampl: [50, 200, 1],
  period: [1, 1000, 1]
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
