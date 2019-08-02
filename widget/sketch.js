import { Circle, Circle2 } from './circle.js'
import FileSaver from 'file-saver'
import toBlob from 'canvas-toBlob'


console.log(toBlob, 'blob');

export default class Sketch {
  constructor (width, height, shadowRoot, toSave) {
    this.width = width
    this.height = height
    this.shadowRoot = shadowRoot
    this.fullscreen = false
    this.background ='rgba(0, 0, 0, 1)'

    // todo rename these
    this.randomDots = []
    this.circles = []

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
    if (this.circles.length < 3) {
      const x = Math.round(Math.random() * this.xNodes)
      const y = Math.round(Math.random() * this.yNodes)

      this.randomDots.push({x: x, y: y})
      this.circles.push(new Circle2(this.p, this.width, this.height))
    }
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
      FileSaver.saveAs(blob, 'design-het.png');
      this.p.resizeCanvas(this.width, this.height, true)
      this.setOrtho()
      this.canvas.style.display = 'block'
      this.loader.style.display = 'none'
      this.play()
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
    // this.p.setAttributes('antialias', true);
    // this.p.smooth()

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
  }

  update (name, val) {
    if (this[name] !== val) {
      this[name] = parseFloat(val)
      if (name === 'xgap' || name === 'zgap') {
        this.xNodes = parseInt(this.width / this.xgap)
        this.yNodes = parseInt(this.height / this.zgap)
      }
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

    this.p.translate(-this.width/2, this.height/2, 0)
    this.p.rotateX(this.p.HALF_PI)

    let objpos = 0
    let a = this.theta
    let z = 0;

    for(let x = 0; x<= this.xNodes; x++) {
      const yp = Math.sin(a) * this.ampl
      this.p.translate(this.xgap, yp, z * -this.zgap)

      for(z = 0; z<= this.yNodes; z++) {
        let isCircle = false
        this.p.translate(0, 0, this.zgap)

        // circle
        if (this.randomDots.length) {
          for(let d = 0; d < this.randomDots.length; d++) {
            if (this.randomDots[d].x === x && this.randomDots[d].y === z) {
              this.circles[d].draw(yp)
              isCircle = true
            }
          }
        }

        if (!isCircle) {
          this.p.noStroke()
          this.p.fill(249, 66, 58)
          this.p.sphere(this.nodesize)
        }

        a += this.dx
      }
    }
  }
}
