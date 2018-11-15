import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { NameComponent, ImageTestComponent } from 'example-browser-ts-react';
import { hello } from './data.json';
import { FancyTitle } from 'example-browser-ts-styled-component';

export class Counter extends Component<{}, { value: number }> {
  state = {
    value: 0
  };

  intervalId: ReturnType<typeof setInterval> | null = null;

  componentDidMount() {
    this.intervalId = setInterval(
      () => this.setState(({ value }) => ({ value: value + 1 })),
      1000
    );
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    return <p>Value is: {this.state.value * 100}</p>;
  }
}

export const AppComponent = () => (
  <div>
    <FancyTitle>Unite example SPA</FancyTitle>
    <Counter />
    <NameComponent a={1} b={2} name="_otbe_" />
    <ImageTestComponent />
    {process.env.NODE_ENV === 'production' ? (
      <p>Production Build</p>
    ) : (
      <p>Dev Build</p>
    )}
    <p>This string was loaded from a JSON file: {hello}</p>
  </div>
);

/**
 * This is our app component.
 */
export const App = hot(module)(AppComponent);
