import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Translations } from '@mercateo/ws-intl';

import {
  SomeComponent,
  OtherComponent,
  NestedMessageFormatComponent
} from '../src';

configure({ adapter: new Adapter() });

describe('test my i18n components', () => {
  it('should render <SomeComponent />', () => {
    const wrapper = mount(
      <Translations messages={require('../dist-i18n/en_GB')}>
        <SomeComponent />
      </Translations>
    );

    expect(wrapper.text()).toEqual('Hello translated content!');
  });

  it('should render <OtherComponent />', () => {
    const wrapper = mount(
      <Translations messages={require('../dist-i18n/en_GB')}>
        <OtherComponent />
      </Translations>
    );

    expect(wrapper.text()).toEqual('You have one.');
  });

  it('should render <NestedMessageFormatComponent />', () => {
    const wrapper = mount(
      <Translations messages={require('../dist-i18n/en_GB')}>
        <NestedMessageFormatComponent />
      </Translations>
    );

    expect(wrapper.text()).toEqual('You have one X.');
  });
});
