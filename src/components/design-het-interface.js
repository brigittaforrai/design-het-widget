import {gridSettings} from './../settings.js'
import {getRandom} from './../helpers.js'
import {settingNames} from './../constants'

const template = document.createElement('template')
template.id = 'design-het-interface'
template.innerHTML = `
  <style>
    @import "src/styles/interface.css"
  </style>

  <div class="interface-container">
    <button class="toggle-settings"></button>
    <button class="mute"></button>
    <button class="save"></button>
    <button class="fullscreen"></button>
    <button class="randomCircle"></button>
    <div class="interface closed"></div>
  </div>
`

export default class DesignHetInterface extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.muted = false
    this.fullscreen = false
  }

  addSettings () {
    const interf = this.shadowRoot.querySelector('.interface')
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
    this.widget = document.querySelector('design-het')
    this.triggerBtn = this.shadowRoot.querySelector('button.toggle-settings')
    this.muteBtn = this.shadowRoot.querySelector('button.mute')
    this.settings = this.shadowRoot.querySelector('.interface')
    this.saveBtn = this.shadowRoot.querySelector('.save')
    this.fullscreenBtn = this.shadowRoot.querySelector('.fullscreen')
    this.randomBtn = this.shadowRoot.querySelector('.randomCircle')

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

  inputEvents (name) {
    const selector = `input[name=${name}]`
    this.shadowRoot.querySelector(selector).addEventListener('input', (e) => {
      const value = e.target.value
      this.widget.setAttribute(name, value)
      this.updateLabel(name, value)
    })
  }

  addEventListeners () {
    // todo
    const inputs = ['xgap', 'zgap', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
    inputs.forEach((name) => {
      this.inputEvents(name)
    })

    this.randomBtn.addEventListener('click', () => {
      this.widget.updateSvg()
    })

    // open settings
    this.triggerBtn.addEventListener('click', () => {
      if (this.settings.classList.contains('opened')) {
        this.settings.classList.remove('opened')
        this.triggerBtn.classList.remove('opened')
      } else {
        this.settings.classList.add('opened')
        this.triggerBtn.classList.add('opened')
      }
    })

    // toggle fullscreen
    this.fullscreenBtn.addEventListener('click', () => {
      console.log('click', this.fullscreen);
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
    })

    this.muteBtn.addEventListener('click', () => {
      this.muted = !this.muted
      this.widget.setAttribute('mute', this.muted)
      if (this.muted) {
        this.muteBtn.classList.add('muted')
      } else {
        this.muteBtn.classList.remove('muted')
      }
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
