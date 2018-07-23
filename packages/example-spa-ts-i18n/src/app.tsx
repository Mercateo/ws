import React, { Component } from 'react';
import { NameComponent, ImageTestComponent } from 'example-browser-ts-react';
import { SomeComponent, OtherComponent } from 'example-browser-ts-react-i18n';
import { Translations } from '@mercateo/ws-intl';

require('normalize.css/normalize.css');
require('./style.css');

const messages: I18N = require('../dist-i18n/de_DE');

/**
 * This is our app component.
 */
export class AppComponent extends Component<{}, {}> {
  render() {
    return (
      <Translations messages={messages}>
        <div>
          <NameComponent a={1} b={2} name="_otbe_" />
          <ImageTestComponent />
          {process.env.NODE_ENV === 'production' ? (
            <p>Production Build</p>
          ) : (
            <p>Dev Build</p>
          )}
          <p>locale: {messages.LOCALE}</p>
          <p>intl locale: {messages.INTL_LOCALE}</p>
          <p>language code: {messages.LANGUAGE_CODE}</p>
          <p>country code: {messages.COUNTRY_CODE}</p>
          <SomeComponent />
          <OtherComponent />
          <p>{messages.commonHello()}</p>
          <p>{messages.commonDescribe()}</p>
          <p>{messages.commonColor()}</p>
          <p>{messages.commonJanuary()}</p>
          <p>{messages.appLoading()}</p>
          <p>{messages.appMessageFormatExample({ numPhotos: 0 })}</p>
          <p>{messages.appMessageFormatExample({ numPhotos: 1 })}</p>
          <p>{messages.appMessageFormatExample({ numPhotos: 2 })}</p>
          <p>{messages.appMessageFormatGender({ gender: 'f' })}</p>
          <p>{messages.appMessageFormatGender({ gender: 'm' })}</p>
          <p>{messages.appMessageFormatHomer({ name: 'Homer' })}</p>
          <p>{messages.appMessageFormatHomer({ name: 'Foo' })}</p>
          <p>
            {messages.appMessageFormatName({ first: 'John', last: 'Snow' })}
          </p>
        </div>
      </Translations>
    );
  }
}
