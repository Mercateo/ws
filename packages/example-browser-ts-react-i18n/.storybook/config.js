import '@mercateo/ws/dist/storybook-config';
import { configure } from '@storybook/react';

configure(() => {
  const req = require.context('../stories', true, /.*\.tsx$/);
  req.keys().forEach(req);
}, module);
