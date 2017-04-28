import React, { Component } from 'react';
import { WsIntlConsumer } from 'ws-intl';

/**
 * This component shows a translated message.
 */
export class SomeComponent extends Component<{}, {}> {
  render() {
    return (
      <WsIntlConsumer>
        {(messages: I18N) => <p>{messages.someContent()}</p>}
      </WsIntlConsumer>
    );
  }
}

/**
 * This component shows a the usage of the message format.
 */
export class OtherComponent extends Component<{}, {}> {
  render() {
    return (
      <WsIntlConsumer>
        {(messages: I18N) => <p>{messages.contentWithMessageFormat({ count: 1 })}</p>}
      </WsIntlConsumer>
    );
  }
}
