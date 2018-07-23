import React, { Component } from 'react';
import { add } from 'example-browser-ts';

require('./style.css');
const smileSrc = require('./smile.png');

/**
 * These are the props which can be passed to our component.
 */
export interface NameComponentProps {
  /**
   * This is the name of your user.
   */
  name: string;
  /**
   * The first summand.
   */
  a: number;
  /**
   * The second summand.
   */
  b: number;
}

// BUG: This style doesn't work! See https://github.com/Microsoft/TypeScript/issues/8889.
// export const NameComponent = ({ name, a, b }: NameComponentProps) => (
//   <p className="name-component">
//     Hello {name}! Sum is {add(a, b)}.
//   </p>
// );

/**
 * This component says _Hello!_ to your user.
 */
export class NameComponent extends Component<NameComponentProps, {}> {
  render() {
    const { name, a, b } = this.props;
    return (
      <p className="name-component">
        Hello {name}! Sum is {add(a, b)}. This is for @BOO.
      </p>
    );
  }
}

/**
 * This component tests an image and a background image.
 */
export class ImageTestComponent extends Component<{}, {}> {
  render() {
    return (
      <div>
        <img src={smileSrc} width="10" height="10" />
        <div className="some-image" />
      </div>
    );
  }
}
