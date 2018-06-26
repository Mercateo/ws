import React, { SFC } from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { AppComponent } from './app';

require('normalize.css/normalize.css');
require('./style.less');

function run(Component: SFC) {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
}

run(AppComponent);

if (module.hot) {
  module.hot.accept('./app', () => run(AppComponent));
}
