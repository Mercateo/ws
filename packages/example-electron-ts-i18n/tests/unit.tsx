import React from 'react';
import expect from 'expect';
import { HelloWorld } from '../src/HelloWorld';
import { Translations } from '@mercateo/ws-intl';
import { mount } from 'enzyme';

describe('test my electron i18n app', () => {
  it('should render a react component', () => {
    const wrapper = mount(
      <Translations messages={require('../dist-i18n/en_GB')}>
        <HelloWorld />
      </Translations>
    );

    expect(wrapper.text()).toEqual('Hello World :)');
  });
});
