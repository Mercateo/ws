import React, { SFC } from 'react';
import { Translate } from '@mercateo/ws-intl';

/**
 * This component shows a translated message.
 */
export const SomeComponent: SFC = () => (
  <Translate>{(messages: I18N) => <p>{messages.someContent()}</p>}</Translate>
);

/**
 * This component shows a the usage of the message format.
 */
export const OtherComponent: SFC = () => (
  <Translate>
    {(messages: I18N) => (
      <p>{messages.contentWithMessageFormat({ count: 1 })}</p>
    )}
  </Translate>
);

/**
 * This component is only used to test the nested message format.
 */
export const NestedMessageFormatComponent: SFC = () => (
  <Translate>
    {(messages: I18N) => (
      <p>{messages.contentWithNestedMessageFormat({ count: 1, thing: 'X' })}</p>
    )}
  </Translate>
);

/**
 * This component is only here to test some storybook configuration.
 */
export const NameComponent: SFC<{ first: string; last: string }> = (props) => (
  <Translate>
    {(messages: I18N) => <p>{messages.appMessageFormatName(props)}</p>}
  </Translate>
);
