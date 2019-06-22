let widgetData = {
  xgap: 50,
  zgap: 50,
  theta: 0.00,
  nodeSize: 6,
  spacing: 3,
  tempo: 0.05,
  ampl: 20,
  period: 500
}

function interface() {

  const widget = document.querySelector('design-het')

  const inputs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
  inputs.forEach((name) => {
    events(name)
  })

  function events (name) {
    const selector = `input[name=${name}]`
    document.querySelector(selector).addEventListener('change', (e) => {
      widgetData[name] = e.target.value
      widget.setAttribute(name, e.target.value)
    })
  }
}

interface()
