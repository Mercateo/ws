import React from 'react';
import { Translate } from '@mercateo/ws-intl';

export const HelloWorld = () => (
  <Translate>{(messages: I18N) => <p>{messages.welcome()}</p>}</Translate>
);
