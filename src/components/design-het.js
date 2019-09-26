import p5 from 'p5'
import Sketch from './../sketch.js'
import toBlob from 'canvas-to-blob'
import {getRandom} from './../helpers.js'
import {RED} from './../constants.js'
import style from './../styles/widget.css'

const template = document.createElement('template')
template.id = 'design-het-widget'

template.innerHTML = `
  <style>${style}</style>

  <div class="widget-container">
    <div class="loader"></div>
    <audio id="audio" preload autoplay loop style="display: none"></audio>
  </div>
  <svg id="circle" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"></svg>
`

const inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
const attrs = ['saveas', 'stop', 'fullscreen', 'mute', 'rotatex', 'rotatey']

export default class DesignHet extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.musicPlay = this.musicPlay.bind(this)

    this.sketch = null
    this.svg = null
    this.circles = null
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.color = RED
    this.stroke = '#fff'
  }

  connectedCallback () {
    console.log('Interactive content: brigittaforrai.com')

    toBlob.init()
    this.svg = this.shadowRoot.querySelector('svg#circle')
    this.sketch = new Sketch(this.width, this.height, this.shadowRoot)

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.sketch.windowResized(this.width, this.height)
    })

    const circleAttr = this.getAttribute('circles')
    const num = circleAttr ? parseInt(circleAttr) : 1
    this.circleNum = ((num > 0) && (num <=3)) ? num : 1

    const installation = this.getAttribute('installation')
    if (installation === "true") {
      this.sketch.setInstallation()
      this.color = "#fff"
      this.stroke = "#000"
    }

    this.updateSvg()
    new p5(this.sketch.setupP5)

    this.handleAudio()
  }

  static get observedAttributes() {
    return inputAttrs.concat(attrs)
  }

  handleAudio () {
    this.audio = this.shadowRoot.getElementById('audio')
    const musicUrl = this.getAttribute('music-url')

    if (musicUrl) {
      const source = document.createElement('source')
      source.setAttribute('src', musicUrl)
      source.setAttribute('type', 'audio/mpeg')
      this.audio.appendChild(source)
      document.addEventListener('click', this.musicPlay)
      document.addEventListener('scroll', this.musicPlay)
    }
  }

  // todo
  musicPlay () {
    document.removeEventListener('click', this.musicPlay)
    document.removeEventListener('scroll', this.musicPlay)
    this.audio.play()
  }

  updateSvg() {
    this.svg.innerHTML = ''
    const directions = [-1, 1]
    const index = getRandom(0, 1)
    const direction = directions[index]

    for (let c = 0; c < this.circleNum; c++) {
      const randomR = getRandom(15, 80)
      const randomY = getRandom(randomR * 2, this.height - (4 * randomR))
      const randomX = getRandom(randomR * 2, this.width - (4 * randomR))
      const distance = randomR / 5
      const number = getRandom(3, 16)

      const group = createElement('g', {
        name: 'group',
        index: c
      })

      for (let i = 0; i < number; i++) {
        const y = randomY + ((i * distance / 2) * direction)
        const circle = createElement('circle', {
          cx: randomX + i * distance,
          cy: y,
          r: randomR,
          fill: this.color,
          stroke: this.stroke,
          strokeWidth: 2,
          name: 'circle',
          pos: y,
          index: c
        })
        group.appendChild(circle)
      }
      this.svg.appendChild(group)
    }
    const circles = this.shadowRoot.querySelectorAll([name="circle"])
    const groups = this.shadowRoot.querySelectorAll([name="group"])
    this.sketch.updateSvgNodes(circles, groups)
  }

  attributeChangedCallback (attrName, oldval, newVal) {
    if (attrName === 'saveas' && newVal) {
      this.sketch.save(newVal)
    }

    if (attrName === 'stop' && newVal) {
      this.sketch.stop()
    }

    if (attrName === 'fullscreen') {
      const bool = newVal === 'true'
      this.sketch.setFullscreen(bool)
      this.style.cursor = bool ? 'move' : 'default'
    }

    if (attrName === 'fullscreen') {
      const bool = newVal === 'true'
      this.sketch.setFullscreen(bool)
      this.style.cursor = bool ? 'move' : 'default'
    }

    if ((attrName === 'mute') && this.audio) {
      if (newVal === 'true') {
        this.audio.pause()
      } else if (newVal === 'false') {
        this.audio.play()
      }
    }

    if (attrName === 'rotatex') {
      if (this.sketch) {
        let val = parseFloat(newVal)
        this.sketch.setinstallationRotation({x: val})
      }
    }
    if (attrName === 'rotatey') {
      if (this.sketch) {
        let val = parseFloat(newVal)
        this.sketch.setinstallationRotation({y: val})
      }

    }

    if (inputAttrs.indexOf(attrName) >= 0) {
      console.log(this.sketch, 3);
      this.sketch.update(attrName, newVal)
    }
  }
}

function createElement(name, attributes) {
  const ns = "http://www.w3.org/2000/svg"
  let elem = document.createElementNS(ns, name)
  if (attributes) {
    Object.keys(attributes).forEach((i) => {
      const key = i.split(/(?=[A-Z])/).join('-')
      elem.setAttribute(key.toLowerCase(), attributes[i])
    })
  }
  return elem
}

window.customElements.define('design-het', DesignHet);
