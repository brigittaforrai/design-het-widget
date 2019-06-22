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
      }
    </style>
    <div class="widget-container"></div>
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
    }

    createSketch () {
      this.sketch = new Sketch(this.width, this.height)

      new p5 ((p) => {
        p.setup = () => {
          this.sketch.setup(p)

          // move p5 default canvas inside widget
          const canvas = document.querySelector('canvas')
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
    attributeChangedCallback (attrName, oldval, newVal) {}
  }
  window.customElements.define('design-het', DesignHet);
})()

let camRotation = {
  x: 0,
  y: 0,
  z: 0
}


class Sketch {
  constructor (width, height) {
    this.width = width
    this.height = height

    this.dx = null
    this.xNodes = null
    this.yNodes = null

    this.xgap = 50
    this.zgap = 50
    this.theta = 0.00
    this.nodeSize = 6
    this.spacing = 3
    this.tempo = 0.05
    this.ampl = 20
    this.period = 500
  }

  setup (p) {
    p.noCanvas()
    p.createCanvas(this.width, this.height, p.WEBGL)
    p.frameRate(25)

    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.dx = (p.TWO_PI / this.period) * this.spacing

    // camera
    p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2);
    // const cam = p.createCamera()
    // cam.setPosition(-this.width/2, this.height/2, 0);

    // const circle = new Circle(position, this.ampl, this.width, this.height)
    // circle.create(p)
  }

  draw(p) {
    p.background(0);
    p.normalMaterial();
    this.theta += this.tempo
    let position = this.grid(p)

    // this.orbit(p)
    p.orbitControl()

    const circle = new Circle(position, this.ampl, this.width, this.height)
    circle.create(p)
  }

  orbit (p) {
    const curCam = p._renderer._curCamera
    const prevX = curCam.eyeX
    const prevY = curCam.eyeY
    const prevZ = curCam.eyeZ

    p.orbitControl()

    const x = curCam.eyeX
    const y = curCam.eyeY
    const z = curCam.eyeZ

    // if (prevX !== x) {
    //   camRotation.x = (x - prevX) + camRotation.x
    // }
    if (prevY !== y) {
      camRotation.y = (y - prevY) + camRotation.y
    }
    // if (prevZ !== z) {
    //   camRotation.z = (z - prevZ) + camRotation.z
    // }
    return camRotation
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

        // if ((x >5 && x<10) && (z === 5)) {
        //   p.sphere(this.nodeSize * 7)
        //   p.fill(255)
        //   p.rotateX(-1 * p.HALF_PI)
        //   p.ellipse(0, 0, this.nodeSize * 15, this.nodeSize * 15);
        //   p.fill(241, 67, 65)
        // } else {
          p.sphere(this.nodeSize)
        // }

        p.pop()
        if(xp === 250 && zp === 250) {
          objpos = yp
        }
        a += this.dx
      }
    }
    return objpos
  }
}

class Circle {
  constructor (position, ampl, width, height) {
    this.position = position
    this.width = width
    this.height = height
    this.ampl = ampl
  }

  create (p) {
    p.rotateX(p.HALF_PI)
    p.fill(241, 67, 65)
    p.stroke(255)
    p.strokeWeight(2)

    let x = this.width / 2
    let y = this.height / 2

    for (let o = 0; o < 11; o++) {
      p.push()
      p.translate(0, this.ampl + 10 + o, this.position)
      p.rotateX(p.PI/2)
      // p.rotateX(p.radians(-1 * (camRotation.x)))
      // p.rotateY(p.radians(-1 * camRotation.y))
      // p.rotateZ(p.radians(-1 * camRotation.z))
      p.ellipse(x + o*10, y, 100, 100);
      p.pop()
    }
  }
}
