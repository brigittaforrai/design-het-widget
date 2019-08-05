import p5 from 'p5'
import Sketch from './../sketch.js'
import toBlob from 'canvas-to-blob'
import {getRandom} from './../helpers.js'

const template = document.createElement('template')
template.id = 'design-het-widget'

template.innerHTML = `
  <style>
    @import "src/styles/widget.css"
  </style>

  <div class="widget-container">
    <div class="loader"></div>
    <audio id="audio" controls autoplay loop>
      <source src="src/assets/music.mp3" type="audio/mpeg">
      <p>Your browser doesn't support HTML5 audio. Here is
    </audio>
  </div>
  <svg id="circle" xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"></svg>
`

const inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
const attrs = ['saveas', 'stop', 'fullscreen', 'mute']

export default class DesignHet extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

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
    this.updateSvg()
    new p5(this.sketch.setupP5);

    // todo preload ?
    const musicPlay = () => {
      this.audio = this.shadowRoot.getElementById('audio')
      this.audio.play()
      document.removeEventListener('click', musicPlay)
      document.removeEventListener('scroll', musicPlay)
    }
    document.addEventListener('click', musicPlay)
    document.addEventListener('scroll', musicPlay)

    this.sketch.setAnimation(this.getAttribute('animation'))
  }

  static get observedAttributes() {
    return inputAttrs.concat(attrs)
  }

  updateSvg() {
    const randomR = getRandom(20, 80)
    const randomY = getRandom(2 * randomR, this.height - 4 * randomR) // todo
    const randomX = getRandom(2 * randomR, this.width - 4 * randomR)
    const distance = randomR / 5

    const number = getRandom(3, 20)

    this.svg.innerHTML = ''

    for (let i = 0; i < number; i++) {
      const circle = createElement('circle', {
        cx: randomX + i * distance,
        cy: randomY,
        r: randomR,
        fill: '#ff2836',
        stroke: 'white',
        strokeWidth: 2,
        name: 'circle',
        pos: randomY
      })
      this.svg.appendChild(circle)
    }
    const circles = this.shadowRoot.querySelectorAll([name="circle"])
    this.sketch.updateSvgNodes(circles)
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
