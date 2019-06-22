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

      const musicPlay = () => {
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
    static get observedAttributes() {
      return ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period'];
    }
    attributeChangedCallback (attrName, oldval, newVal) {
      this.sketch.update(attrName, newVal)
    }
  }
  window.customElements.define('design-het', DesignHet);
})()


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
    p.frameRate(25)

    this.xNodes = parseInt(this.width / this.xgap)
    this.yNodes = parseInt(this.height / this.zgap)
    this.dx = (p.TWO_PI / this.period) * this.spacing

    // camera
    p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2);
    const cam = p.createCamera()
    // cam.setPosition(-this.width/2, this.height/2, 0);
  }

  draw(p) {
    p.orbitControl()
    p.background(0);
    this.theta += this.tempo
    let position = this.grid(p)

    const circle = new Circle(position, this.ampl, this.width, this.height)
    circle.create(p)
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
      p.ellipse(x + o*10, y, 100, 100);
      p.pop()
    }
  }
}
