import expect from 'expect';
import React from 'react';
import { SomeComponent, OtherComponent } from '../src/index';
import { mount } from 'enzyme';
import { WsIntlProvider } from 'ws-intl';

describe('test my i18n components', () => {
  it('should render <SomeComponent />', () => {
    const provider = mount(<WsIntlProvider messages={require('../dist-i18n/en_GB')}><SomeComponent /></WsIntlProvider>);
    const consumer = provider.childAt(0);
    const comp = consumer.childAt(0);

    expect(comp.type()).toBe('p');
    expect(comp.props().children).toEqual(['Hello translated content!']);
  });

  it('should render <OtherComponent />', () => {
    const provider = mount(<WsIntlProvider messages={require('../dist-i18n/en_GB')}><OtherComponent /></WsIntlProvider>);
    const consumer = provider.childAt(0);
    const comp = consumer.childAt(0);

    expect(comp.type()).toBe('p');
    expect(comp.props().children).toEqual(['You have one.']);
  });
});
