import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './app';

require('normalize.css/normalize.css');
require('./style.less');

render(<AppComponent />, document.getElementById('app'));
