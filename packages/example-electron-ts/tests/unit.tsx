import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-test-renderer/shallow';
import { HelloWorld } from '../src/HelloWorld';

describe('test my electron app', () => {
  it('should render a react component', () => {
    const renderer = createRenderer();
    renderer.render(<HelloWorld />);
    const output = renderer.getRenderOutput();

    expect(output.type).toBe('div');
    expect(output.props.children).toEqual('Hello World :)');
  });
});
