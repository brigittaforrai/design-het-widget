import { document, console } from 'global'
import { storiesOf } from '@storybook/html'
import { addons } from '@storybook/addons';
import './../dist/design-het-widget.js'


storiesOf('Design Het', module)
  .add('default', () => {
    return `
      <design-het music-url="./../../music.mp3" style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
      <design-het-interface></design-het-interface>
    `
  })
  .add('no download, no music', () => {
    return `
      <design-het style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
      <design-het-interface disable-download="true"></design-het-interface>
    `
  })
  .add('3 circles', () => {
    return `
      <design-het circles="3" style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
      <design-het-interface></design-het-interface>
    `
  })
  .add('2 circles', () => {
    return `
      <design-het circles="2" style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
      <design-het-interface></design-het-interface>
    `
  })
  .add('installation', () => {
    return `
      <design-het style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"
                    circles="3"
                    class="widget"
                    rotatex="20"
                    rotatey="30"
                    installation="true"></design-het>
    `
  })
