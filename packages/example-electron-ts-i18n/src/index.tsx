import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { HelloWorld } from './HelloWorld';
import { SomeComponent, OtherComponent } from 'example-browser-ts-react-i18n';
import { getCwd } from 'example-node-ts';
import { Translations } from '@mercateo/ws-intl';

render(
  <div>
    <Translations messages={require('../dist-i18n/en_GB')}>
      <div>
        <SomeComponent />
        <OtherComponent />
        {getCwd()}
        <HelloWorld />
      </div>
    </Translations>
  </div>,
  document.getElementById('app')
);
