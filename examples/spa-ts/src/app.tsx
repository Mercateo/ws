import React from 'react';
import {
  NameComponent,
  ImageTestComponent
} from 'ws-examples-browser-ts-react';

/**
 * This is our app component.
 */
export const AppComponent = () =>
  <div>
    <NameComponent a={1} b={2} name="_otbe_" />
    <ImageTestComponent />
    {process.env.NODE_ENV === 'production'
      ? <p>Production Build</p>
      : <p>Dev Build</p>}
  </div>;
