import { LitElement, html } from 'lit-element';
import p5 from 'p5'
import Sketch from './../sketch.js'
import toBlob from 'canvas-to-blob'
import {getRandom} from './../helpers.js'
import {RED} from './../constants.js'


const inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
const attrs = ['saveas', 'stop', 'fullscreen', 'mute']

export default class DesignHet extends LitElement {

  static get properties() {
    return {
      xgap: { type: Number },
      zgap: { type: Number },
      theta: { type: Number },
      nodesize: { type: Number },
      spacing: { type: Number },
      tempo: { type: Number },
      ampl: { type: Number },
      period: { type: Number },
      saveas: { type: Boolean },
      stop: { type: Boolean },
      fullscreen: { type: Boolean },
      mute: { type: Boolean },
    }
  }

  constructor() {
    super()
    this.sketch = null
    this.svg = null
    this.circles = null
    this.width = window.innerWidth
    this.height = window.innerHeight
  }

  render () {
    return html`
      <link rel="stylesheet" href="./../styles/widget.css">
      <template id="design-het-widget">
        <div class="widget-container">
          <div class="loader"></div>
          <audio id="audio" controls autoplay loop style="display: none">
            <source src="src/assets/music.mp3" type="audio/mpeg">
            <p>Your browser doesn't support HTML5 audio. Here is
          </audio>
        </div>
        <svg id="circle" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"></svg>
      </template>
    `
  }

  connectedCallback () {
    super.connectedCallback()
    console.log('Interactive content: brigittaforrai.com')

    toBlob.init()
    const canLoop = (this.getAttribute('animation') === 'true')
    this.svg = this.shadowRoot.querySelector('svg#circle')
    this.sketch = new Sketch(this.width, this.height, this.shadowRoot, canLoop)
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
  }

  // static get observedAttributes() {
  //   return inputAttrs.concat(attrs)
  // }

  updateSvg() {
    const randomR = getRandom(20, 100)
    const randomY = getRandom(2 * randomR, this.height - 4 * randomR) // todo
    const randomX = getRandom(2 * randomR, this.width - 4 * randomR)
    const distance = randomR / 5

    const number = getRandom(3, 23)
    const directions = [-1, 0, 1]
    const index = getRandom(0, 2)
    const direction = directions[index]

    this.svg.innerHTML = ''

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
        pos: y
      })
      this.svg.appendChild(circle)
    }
    const circles = this.shadowRoot.querySelectorAll([name="circle"])
    this.sketch.updateSvgNodes(circles)
  }

  attributeChangedCallback (attrName, oldval, newVal) {
    super.attributeChangedCallback()
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
