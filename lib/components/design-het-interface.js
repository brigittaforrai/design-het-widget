function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <link rel=\"stylesheet\" href=\"./../styles/interface.css\">\n      <template id=\"design-het-interface\">\n        <div class=\"interface-container\">\n          <button @click=\"", "\" class=\"toggle-settings\"></button>\n          <button @click=\"", "\" class=\"mute\"></button>\n          <button @click=\"", "\" class=\"save\"></button>\n          <button @click=\"", "\" class=\"fullscreen\"></button>\n          <button @click=\"", "\" class=\"randomCircle\"></button>\n          <div class=\"interface closed\"></div>\n        </div>\n      </temmplate>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

import { LitElement, html } from 'lit-element';
import { gridSettings } from './../settings.js';
import { getRandom } from './../helpers.js';
import { settingNames } from './../constants';
export default class DesignHetInterface extends LitElement {
  static get properties() {
    return {
      muted: {
        type: Boolean
      },
      fullscreen: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.muted = false;
    this.fullscreen = false;
  }

  render() {
    return html(_templateObject(), this.trigger, this.muteSound, this.startSave, this.expand, this.widget.updateSvg);
  }

  addSettings() {
    var interf = this.shadowRoot.querySelector('.interface');
    console.log(interf, 'interf');
    Object.keys(gridSettings).forEach(i => {
      var item = gridSettings[i];
      var div = document.createElement('div');
      var random = getRandom(item[3], item[4] / 3, item[2]);
      var setting = "\n        <label for=\"".concat(i, "\">").concat(settingNames[i], ": ").concat(random, "</label>\n        <input step=\"").concat(item[2], "\" min=\"").concat(item[0], "\" max=\"").concat(item[1], "\" type=\"range\" name=\"").concat(i, "\" value=\"").concat(random, "\"></input>\n      ");
      div.innerHTML = setting;
      interf.appendChild(div);
      this.widget.setAttribute(i, random);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.widget = document.querySelector('design-het');
    this.triggerBtn = this.shadowRoot.querySelector('button.toggle-settings');
    this.muteBtn = this.shadowRoot.querySelector('button.mute');
    this.settings = this.shadowRoot.querySelector('.interface');
    this.saveBtn = this.shadowRoot.querySelector('.save');
    this.fullscreenBtn = this.shadowRoot.querySelector('.fullscreen');
    this.addSettings();
    this.addEventListeners();
    var download = this.getAttribute('download');

    if (download === 'true') {
      this.saveBtn.style.display = 'inline-block';
    } else {
      this.saveBtn.style.display = 'none';
    }
  }

  updateLabel(name, value) {
    this.shadowRoot.querySelector("label[for=\"".concat(name, "\"]")).innerHTML = "".concat(settingNames[name], ": ").concat(value);
  } // bind to dom


  inputEvents(name) {
    var selector = "input[name=".concat(name, "]");
    this.shadowRoot.querySelector(selector).addEventListener('input', e => {
      var value = e.target.value;
      this.widget.setAttribute(name, value);
      this.updateLabel(name, value);
    });
  }

  trigger() {
    if (this.settings.classList.contains('opened')) {
      this.settings.classList.remove('opened');
      this.triggerBtn.classList.remove('opened');
    } else {
      this.settings.classList.add('opened');
      this.triggerBtn.classList.add('opened');
    }
  }

  expand() {
    if (this.fullscreen) {
      this.fullscreen = false;
      this.widget.style.zIndex = -100;
      this.fullscreenBtn.classList.remove('stop');
    } else {
      this.fullscreen = true;
      this.widget.style.zIndex = 9999;
      this.fullscreenBtn.classList.add('stop');
    }

    this.widget.setAttribute('fullscreen', this.fullscreen);
  }

  muteSound() {
    this.muted = !this.muted;
    this.widget.setAttribute('mute', this.muted);

    if (this.muted) {
      this.muteBtn.classList.add('muted');
    } else {
      this.muteBtn.classList.remove('muted');
    }
  }

  startSave() {
    this.widget.setAttribute('stop', true);
  }

  addEventListeners() {
    // todo
    var inputs = ['xgap', 'zgap', 'nodesize', 'spacing', 'tempo', 'ampl', 'period'];
    inputs.forEach(name => {
      this.inputEvents(name);
    });
  }

}
window.customElements.define('design-het-interface', DesignHetInterface);