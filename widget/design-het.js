(function () {

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

  class DesignHet extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({mode: 'open'})
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.sketch = null
      this.width = window.innerWidth
      this.height = window.innerHeight
    }

    connectedCallback () {
      this.sketch = new Sketch(this.width, this.height, this.shadowRoot)
      new p5(this.sketch.setupP5);

      // todo use p5 ?
      const musicPlay = () => {
        this.audio = this.shadowRoot.getElementById('audio')
        console.log(this.audio, 'a');
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
  window.customElements.define('design-het', DesignHet);
})()


class Sketch {
  constructor (width, height, shadowRoot, toSave) {
    this.width = width
    this.height = height
    this.shadowRoot = shadowRoot
    this.selectedPosition = null
    this.fullscreen = false
    this.background ='rgba(0, 0, 0, 1)'

    this.dx = null
    this.xNodes = null
    this.yNodes = null

    this.xgap = 50
    this.zgap = 50
    this.theta = 0.00
    this.nodesize = 6
    this.spacing = 3
    this.tempo = 0.05
    this.ampl = 20
    this.period = 500
    this.setupP5 = this.setupP5.bind(this)

    this.loader = this.shadowRoot.querySelector('.loader')
  }

  stop() {
    this.p.noLoop()
    this.save()
  }

  play() {
    this.p.loop()
  }

  setupP5 (p) {
    this.p = p
    p.setup = () => { this.setup() }
    p.draw = () => { this.draw() }
    p.windowResized = () => { this.windowResized() }
    p.doubleClicked = () => {this.doubleClicked()}
  }

  doubleClicked () {
    const x = this.p.mouseX
    const y = this.p.mouseY
    this.circle = new Circle(this.width, this.height, x, y)
  }

  setFullscreen (val) {
    this.fullscreen = val === 'true'
  }

  save() {
    this.canvas.style.display = 'none'
    this.loader.style.display = 'block'
    const aspect = this.width / this.height
    const width = 4000
    const height = Math.round(width / aspect)
    this.background = 'rgba(0, 0, 0, 0)'
    this.p.resizeCanvas(width, height, true)
    this.setOrtho()
    this.p.redraw()

    this.canvas.toBlob((blob) => {
      saveAs(blob, 'design-het.png');
      this.p.resizeCanvas(this.width, this.height, true)
      this.setOrtho()
      this.play()
      this.canvas.style.display = 'block'
      this.loader.style.display = 'none'
    })
  }

  setOrtho () {
    this.p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2, 0, this.width * 3);
  }

  setup () {
    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.p.noCanvas()
    this.p.createCanvas(this.width, this.height, this.p.WEBGL)
    this.p.pixelDensity(4); // todo
    this.setOrtho()
    this.p.frameRate(30)

    // move p5 default canvas inside widget
    this.canvas = document.querySelector('canvas')
    this.canvas.parentNode.removeChild(this.canvas)
    const widget = this.shadowRoot.querySelector('.widget-container')
    widget.appendChild(this.canvas)
  }

  draw () {
    this.p.clear()
    this.p.background(this.background)

    if (this.fullscreen) {
      this.p.orbitControl()
    }

    this.dx = (this.p.TWO_PI / this.period) * this.spacing
    this.theta += this.tempo

    this.drawGrid()

    // todo more circles
    if (this.circle) {
      this.circle.create(this.p, this.selectedPosition)
    }
  }

  update (name, val) {
    if (this[name] !== val) {
      this[name] = parseFloat(val)
    }
  }

  windowResized() {
    this.width = this.p.windowWidth
    this.height = this.p.windowHeight
    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.p.resizeCanvas(this.width, this.height)
    this.setOrtho()
  }

  drawGrid () {
    this.p.noStroke()
    this.p.fill(241, 67, 65)

    this.p.translate(-this.width/2, this.height/2, 0)
    let objpos = 0
    let a = this.theta

    for(let x = 0; x<= this.xNodes; x++) {
      let yp = this.p.sin(a) * this.ampl
      for(let z = 0; z<= this.yNodes; z++) {
        this.p.push()
        this.p.rotateX(this.p.HALF_PI)
        let xp = (x * this.xgap)
        let zp = (z * this.zgap)

        this.p.translate(xp, yp, zp)
        this.p.sphere(this.nodesize, 36, 24)
        this.p.pop()

        // todo - ez itt nem jo
        if(xp === 250 && zp === 250) {
          this.selectedPosition = yp
        }
        a += this.dx
      }
    }
  }
}

class Circle {
  constructor (width, height, x, y) {
    this.position = null
    this.width = width
    this.height = height
    this.x = x
    this.y = y
  }

  create (p, position) {
    this.position = position

    p.rotateX(p.PI/2)
    p.fill(241, 67, 65)
    p.stroke(255)
    p.strokeWeight(1)

    for (let o = 0; o < 5; o++) {
      p.push()
      p.translate(this.x + (o * 30), this.position, this.height - this.y)
      p.cylinder(30, 10)
      p.pop()
    }
  }
}
