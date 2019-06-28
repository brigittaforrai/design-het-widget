const widgetData = {
  xgap: 50,
  zgap: 50,
  theta: 0.00,
  nodesize: 6,
  spacing: 3,
  tempo: 0.05,
  ampl: 20,
  period: 500
}

const CONSTANTS = {
  xgap: 'x-gap',
  zgap: 'z-gap',
  theta: 'theta',
  nodesize: 'node size',
  spacing: 'spacing',
  tempo: 'tempo',
  ampl: 'amplitudo',
  period: 'period'
}

function interface() {

  const widget = document.querySelector('design-het')
  const triggerBtn = document.querySelector('button.toggle-settings')
  const muteBtn = document.querySelector('button.mute')
  const settings = document.querySelector('.interface')

  const inputs = ['xgap', 'zgap', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
  inputs.forEach((name) => {
    events(name)
    updateLabel(name, widgetData[name])
  })

  function updateLabel (name, value) {
    document.querySelector(`label[for="${name}"]`).innerHTML = `${CONSTANTS[name]}: ${value}`
  }

  function events (name) {
    const selector = `input[name=${name}]`
    document.querySelector(selector).addEventListener('change', (e) => {
      const value = e.target.value
      widgetData[name] = value
      widget.setAttribute(name, value)
      updateLabel(name, value)
    })
  }

  triggerBtn.addEventListener('click', function () {
    if (settings.classList.contains('open')) {
      settings.classList.remove('open')
      settings.classList.add('closed')
    } else {
      settings.classList.remove('closed')
      settings.classList.add('open')
    }
  })
}

interface()
