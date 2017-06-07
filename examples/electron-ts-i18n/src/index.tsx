import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { HelloWorld } from './HelloWorld';
import {
  SomeComponent,
  OtherComponent
} from 'ws-examples-browser-ts-react-i18n';
import { getCwd } from 'ws-examples-node-ts';
import { WsIntlProvider } from 'ws-intl';

render(
  <div>
    <WsIntlProvider messages={require('../dist-i18n/en_GB')}>
      <SomeComponent />
      <OtherComponent />
      {getCwd()}
      <HelloWorld />
    </WsIntlProvider>
  </div>,
  document.getElementById('app')
);
