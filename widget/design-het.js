import p5 from 'p5'
import Sketch from './sketch.js'
import toBlob from 'canvas-to-blob'

const template = document.createElement('template')
template.id = 'design-het-widget'

template.innerHTML = `
  <style>
  .widget-container {
    width: 100%;
    height: 100%;
    background-color: black;
    }
    canvas {
    visibility: visible !important;
    z-index: -1000;
    background-color: rgba(0,0,0,0);
    }
    audio {
      display: none;
    }
    svg {
      width: 100vw;
      height: 100vh;
      display: inline-block;
      position: absolute;
      left: 0;
      top: 0;
      /* todo */
      /* z-index: 1000; */
    }
    .loader, .loader:before, .loader:after {
      border-radius: 50%;
      width: 2.5em;
      height: 2.5em;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
      -webkit-animation: load7 1.8s infinite ease-in-out;
      animation: load7 1.8s infinite ease-in-out;
    }
    .loader {
      color: #ff2836;
      font-size: 10px;
      margin: 80px auto;
      position: absolute;
      text-indent: -9999em;
      -webkit-transform: translateZ(0);
      -ms-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-animation-delay: -0.16s;
      animation-delay: -0.16s;
      top: calc(50% - 40px);
      left: calc(50% - 40px);
      display: none;
    }
    .loader:before, .loader:after {
      content: '';
      position: absolute;
      top: 0;
    }
    .loader:before {
      left: -3.5em;
      -webkit-animation-delay: -0.32s;
      animation-delay: -0.32s;
    }
    .loader:after {
      left: 3.5em;
    }
    @-webkit-keyframes load7 {
      0%, 80%, 100% {
        box-shadow: 0 2.5em 0 -1.3em;
      }
      40% {
        box-shadow: 0 2.5em 0 0;
      }
    }
    @keyframes load7 {
      0%, 80%, 100% {
        box-shadow: 0 2.5em 0 -1.3em;
      }
      40% {
        box-shadow: 0 2.5em 0 0;
      }
    }
  </style>

  <div class="widget-container">
    <div class="loader">Downloading image ...</div>
    <audio id="audio" controls autoplay loop>
      <source src="widget/music.mp3" type="audio/mpeg">
      <p>Your browser doesn't support HTML5 audio. Here is
    </audio>
  </div>
`

const inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
const attrs = ['saveas', 'stop', 'fullscreen', 'mute']

export default class DesignHet extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.sketch = null
    this.width = window.innerWidth
    this.height = window.innerHeight
  }

  connectedCallback () {
    console.log('Interactive content: brigittaforrai.com')

    toBlob.init()
    const randomR = Math.random() * 100 + 20
    const randomY = Math.random() * (this.height - 4 * randomR) + 2 * randomR
    // this.svg = this.createSvg(randomY, randomR) // todo
    this.sketch = new Sketch(this.width, this.height, this.shadowRoot, this.svg, randomY)
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

  static get observedAttributes() {
    return inputAttrs.concat(attrs)
  }

  createSvg (randomY, randomR) {
    const svg = createElement('svg', {
      id: 'circle',
      xmlns: 'http://www.w3.org/2000/svg',
      width: 1000, // todo
      height: 1000
    })
    const randomX = Math.random() * (this.width - 4 * randomR) + 2 * randomR
    const distance = 15

    for (let i = 0; i < 8; i++) {
      const circle = createElement('circle', {
        cx: randomX + i * distance,
        cy: randomY,
        r: randomR,
        fill: '#ff2836',
        stroke: 'white',
        strokeWidth: 2,
        name: 'circle'
      })
      svg.appendChild(circle)
    }

    this.shadowRoot.appendChild(svg)
    return svg
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
