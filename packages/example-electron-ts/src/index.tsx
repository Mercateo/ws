import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { HelloWorld } from './HelloWorld';
import { NameComponent, ImageTestComponent } from 'example-browser-ts-react';
import { getCwd } from 'example-node-ts';
import { genSalt } from 'bcrypt';

genSalt(10, function(err, salt) {
  console.log(salt);
});

render(
  <div>
    <NameComponent a={1} b={2} name="_phil_" />
    <ImageTestComponent />
    {getCwd()}
    <HelloWorld />
  </div>,
  document.getElementById('app')
);
