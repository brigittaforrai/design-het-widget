import { LitElement, html } from 'lit-element';
import {gridSettings} from './../settings.js'
import {getRandom} from './../helpers.js'
import {settingNames} from './../constants'

export default class DesignHetInterface extends LitElement {

  static get properties() {
    return {
      muted: { type: Boolean },
      fullscreen: { type: Boolean },
    }
  }

  constructor() {
    super()
    this.muted = false
    this.fullscreen = false
  }

  render () {
    return html`
      <link rel="stylesheet" href="./../styles/interface.css">
      <template id="design-het-interface">
        <div class="interface-container">
          <button @click="${this.trigger}" class="toggle-settings"></button>
          <button @click="${this.muteSound}" class="mute"></button>
          <button @click="${this.startSave}" class="save"></button>
          <button @click="${this.expand}" class="fullscreen"></button>
          <button @click="${this.widget.updateSvg}" class="randomCircle"></button>
          <div class="interface closed"></div>
        </div>
      </temmplate>
    `
  }

  addSettings () {
    const interf = this.shadowRoot.querySelector('.interface')
    console.log(interf, 'interf');
    Object.keys(gridSettings).forEach((i) => {
      const item = gridSettings[i]
      const div = document.createElement('div')
      const random = getRandom(item[3], item[4] / 3, item[2])
      const setting = `
        <label for="${i}">${settingNames[i]}: ${random}</label>
        <input step="${item[2]}" min="${item[0]}" max="${item[1]}" type="range" name="${i}" value="${random}"></input>
      `
      div.innerHTML = setting
      interf.appendChild(div)
      this.widget.setAttribute(i, random)
    })
  }

  connectedCallback () {
    super.connectedCallback()
    this.widget = document.querySelector('design-het')
    this.triggerBtn = this.shadowRoot.querySelector('button.toggle-settings')
    this.muteBtn = this.shadowRoot.querySelector('button.mute')
    this.settings = this.shadowRoot.querySelector('.interface')
    this.saveBtn = this.shadowRoot.querySelector('.save')
    this.fullscreenBtn = this.shadowRoot.querySelector('.fullscreen')

    this.addSettings()
    this.addEventListeners()

    const download = this.getAttribute('download')
    if (download === 'true') {
      this.saveBtn.style.display = 'inline-block'
    } else {
      this.saveBtn.style.display = 'none'
    }
  }

  updateLabel (name, value) {
    this.shadowRoot.querySelector(`label[for="${name}"]`).innerHTML = `${settingNames[name]}: ${value}`
  }

  // bind to dom
  inputEvents (name) {
    const selector = `input[name=${name}]`
    this.shadowRoot.querySelector(selector).addEventListener('input', (e) => {
      const value = e.target.value
      this.widget.setAttribute(name, value)
      this.updateLabel(name, value)
    })
  }

  trigger () {
    if (this.settings.classList.contains('opened')) {
      this.settings.classList.remove('opened')
      this.triggerBtn.classList.remove('opened')
    } else {
      this.settings.classList.add('opened')
      this.triggerBtn.classList.add('opened')
    }
  }

  expand () {
    if (this.fullscreen) {
      this.fullscreen = false
      this.widget.style.zIndex = -100
      this.fullscreenBtn.classList.remove('stop')
    } else {
      this.fullscreen = true
      this.widget.style.zIndex = 9999
      this.fullscreenBtn.classList.add('stop')
    }
    this.widget.setAttribute('fullscreen', this.fullscreen)
  }

  muteSound () {
    this.muted = !this.muted
    this.widget.setAttribute('mute', this.muted)
    if (this.muted) {
      this.muteBtn.classList.add('muted')
    } else {
      this.muteBtn.classList.remove('muted')
    }
  }

  startSave () {
    this.widget.setAttribute('stop', true)
  }

  addEventListeners () {
    // todo
    const inputs = ['xgap', 'zgap', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
    inputs.forEach((name) => {
      this.inputEvents(name)
    })
  }
}
window.customElements.define('design-het-interface', DesignHetInterface);
