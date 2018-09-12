import React, { Component } from 'react';
import styled from 'styled-components';

const FancyStyle = styled.p<{ primary?: boolean }>`
  font-size: 1.5 rem;
  text-align: center;
  color: red;

  ${({ primary }) => primary && `font-weight: bold;`};
`;

const stopwatch = (member: string) =>
  function(Component: Function) {
    const origin = Component.prototype[member];

    Component.prototype[member] = function() {
      const start = Date.now();
      const result = origin.apply(this, arguments);
      console.log(`${Component.name} rendered in: ${Date.now() - start}`);
      return result;
    };
  };

@stopwatch('render')
export class FancyTitle extends Component {
  render() {
    const { children } = this.props;
    return <FancyStyle primary>{children}</FancyStyle>;
  }
}
