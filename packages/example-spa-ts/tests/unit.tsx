import expect from 'expect';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { NameComponent, ImageTestComponent } from 'example-browser-ts-react';
import { AppComponent, Counter } from '../src/app';

describe('test my code', () => {
  it('should show my app', () => {
    const renderer = createRenderer();
    renderer.render(<AppComponent />);
    const output = renderer.getRenderOutput();

    expect(output.type).toBe('div');
    expect(output.props.children).toEqual([
      <Counter />,
      <NameComponent a={1} b={2} name="_otbe_" />,
      <ImageTestComponent />,
      <p>Dev Build</p>
    ]);
  });
});
