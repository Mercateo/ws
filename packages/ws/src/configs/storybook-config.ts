import 'babel-polyfill';
import { addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
const { withBackgrounds } = require('@storybook/addon-backgrounds');
const { checkA11y } = require('@storybook/addon-a11y');

addDecorator(checkA11y);
addDecorator(withKnobs);
addDecorator(
  withBackgrounds([
    {
      name: 'default',
      value: '#f3f2f1',
      default: true
    },
    {
      name: 'white',
      value: '#ffffff'
    },
    {
      name: 'dark',
      value: '#4a4a4a'
    },
    {
      name: 'transparent',
      value:
        'url(data:image/gif;base64,R0lGODlhEAAQAIAAAOXl5f///yH5BAAAAAAALAAAAAAQABAAAAIfjG+gq4jM3IFLJgpswNly/XkcBpIiVaInlLJr9FZWAQA7)'
    },
    {
      name: 'grid',
      value:
        'url(data:image/gif;base64,R0lGODlhEAAQAJEAAP///8iikfDl3wAAACH5BAAAAAAALAAAAAAQABAAAAIphA+BJ2vqmoNLLooswswlrx2cIQTmiabjF3lr+ICuPNGXvYHCzpd9XwAAOw==)'
    }
  ])
);
