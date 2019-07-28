(function () {

  const template = document.createElement('template')
  template.id = 'design-het-widget'
  template.innerHTML = `
    <style>
    .widget-container {
      width: 100%;
      height: 100%;
      }
      canvas {
      visibility: visible !important;
      z-index: -1000;
      }
      audio {
        display: none;
      }
    </style>
    <div class="widget-container">
      <audio id="audio" controls autoplay loop>
        <source src="widget/music.mp3" type="audio/mpeg">
        <p>Your browser doesn't support HTML5 audio. Here is
      </audio>
    </div>
  `

  const inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period']
  const attrs = ['save', 'fullscreen', 'mute']

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
      if (attrName === 'save' && newVal) {
        this.sketch.saveCanvas()
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
  constructor (width, height, shadowRoot) {
    this.width = width
    this.height = height
    this.shadowRoot = shadowRoot
    this.selectedPosition = null
    this.fullscreen = false

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
  }

  setupP5 (p) {
    this.p = p
    p.setup = () => { this.setup() }
    p.draw = () => { this.draw() }
    p.windowResized = () => { this.windowResized() }
  }

  setFullscreen (val) {
    const enabled = val === 'true'
    this.p.fullscreen(enabled);
    this.fullscreen = enabled
  }

  saveCanvas() {
    this.p.saveCanvas('designhet.png')
  }

  setOrtho () {
    this.p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2, 0, this.width * 3);
  }

  setup () {
    this.p.noCanvas()
    this.p.createCanvas(this.width, this.height, this.p.WEBGL)
    // this.p.pixelDensity(30); // todo
    this.setOrtho()

    // move p5 default canvas inside widget
    const canvas = document.querySelector('canvas')
    canvas.parentNode.removeChild(canvas)
    const widget = this.shadowRoot.querySelector('.widget-container')
    widget.appendChild(canvas)

    // this.circle = new Circle(this.ampl, this.width, this.height)
  }

  draw () {
    this.p.background(0)

    if (this.fullscreen) {
      this.p.orbitControl()
    }

    this.p.normalMaterial()
    this.p.rotateX(0.2);
    this.p.rotateY(-0.2);

    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.dx = (this.p.TWO_PI / this.period) * this.spacing
    this.theta += this.tempo

    this.drawGrid()
    // todo temp hide
    // this.circle.create(this, this.camera, this.selectedPosition)
  }

  update (name, val) {
    if (this[name] !== val) {
      this[name] = parseFloat(val)
    }
  }

  windowResized() {
    this.width = this.p.windowWidth
    this.height = this.p.windowHeight
    this.p.resizeCanvas(this.width, this.height)
    this.setOrtho()
  }

  drawGrid () { // TODO
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
        this.p.sphere(this.nodesize)
        this.p.pop()
        if(xp === 250 && zp === 250) {
          this.selectedPosition = yp
        }
        a += this.dx
      }
    }
  }
}

class Circle {
  constructor (ampl, width, height) {
    this.position = null
    this.width = width
    this.height = height
    this.ampl = ampl
  }

  create (p, cam, position) {
    this.position = position
    let dRadius = 0

    let camTheta
    let camPhi

    // todo kor rotation nem jo
    // if (cam.deltaPhi && cam.deltaTheta) {
    //   let dTheta = cam.deltaTheta
    //   let dPhi = cam.deltaPhi
    //   var diffX = cam.cam.eyeX - cam.cam.centerX;
    //   var diffY = cam.cam.eyeY - cam.cam.centerY;
    //   var diffZ = cam.cam.eyeZ - cam.cam.centerZ;
    //
    //   // get spherical coorinates for current camera position about origin
    //   var camRadius = Math.sqrt(diffX * diffX + diffY * diffY + diffZ * diffZ);
    //   // from https://github.com/mrdoob/three.js/blob/dev/src/math/Spherical.js#L72-L73
    //   camTheta = Math.atan2(diffX, diffZ); // equatorial angle
    //   camPhi = Math.acos(Math.max(-1, Math.min(1, diffY / camRadius))); // polar angle
    //
    //   // add change
    //   camTheta += dTheta;
    //   camPhi += dPhi;
    //   camRadius += dRadius;
    // }

    p.rotateX(p.PI/2)
    p.fill(241, 67, 65)
    p.stroke(255)
    p.strokeWeight(2)


    let x = this.width / 2
    let y = this.height / 3

    for (let o = 0; o < 15; o++) {
      p.push()

      p.translate(0, this.ampl + 10 + o, this.position)
      if (camPhi) p.rotateX(-camPhi)
      p.rotateX(p.PI/2)
      if (camTheta) p.rotateZ(-camTheta )
      p.ellipse(x + o*15, y, 120, 120);
      p.pop()
    }
  }
}

let deltaPhi = 0
let deltaTheta = 0

function myOrbit () {
  const sensitivityX = 1
  const sensitivityY = 1
  const cam = this._renderer._curCamera;
  this.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2);

  const mouseInCanvas =
    this.mouseX < this.width &&
    this.mouseX > 0 &&
    this.mouseY < this.height &&
    this.mouseY > 0;
  if (!mouseInCanvas) {
    return cam
  };

  const scaleFactor = this.height < this.width ? this.height : this.width;

  if (this.mouseIsPressed) {
    if (this.mouseButton === this.LEFT) {
      deltaTheta =
        -sensitivityX * (this.mouseX - thismouseX) / scaleFactor;
      deltaPhi = sensitivityY * (this.mouseY - thismouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    }
  }
  return {
    cam: cam,
    deltaTheta: deltaTheta,
    deltaPhi: deltaPhi
  }
}
