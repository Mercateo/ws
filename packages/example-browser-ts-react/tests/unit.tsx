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
      '. This is for @otbe.'
    ]);
  });

  it('should use custom babel plugin for markdown', () => {
    // TODO: Remove this line https://github.com/prettier/prettier/issues/3292
    // prettier-ignore
    expect(markdown`# hello`).toBe('<h1>hello</h1>\n');
  });
});
