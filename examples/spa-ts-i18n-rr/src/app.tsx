import React, { Component } from 'react';
import { NameComponent, ImageTestComponent } from 'ws-examples-browser-ts-react';
import { SomeComponent, OtherComponent } from 'ws-examples-browser-ts-react-i18n';
import { WsIntlProvider } from 'ws-intl';
import { RouteComponentProps, Link } from 'react-router-dom';

require('normalize.css/normalize.css');
require('./style.less');

type Props = RouteComponentProps<{ locale: string }>;
type State = { messages?: I18N };


/**
 * This is our app component.
 */
export class AppComponent extends Component<Props, State> {
  state: State = {};

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  async componentWillReceiveProps(nextProps: Props) {
    this.setState({});
    const messages = await _import<I18N>(`../dist-i18n/${nextProps.match.params.locale}.js`);
    this.setState({ messages });
  }

  render() {
    if (this.state.messages == null) {
      return null;
    }

    return (
      <WsIntlProvider messages={this.state.messages}>
        <Link to="/de_DE">de_DE</Link> |
        <Link to="/de_AT">de_AT</Link> |
        <Link to="/en_GB">en_GB</Link> |
        <Link to="/en_US">en_US</Link> <br />
        <NameComponent a={1} b={2} name="_otbe_" />
        <ImageTestComponent />
        {
          process.env.NODE_ENV === 'production'
            ? <p>Production Build</p>
            : <p>Dev Build</p>
        }
        <p>locale: {this.state.messages.LOCALE}</p>
        <p>intl locale: {this.state.messages.INTL_LOCALE}</p>
        <p>language code: {this.state.messages.LANGUAGE_CODE}</p>
        <p>country code: {this.state.messages.COUNTRY_CODE}</p>
        <SomeComponent />
        <OtherComponent />
        <p>{this.state.messages.commonHello()}</p>
        <p>{this.state.messages.commonDescribe()}</p>
        <p>{this.state.messages.commonColor()}</p>
        <p>{this.state.messages.commonJanuary()}</p>
        <p>{this.state.messages.appLoading()}</p>
        <p>{this.state.messages.appMessageFormatExample({ numPhotos: 0 })}</p>
        <p>{this.state.messages.appMessageFormatExample({ numPhotos: 1 })}</p>
        <p>{this.state.messages.appMessageFormatExample({ numPhotos: 2 })}</p>
        <p>{this.state.messages.appMessageFormatGender({ gender: 'f' })}</p>
        <p>{this.state.messages.appMessageFormatGender({ gender: 'm' })}</p>
        <p>{this.state.messages.appMessageFormatHomer({ name: 'Homer' })}</p>
        <p>{this.state.messages.appMessageFormatHomer({ name: 'Foo' })}</p>
        <p>{this.state.messages.appMessageFormatName({ first: 'John', last: 'Snow' })}</p>
      </WsIntlProvider>
    );
  }
}

