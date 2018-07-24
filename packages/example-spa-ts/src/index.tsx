import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './style.css';
import { AppComponent } from './app';

function run() {
  render(
    <AppContainer>
      <AppComponent />
    </AppContainer>,
    document.getElementById('app')
  );
}

run();

if (module.hot) {
  module.hot.accept('./app', () => run());
}
