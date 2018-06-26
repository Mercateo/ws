import React, { Component } from 'react';
import { Translate } from '@mercateo/ws-intl';

/**
 * This component shows a translated message.
 */
export class SomeComponent extends Component<{}, {}> {
  render() {
    return (
      <Translate>
        {(messages: I18N) => <p>{messages.someContent()}</p>}
      </Translate>
    );
  }
}

/**
 * This component shows a the usage of the message format.
 */
export class OtherComponent extends Component<{}, {}> {
  render() {
    return (
      <Translate>
        {(messages: I18N) => (
          <p>{messages.contentWithMessageFormat({ count: 1 })}</p>
        )}
      </Translate>
    );
  }
}

/**
 * This component is only used to test the nested message format.
 */
export class NestedMessageFormatComponent extends Component<{}, {}> {
  render() {
    return (
      <Translate>
        {(messages: I18N) => (
          <p>
            {messages.contentWithNestedMessageFormat({ count: 1, thing: 'X' })}
          </p>
        )}
      </Translate>
    );
  }
}
