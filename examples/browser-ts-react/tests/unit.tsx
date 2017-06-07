import expect from 'expect';
import React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { NameComponent } from '../src/index';

describe('test my code', () => {
  it('should show my name and sum', () => {
    const renderer = createRenderer();
    renderer.render(<NameComponent name="foo" a={1} b={2} />);
    const output = renderer.getRenderOutput();

    expect(output.type).toBe('p');
    expect(output.props.children).toEqual([
      'Hello ',
      'foo',
      '! Sum is ',
      3,
      '.'
    ]);
  });
});
