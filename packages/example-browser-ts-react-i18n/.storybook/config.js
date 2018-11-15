import { configure, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { withBackgrounds } from '@storybook/addon-backgrounds';
import { checkA11y } from '@storybook/addon-a11y';

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
      name: 'transparent',
      value:
        'url(data:image/gif;base64,R0lGODlhEAAQAIAAAOXl5f///yH5BAAAAAAALAAAAAAQABAAAAIfjG+gq4jM3IFLJgpswNly/XkcBpIiVaInlLJr9FZWAQA7)'
    }
  ])
);

configure(() => {
  const req = require.context('../stories', true, /.*\.tsx$/);
  req.keys().forEach(req);
}, module);
