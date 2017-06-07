import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './app';

render(<AppComponent />, document.getElementById('app'));
