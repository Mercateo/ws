import React from 'react';
import expect from 'expect';
import { HelloWorld } from '../src/HelloWorld';
import { Translations } from '@mercateo/ws-intl';
import { mount } from 'enzyme';

describe('test my electron i18n app', () => {
  it('should render a react component', () => {
    const provider = mount(
      <Translations messages={require('../dist-i18n/en_GB')}>
        <HelloWorld />
      </Translations>
    );
    const consumer = provider.childAt(0);
    const comp = consumer.childAt(0);

    expect(comp.type()).toBe('p');
    expect(comp.props().children).toEqual('Hello World :)');
  });
});
