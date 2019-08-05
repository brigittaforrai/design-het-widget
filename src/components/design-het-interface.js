import {gridSettings} from './../settings.js'
import {getRandom} from './../helpers.js'
import {settingNames} from './../constants'

const template = document.createElement('template')
template.id = 'design-het-interface'
template.innerHTML = `
  <style>
    .interface-container {
      position: fixed;
      left: 10px;
      top: 10px;
      z-index: 10000;
      padding: 5px;
    }
    .interface-container button {
      height: 40px;
      width: 40px;
      background-color: white;
      border-radius: 20px;
      margin: 5px 0;
      border: 0px solid white;
      outline: none;
      cursor: pointer;
      padding: 8px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: contain;
    }

    .interface-container button.toggle-settings {
      background-image: url('src/assets/icons/slider_e.svg');
    }
    .interface-container button.toggle-settings.opened {
      background-image: url('src/assets/icons/slider.svg');
    }
    .interface-container button.mute {
      background-image: url('src/assets/icons/sound.svg');
    }
    .interface-container button.mute.muted {
      background-image: url('src/assets/icons/mute.svg');
    }
    .interface-container button.save {
      background-image: url('src/assets/icons/download_e.svg');
    }
    .interface-container button.fullscreen {
      background-image: url('src/assets/icons/play.svg');
    }
    .interface-container button.fullscreen.stop {
      background-image: url('src/assets/icons/stop.svg');
    }
    .interface-container button.randomCircle {
      background-image: url('src/assets/icons/random_e.svg');
    }
    .interface-container button.save:active {
      background-image: url('src/assets/icons/download.svg');
    }
    .interface-container button.randomCircle:active {
      background-image: url('src/assets/icons/random.svg');
    }
    .interface-container .interface {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      flex-wrap: wrap;
      border-radius: 5px;
      width: 160px;
      margin-top: 5px;
      background-color: rgba(0, 0, 0, 0.8);
      padding: 10px;
      display: none;
    }
    .interface.opened {
      display: flex;
    }
    .interface > div {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
      justify-content: flex-start;
      width: 100%;
      max-width: 100%;
    }
    .interface > div:first-child {
      margin-top: 0;
    }
    .interface > div:last-child {
      margin-bottom: 0;
    }
    .interface label {
      color: white;
      height: 100%;
      padding: 0px 0 5px 0;
      text-transform: uppercase;
      font-family: helvetica;
      font-size: 12px;
    }
    /* http://danielstern.ca/range.css/#/ */
    input[type=range] {
      -webkit-appearance: none;
      width: 100%;
      margin: 8.55px 0;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 9.9px;
      cursor: pointer;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
      background: #f14341;
      border-radius: 1.3px;
      border: 0px solid rgba(1, 1, 1, 0);
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
      border: 0px solid rgba(0, 0, 0, 0);
      height: 27px;
      width: 10px;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -8.55px;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #f35b59;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 9.9px;
      cursor: pointer;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
      background: #f14341;
      border-radius: 1.3px;
      border: 0px solid rgba(1, 1, 1, 0);
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
      border: 0px solid rgba(0, 0, 0, 0);
      height: 27px;
      width: 10px;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 9.9px;
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #ef2b29;
      border: 0px solid rgba(1, 1, 1, 0);
      border-radius: 2.6px;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    }
    input[type=range]::-ms-fill-upper {
      background: #f14341;
      border: 0px solid rgba(1, 1, 1, 0);
      border-radius: 2.6px;
      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(13, 13, 13, 0);
    }
    input[type=range]::-ms-thumb {
      box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
      border: 0px solid rgba(0, 0, 0, 0);
      height: 27px;
      width: 10px;
      border-radius: 4px;
      background: #ffffff;
      cursor: pointer;
      height: 9.9px;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #f14341;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #f35b59;
    }
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
