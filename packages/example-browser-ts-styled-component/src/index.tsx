import React, { Component } from 'react';
import styled from 'styled-components';

const stopwatch = (member: string) =>
  function(Component: Function) {
    const origin = Component.prototype[member];

    Component.prototype[member] = function() {
      const start = Date.now();
      const result = origin.apply(this, arguments);
      // eslint-disable-next-line no-console
      console.log(`${Component.name} rendered in: ${Date.now() - start}`);
      return result;
    };
  };

export const FancyStyle = styled.p<{ primary?: boolean }>`
  font-size: 1.5 rem;
  text-align: center;
  color: red;

  ${({ primary }) => primary && `font-weight: bold;`};
`;

@stopwatch('render')
export class FancyTitle extends Component {
  render() {
    const { children } = this.props;
    return <FancyStyle primary>{children}</FancyStyle>;
  }
}
