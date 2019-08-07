function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <link rel=\"stylesheet\" href=\"./../styles/widget.css\">\n      <template id=\"design-het-widget\">\n        <div class=\"widget-container\">\n          <div class=\"loader\"></div>\n          <audio id=\"audio\" controls autoplay loop style=\"display: none\">\n            <source src=\"src/assets/music.mp3\" type=\"audio/mpeg\">\n            <p>Your browser doesn't support HTML5 audio. Here is\n          </audio>\n        </div>\n        <svg id=\"circle\" xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"></svg>\n      </template>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import { LitElement, html } from 'lit-element';
import p5 from 'p5';
import Sketch from './../sketch.js';
import toBlob from 'canvas-to-blob';
import { getRandom } from './../helpers.js';
import { RED } from './../constants.js';
var inputAttrs = ['xgap', 'zgap', 'theta', 'nodesize', 'spacing', 'tempo', 'ampl', 'period'];
var attrs = ['saveas', 'stop', 'fullscreen', 'mute'];
export default class DesignHet extends LitElement {
  static get properties() {
    return {
      xgap: {
        type: Number
      },
      zgap: {
        type: Number
      },
      theta: {
        type: Number
      },
      nodesize: {
        type: Number
      },
      spacing: {
        type: Number
      },
      tempo: {
        type: Number
      },
      ampl: {
        type: Number
      },
      period: {
        type: Number
      },
      saveas: {
        type: Boolean
      },
      stop: {
        type: Boolean
      },
      fullscreen: {
        type: Boolean
      },
      mute: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.sketch = null;
    this.svg = null;
    this.circles = null;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  render() {
    return html(_templateObject());
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('Interactive content: brigittaforrai.com');
    toBlob.init();
    var canLoop = this.getAttribute('animation') === 'true';
    this.svg = this.shadowRoot.querySelector('svg#circle');
    this.sketch = new Sketch(this.width, this.height, this.shadowRoot, canLoop);
    this.updateSvg();
    new p5(this.sketch.setupP5); // todo preload ?

    var musicPlay = () => {
      this.audio = this.shadowRoot.getElementById('audio');
      this.audio.play();
      document.removeEventListener('click', musicPlay);
      document.removeEventListener('scroll', musicPlay);
    };

    document.addEventListener('click', musicPlay);
    document.addEventListener('scroll', musicPlay);
  } // static get observedAttributes() {
  //   return inputAttrs.concat(attrs)
  // }


  updateSvg() {
    var randomR = getRandom(20, 100);
    var randomY = getRandom(2 * randomR, this.height - 4 * randomR); // todo

    var randomX = getRandom(2 * randomR, this.width - 4 * randomR);
    var distance = randomR / 5;
    var number = getRandom(3, 23);
    var directions = [-1, 0, 1];
    var index = getRandom(0, 2);
    var direction = directions[index];
    this.svg.innerHTML = '';

    for (var i = 0; i < number; i++) {
      var y = randomY + i * distance / 2 * direction;
      var circle = createElement('circle', {
        cx: randomX + i * distance,
        cy: y,
        r: randomR,
        fill: RED,
        stroke: 'white',
        strokeWidth: 2,
        name: 'circle',
        pos: y
      });
      this.svg.appendChild(circle);
    }

    var circles = this.shadowRoot.querySelectorAll([name = "circle"]);
    this.sketch.updateSvgNodes(circles);
  }

  attributeChangedCallback(attrName, oldval, newVal) {
    super.attributeChangedCallback();

    if (attrName === 'saveas' && newVal) {
      this.sketch.save(newVal);
    }

    if (attrName === 'stop' && newVal) {
      this.sketch.stop();
    }

    if (attrName === 'fullscreen') {
      this.sketch.setFullscreen(newVal);
    }

    if (attrName === 'mute' && this.audio) {
      if (newVal === 'true') {
        this.audio.pause();
      } else if (newVal === 'false') {
        this.audio.play();
      }
    }

    if (inputAttrs.indexOf(attrName) >= 0) {
      this.sketch.update(attrName, newVal);
    }
  }

}

function createElement(name, attributes) {
  var ns = "http://www.w3.org/2000/svg";
  var elem = document.createElementNS(ns, name);

  if (attributes) {
    Object.keys(attributes).forEach(i => {
      var key = i.split(/(?=[A-Z])/).join('-');
      elem.setAttribute(key.toLowerCase(), attributes[i]);
    });
  }

  return elem;
}

window.customElements.define('design-het', DesignHet);