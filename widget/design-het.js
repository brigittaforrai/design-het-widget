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

  class DesignHet extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.sketch = null

      this.width = window.innerWidth
      this.height = window.innerHeight
    }

    connectedCallback () {
      this.createSketch()
      console.log('connected');

      const musicPlay = () => {
        console.log('play music');
        this.shadowRoot.getElementById('audio').play()
        document.removeEventListener('click', musicPlay)
        document.removeEventListener('scroll', musicPlay)
      }
      document.addEventListener('click', musicPlay)
      document.addEventListener('scroll', musicPlay)
    }

    createSketch () {
      this.sketch = new Sketch(this.width, this.height)

      new p5 ((p) => {
        p.setup = () => {
          this.sketch.setup(p)
          this.p = p

          // move p5 default canvas inside widget
          const canvas = document.querySelector('canvas')
          this.canvas = canvas
          canvas.parentNode.removeChild(canvas)
          const widget = this.shadowRoot.querySelector('.widget-container')
          widget.appendChild(canvas)
        }

        p.draw = () => { this.sketch.draw(p) }
        // p.mouseReleased = (e) => { }
        // p.mouseDragged = (e) => { }
      })
    }

    disconnectedCallback () {}
    static get observedAttributes() {
      return ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period', 'save'];
    }
    attributeChangedCallback (attrName, oldval, newVal) {
      this.sketch.update(attrName, newVal)

      if (attrName === 'save' && newVal) {
        this.p.save('canvas.jpg') // TODO
      }
    }
  }
  window.customElements.define('design-het', DesignHet);
})()

let deltaPhi = 0
let deltaTheta = 0

function myOrbit () {
  const sensitivityX = 1
  const sensitivityY = 1
  const cam = this._renderer._curCamera;

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
        -sensitivityX * (this.mouseX - this.pmouseX) / scaleFactor;
      deltaPhi = sensitivityY * (this.mouseY - this.pmouseY) / scaleFactor;
      this._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    }
  }
  return {
    cam: cam,
    deltaTheta: deltaTheta,
    deltaPhi: deltaPhi
  }
}


class Sketch {
  constructor (width, height) {
    this.width = width
    this.height = height
    this.selectedPosition = null

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
  }

  update (name, val) {
    if (this[name] !== val) {
      this[name] = parseFloat(val)
    }
  }

  setup (p) {
    p.noCanvas()
    p.createCanvas(this.width, this.height, p.WEBGL)
    // p.frameRate(25)

    // camera
    p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2);
    const cam = p.createCamera()

    // p.debugMode()

    p.myOrbit = myOrbit.bind(p)

    this.circle = new Circle(this.ampl, this.width, this.height)
  }

  draw(p) {
    const camera = p.myOrbit()
    p.background(0)

    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.dx = (p.TWO_PI / this.period) * this.spacing
    this.theta += this.tempo

    this.grid(p)
    this.circle.create(p, camera, this.selectedPosition)

  }

  grid (p) { // TODO
    p.noStroke()
    p.fill(241, 67, 65)

    p.translate(-this.width/2, this.height/2, 0)
    let objpos = 0
    let a = this.theta

    for(let x = 0; x<= this.xNodes; x++) {
      let yp = p.sin(a) * this.ampl
      for(let z = 0; z<= this.yNodes; z++) {
        p.push()
        p.rotateX(p.HALF_PI)
        let xp = (x * this.xgap)
        let zp = (z * this.zgap)

        p.translate(xp, yp, zp)
        p.sphere(this.nodesize)
        p.pop()
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
