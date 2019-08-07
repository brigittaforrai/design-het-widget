import { document, console } from 'global';
import { storiesOf } from '@storybook/html';
import './../dist/design-het-widget.min.js'

storiesOf('Demo', module)
  .add('widget', () => {
    return `
      <design-het animation="true" style="width: 100%; height: 100%; position: fixed; left: 0; top: 0; z-index: -100;"></design-het>
      <design-het-interface download="true"></design-het-interface>
    `
  })
