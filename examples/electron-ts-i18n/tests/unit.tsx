import React from 'react';
import expect from 'expect';
import ReactTestUtils from 'react-addons-test-utils';
import { HelloWorld } from '../src/HelloWorld';
import { WsIntlProvider } from 'ws-intl';
import { mount } from 'enzyme';

describe('test my electron i18n app', () => {
  it('should render a react component', () => {
    const provider = mount(<WsIntlProvider messages={require('../dist-i18n/en_GB')}><HelloWorld /></WsIntlProvider>);
    const consumer = provider.childAt(0);
    const comp = consumer.childAt(0);

    expect(comp.type()).toBe('p');
    expect(comp.props().children).toEqual('Hello World :)');
  });
});
