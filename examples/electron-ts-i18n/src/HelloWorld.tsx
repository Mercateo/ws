import React from 'react';
import { WsIntlConsumer } from 'ws-intl';

export const HelloWorld = () => (
  <WsIntlConsumer>
    {(messages: I18N) => <p>{messages.welcome()}</p>}
  </WsIntlConsumer>
);
