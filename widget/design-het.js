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

      this.p5 = null

      this.rotateX = 0
      this.rotateY = 0

      this.width = 0
      this.height = 0
      this.cam = null

      this.theta = 0.00
      this.dx = null
      this.xgap = 50
      this.zgap = 50
      this.xNodes = 160
      this.yNodes = 90
      this.nodeSize = 6
      this.spacing = 3
      this.tempo = 0.05
      this.ampl = 20
      this.period = 500
    }

    connectedCallback () {
      this.p5 = new p5 ((p) => {
        p.setup = () => {
          this.setup(p)
        }

        p.draw = () => {
          this.draw()
        }

        p.mouseReleased = (e) => {
          this.mouseReleased(e)
        }
        p.mouseDragged = (e) => {
          // this.mouseDragged(e)
        }
      })
    }

    setup (p) {
      p.noCanvas()
      this.width = window.innerWidth // todo
      this.height = window.innerHeight // todo
      this.p5.createCanvas(this.width, this.height, p.WEBGL)

      // move canvas inside widget
      this.canvas = document.querySelector('canvas')
      this.canvas.parentNode.removeChild(this.canvas)
      this.widget = this.shadowRoot.querySelector('.widget-container')
      this.widget.appendChild(this.canvas)

      this.mouseX = this.width / 2
      this.mouseY = this.height / 2
      this.xNodes = parseInt(this.width / this.xgap)
      this.yNodes = parseInt(this.height / this.zgap)

      this.dx = (p.TWO_PI / this.period) * this.spacing

      // camera
      p.ortho(-this.width/2, this.width/2, -this.height/2, this.height/2);
      this.cam = p.createCamera()
      // this.cam.setPosition(-this.width/2, this.height/2, 0);

      // p.noLoop()
      p.frameRate(25)
    }

    mouseDragged (e) {
      let x = this.p5.mouseX
      let y = this.p5.mouseY

      if (this.mouseX < x) {
        let val = (x - this.mouseX) / 2
        this.rotateX -= val
      } else if (this.mouseX > x) {
        let val = (this.mouseX - x) / 2
        this.rotateX += val
      }

      if (this.mouseY < y) {
        let val = (y - this.mouseY) / 2
        this.rotateY -= val
      } else if (this.mouseY > y) {
        let val = (this.mouseY - y) / 2
        this.rotateY += val
      }

      this.mouseX = x
      this.mouseY = y
    }

    mouseReleased (e) {
      // console.log(e, 'e');
      // let state = e.getModifierState()
      // console.log(state);
    }

    draw() {
      this.p5.orbitControl()
      this.p5.background(0);
      // mouseEvent rotation
      // this.p5.push()
      // let radX = this.p5.radians(this.rotateX)
      // this.p5.rotateY(radX)
      // let radY = this.p5.radians(this.rotateY)
      // this.p5.rotateX(radY)
      this.theta += this.tempo
      let position = this.grid()
      // this.p5.pop()

      this.object(position)
    }

    grid () {
      this.p5.noStroke()
      this.p5.fill(241, 67, 65)

      this.p5.translate(-this.width/2, this.height/2, 0)
      let objpos = 0
      let a = this.theta

      for(let x = 0; x<= this.xNodes; x++) {
        let yp = this.p5.sin(a) * this.ampl
        for(let z = 0; z<= this.yNodes; z++) {
          this.p5.push()
          this.p5.rotateX(this.p5.HALF_PI)
          // this.p5.rotateY(this.p5.HALF_PI)
          // this.p5.rotateZ(this.p5.HALF_PI)
          let xp = (x * this.xgap)
          let zp = (z * this.zgap)

          this.p5.translate(xp, yp, zp)
          this.p5.sphere(this.nodeSize)
          this.p5.pop()
          if(xp === 250 && zp === 250) {
            objpos = yp
          }
          a += this.dx
        }
      }

      return objpos
    }

    object (pos) {
      this.p5.rotateX(this.p5.HALF_PI)
      this.p5.fill(241, 67, 65)
      this.p5.stroke(255)
      this.p5.strokeWeight(2)

      let x = this.width / 2
      let y = this.height / 2

      for (let o = 0; o < 11; o++) {
        this.p5.push()
        this.p5.translate(0, this.ampl + 10 + o, pos)
        this.p5.rotateX(this.p5.PI/2)
        this.p5.ellipse(x + o*10, y, 100, 100);
        this.p5.pop()
      }

    }
    // disconnectedCallback () {}
    // attributeChangedCallback (attrName, oldval, newVal) {}
  }

  window.customElements.define('design-het', DesignHet);
})()

// class Sketch {
//   constructor () {
//
//   }
// }
