import FileSaver from 'file-saver';
import svgToMiniDataURI from 'mini-svg-data-uri';
import { getRandom } from './helpers.js';
import { RED } from './constants.js';
export default class Sketch {
  constructor(width, height, shadowRoot, canLoop) {
    this.width = width;
    this.height = height;
    this.shadowRoot = shadowRoot;
    this.svgNodes = [];
    this.fullscreen = false;
    this.canLoop = canLoop;
    this.background = 'rgba(0, 0, 0, 1)';
    this.dx = null;
    this.xgap = 50; // todo

    this.zgap = 50; // todo

    this.theta = null;
    this.nodesize = null;
    this.spacing = null;
    this.tempo = null;
    this.ampl = null;
    this.period = null;
    this.xNodes = 0;
    this.yNodes = 0;
    this.setupP5 = this.setupP5.bind(this);
    this.loader = this.shadowRoot.querySelector('.loader');
  }

  setupP5(p) {
    var randomRotate = getRandom(0, 0.15, 0.01);
    this.p = p;

    p.setup = () => {
      this.setup();
    };

    p.draw = () => {
      this.draw(randomRotate);
    };

    p.windowResized = () => {
      this.windowResized();
    };
  }

  setup() {
    this.p.noCanvas();
    this.p.createCanvas(this.width, this.height, this.p.WEBGL);
    this.p.pixelDensity(4); // todo

    this.p.noStroke();
    this.p.fill(RED);

    if (!this.canLoop) {
      this.p.noLoop();
    } else {
      this.p.frameRate(30);
    }

    this.setOrtho(); // this.p.setAttributes('antialias', true)
    // this.p.smooth()
    // this.p.debugMode()
    // move p5 default canvas inside widget

    this.canvas = document.querySelector('canvas');
    this.canvas.parentNode.removeChild(this.canvas);
    var widget = this.shadowRoot.querySelector('.widget-container');
    widget.appendChild(this.canvas);
  }

  draw(randomRotate) {
    this.p.clear();
    this.p.background(this.background);

    if (this.fullscreen) {
      this.p.orbitControl();
    }

    this.dx = this.p.TWO_PI / this.period * this.spacing;
    this.theta += this.tempo; // todo

    var tx = -this.width / 2 - 2 * this.xgap;
    var ty = this.height / 2 + 2 * this.zgap;
    this.p.translate(tx, ty, 0);
    this.p.rotateX(this.p.HALF_PI);
    this.p.rotateX(randomRotate);
    this.p.rotateZ(randomRotate);
    this.drawGrid();
    this.moveSvg();
  }

  updateSvgNodes(nodes) {
    this.svgNodes = nodes;
  }

  moveSvg() {
    var y = Math.sin(this.theta) * this.ampl; // todo

    this.svgNodes.forEach(node => {
      var pos = parseInt(node.getAttribute('pos'));
      node.setAttribute('cy', pos + y);
    });
  }

  drawGrid() {
    var objpos = 0;
    var a = this.theta;
    var z = 0;

    for (var x = 0; x <= this.xNodes; x++) {
      var yp = Math.sin(a) * this.ampl;
      this.p.translate(this.xgap, yp, z * -this.zgap);

      for (z = 0; z <= this.yNodes; z++) {
        this.p.translate(0, 0, this.zgap);
        this.p.sphere(this.nodesize);
        a += this.dx;
      }
    }
  }

  stop() {
    if (this.canLoop) {
      this.p.noLoop();
    }

    this.save();
  }

  play() {
    if (this.canLoop) {
      this.p.loop();
    }
  }

  setFullscreen(val) {
    this.fullscreen = val === 'true';
  }

  save() {
    var svg = this.shadowRoot.querySelector('svg#circle');
    svg.style.display = 'none';
    this.canvas.style.display = 'none';
    this.loader.style.display = 'block';
    this.background = 'rgba(0, 0, 0, 0)';
    var aspect = this.width / this.height;
    var landscape = aspect > 1;
    var retina = window.devicePixelRatio > 1;
    var width, height;

    if (landscape) {
      width = retina ? 4000 : 4000; // todo

      height = Math.round(width / aspect);
    } else {
      height = retina ? 4000 : 4000; // todo

      width = Math.round(height * aspect);
    }

    var zoom = width / this.width;
    this.p.resizeCanvas(width, height, true);
    this.setOrtho();
    this.p.redraw();
    var newCanvas = document.createElement('canvas');
    newCanvas.setAttribute('width', width);
    newCanvas.setAttribute('height', height);
    var ctx = newCanvas.getContext('2d');
    var image = new Image();
    var s = new XMLSerializer();
    var svgStr = s.serializeToString(svg);
    var url = svgToMiniDataURI(svgStr);
    image.src = url;
    image.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      var dataURL = this.canvas.toDataURL('image/png', 1.0);
      var canvasImg = new Image();
      canvasImg.addEventListener('load', () => {
        URL.revokeObjectURL(dataURL);
        ctx.drawImage(canvasImg, 0, 0, width, height); // ctx.drawImage(image, 0, 0, width, height) // todo

        newCanvas.toBlob(blob => {
          FileSaver.saveAs(blob, 'design-het.png');
          this.p.resizeCanvas(this.width, this.height, true);
          this.setOrtho();
          this.canvas.style.display = 'block';
          this.loader.style.display = 'none';
          svg.style.display = 'inline-block';
          this.play();
        });
      });
      canvasImg.src = dataURL;
    });
  }

  setOrtho() {
    this.p.ortho(-this.width / 2, this.width / 2, -this.height / 2, this.height / 2, this.width * -3, this.width * 3);
  }

  update(name, val) {
    if (this[name] !== val) {
      this[name] = parseFloat(val);

      if (name === 'xgap' || name === 'zgap') {
        this.calcNodeNum();
      }
    }
  }

  calcNodeNum() {
    this.xNodes = Math.ceil(this.width / this.xgap) + 2;
    this.yNodes = Math.ceil(this.height / this.zgap) + 2;
  }

  windowResized() {
    this.width = this.p.windowWidth;
    this.height = this.p.windowHeight;
    this.p.resizeCanvas(this.width, this.height);
    this.setOrtho();
    this.calcNodeNum();
  }

}