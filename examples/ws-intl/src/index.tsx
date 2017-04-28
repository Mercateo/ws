import React, { Component } from 'react';
import PropTypes from 'prop-types';

export interface WsIntlProviderProps {
  messages: any;
}

export class WsIntlProvider extends Component<WsIntlProviderProps, {}> {
  static childContextTypes = {
    messages: PropTypes.any.isRequired
  };

  getChildContext() {
    return {
      messages: this.props.messages
    };
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export interface WsIntlConsumerProps {
  children?: (messages: any) => JSX.Element;
}

export class WsIntlConsumer extends Component<WsIntlConsumerProps, {}> {
  static contextTypes = {
    messages: PropTypes.any.isRequired
  };

  render() {
    return <div>{(this.props.children as any)(this.context.messages)}</div>;
  }
}
