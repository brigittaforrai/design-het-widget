const template = document.createElement('template')
template.id = 'design-het-interface'
template.innerHTML = `
  <style>
    @import "widget/interface.css"
  </style>

  <div class="interface-container">
    <button class="toggle-settings">
      <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      	 viewBox="0 0 56 56" style="enable-background:new 0 0 56 56;" xml:space="preserve">
      <g>
      	<path d="M8,14c3.519,0,6.432-2.614,6.92-6H54c0.553,0,1-0.447,1-1s-0.447-1-1-1H14.92C14.432,2.614,11.519,0,8,0
      		C4.14,0,1,3.141,1,7S4.14,14,8,14z M8,2c2.757,0,5,2.243,5,5s-2.243,5-5,5S3,9.757,3,7S5.243,2,8,2z"/>
      	<path d="M48,42c-3.519,0-6.432,2.614-6.92,6H2c-0.552,0-1,0.447-1,1s0.448,1,1,1h39.08c0.488,3.386,3.401,6,6.92,6
      		c3.859,0,7-3.141,7-7S51.859,42,48,42z M48,54c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S50.757,54,48,54z"/>
      	<path d="M54,27H35.368c-0.396-3.602-3.455-6.414-7.161-6.414c-3.706,0-6.765,2.813-7.161,6.414H2c-0.552,0-1,0.447-1,1s0.448,1,1,1
      		h19.109c0.577,3.4,3.536,6,7.098,6c3.562,0,6.52-2.6,7.097-6H54c0.553,0,1-0.447,1-1S54.553,27,54,27z M28.207,33
      		C25.336,33,23,30.664,23,27.793s2.336-5.207,5.207-5.207s5.207,2.336,5.207,5.207S31.078,33,28.207,33z"/>
      </g>
      </svg>
    </button>
    <button class="mute off">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
      <g id="sound">
      	<path class="st0" d="M332.3,464V48L130.6,181H0v150.1h130.6L332.3,464z M302.2,408.3L150.1,308V204.1l152.1-100.3V408.3z M30,211
      		h90.1v90.1H30V211z"/>
      </g>
      <g id="mute">
      	<path class="st0" d="M391.9,326.7l49.4-49.4l49.4,49.4l21.2-21.2L462.6,256l49.4-49.4l-21.2-21.2l-49.4,49.4l-49.4-49.4l-21.2,21.2
      		l49.4,49.4l-49.4,49.4L391.9,326.7z"/>
      </g>
      </svg>
    </button>
    <button class="save">
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 49 49" style="enable-background:new 0 0 49 49;" xml:space="preserve">
      	<g>
      		<path d="M39.914,0H37.5h-28h-9v49h7h33h8V8.586L39.914,0z M35.5,2v14h-24V2H35.5z M9.5,47V28h29v19H9.5z M46.5,47h-6V26h-33v21h-5
      		V2h7v16h28V2h1.586L46.5,9.414V47z"/>
      		<path d="M13.5,33h7c0.553,0,1-0.447,1-1s-0.447-1-1-1h-7c-0.553,0-1,0.447-1,1S12.947,33,13.5,33z"/>
      		<path d="M23.5,35h-10c-0.553,0-1,0.447-1,1s0.447,1,1,1h10c0.553,0,1-0.447,1-1S24.053,35,23.5,35z"/>
      		<path d="M25.79,35.29c-0.181,0.189-0.29,0.45-0.29,0.71s0.109,0.52,0.29,0.71C25.979,36.89,26.229,37,26.5,37
      		c0.26,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71s-0.11-0.521-0.29-0.71C26.84,34.92,26.16,34.92,25.79,35.29z"/>
      		<path d="M33.5,4h-6v10h6V4z M31.5,12h-2V6h2V12z"/>
      	</g>
      </svg>
    </button>
    <button class="fullscreen">
    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488.4 488.4" style="enable-background:new 0 0 488.4 488.4;" xml:space="preserve">
      <g>
        <polygon points="441.1,407.8 338.8,305.5 305.5,338.8 407.8,441.1 328.3,441.1 328.3,488.4 488.4,488.4 488.4,328.3 441.1,328.3"/>
        <polygon points="338.8,183 441.1,80.6 441.1,160.1 488.4,160.1 488.4,0 328.3,0 328.3,47.3 407.8,47.3 305.5,149.6"/>
        <polygon points="149.6,305.5 47.3,407.8 47.3,328.3 0,328.3 0,488.4 160.1,488.4 160.1,441.1 80.6,441.1 183,338.8"/>
        <polygon points="160.1,47.3 160.1,0 0,0 0,160.1 47.3,160.1 47.3,80.6 149.6,183 183,149.6 80.6,47.3"/>
      </g>
    </svg>
    </button>
    <div class="interface closed">
        <div>
          <label for="xgap">x gap</label>
          <input min="20" max="500" step="1" type="range" name="xgap" value="50"></input>
        </div>

        <div>
          <label for="zgap">z gap</label>
          <input min="20" max="500" step="1" type="range" name="zgap" value="50"></input>
        </div>

        <div>
          <label for="nodesize">node size</label>
          <input min="5" max="100" step="1" type="range" name="nodesize" value="6"></input>
        </div>

        <div>
          <label for="spacing">spacing</label>
          <input min="0" max="100" step="0.1" type="range" name="spacing" value="3"></input>
        </div>

        <div>
          <label for="tempo">tempo</label>
          <input min="0" max="1" step="0.001" type="range" name="tempo" value="0.05"></input>
        </div>

        <div>
          <label for="ampl">amplitude</label>
          <input min="0" max="200" step="1" type="range" name="ampl" value="20"></input>
        </div>

        <div>
          <label for="period">period</label>
          <input min="1" max="5000" step="1" type="range" name="period" value="500"></input>
        </div>
    </div>
  </div>
`

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

export default class DesignHetInterface extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.muted = false
  }

  connectedCallback () {
    this.widget = document.querySelector('design-het')
    this.triggerBtn = this.shadowRoot.querySelector('button.toggle-settings')
    this.muteBtn = this.shadowRoot.querySelector('button.mute')
    this.settings = this.shadowRoot.querySelector('.interface')
    this.saveBtn = this.shadowRoot.querySelector('.save')
    this.fullscreenBtn = this.shadowRoot.querySelector('.fullscreen')

    this.addEventListeners()

    const save = this.getAttribute('save')
    if (save === 'true') {
      this.saveBtn.style.display = 'inline-block'
    } else {
      this.saveBtn.style.display = 'none'
    }
  }

  updateLabel (name, value) {
    this.shadowRoot.querySelector(`label[for="${name}"]`).innerHTML = `${CONSTANTS[name]}: ${value}`
  }

  inputEvents (name) {
    const selector = `input[name=${name}]`
    this.shadowRoot.querySelector(selector).addEventListener('input', (e) => {
      const value = e.target.value
      widgetData[name] = value
      this.widget.setAttribute(name, value)
      this.updateLabel(name, value)
    })
  }

  addEventListeners () {
    const inputs = ['xgap', 'zgap', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
    inputs.forEach((name) => {
      this.inputEvents(name)
      this.updateLabel(name, widgetData[name])
    })

    // open settings
    this.triggerBtn.addEventListener('click', () => {
      if (this.settings.classList.contains('open')) {
        this.settings.classList.remove('open')
        this.settings.classList.add('closed')
      } else {
        this.settings.classList.remove('closed')
        this.settings.classList.add('open')
      }
    })

    // toggle fullscreen
    this.fullscreenBtn.addEventListener('click', () => {
      if (this.fullscreen) {
        this.fullscreen = false
        this.widget.setAttribute('fullscreen', this.fullscreen)
        this.widget.style.zIndex = -100
      } else {
        this.fullscreen = true
        this.widget.setAttribute('fullscreen', this.fullscreen)
        this.widget.style.zIndex = 9999
      }
    })

    this.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.widget.setAttribute('mute', this.muted)
    })

    // trigger save image
    this.saveBtn.addEventListener('click', () => {
      this.widget.setAttribute('stop', true)
      // const imageName = prompt("save image as", "design het");
      //
      // if (imageName != null) {
      //   this.widget.setAttribute('saveas', imageName)
      // }
    })
  }
}
window.customElements.define('design-het-interface', DesignHetInterface);
