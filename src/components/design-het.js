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
const attrs = ['saveas', 'stop', 'fullscreen', 'mute']

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
  }

  connectedCallback () {
    console.log('Interactive content: brigittaforrai.com')

    toBlob.init()
    this.svg = this.shadowRoot.querySelector('svg#circle')
    this.sketch = new Sketch(this.width, this.height, this.shadowRoot)

    const circleAttr = this.getAttribute('circles')
    const num = circleAttr ? parseInt(circleAttr) : 1
    this.circleNum = ((num > 0) && (num <=3)) ? num : 1

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
    console.log(this, 'this musicplay');
    document.removeEventListener('click', this.musicPlay)
    document.removeEventListener('scroll', this.musicPlay)
    this.audio.play()
  }

  updateSvg() {
    this.svg.innerHTML = ''
    console.log(this.circleNum, 'circles')
    for (let c = 0; c < this.circleNum; c++) {
      const randomR = getRandom(15, 80)
      const randomY = getRandom(randomR, this.height - (2 * randomR))
      const randomX = getRandom(randomR, this.width - (2 * randomR))
      const distance = randomR / 5

      const number = getRandom(3, 16)
      const directions = [-1, 0, 1]
      const index = getRandom(0, 2)
      const direction = directions[index]

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
          fill: RED,
          stroke: 'white',
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
      this.sketch.setFullscreen(newVal)
    }

    if ((attrName === 'mute') && this.audio) {
      if (newVal === 'true') {
        this.audio.pause()
      } else if (newVal === 'false') {
        this.audio.play()
      }
    }

    if (inputAttrs.indexOf(attrName) >= 0) {
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
