import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { NameComponent, ImageTestComponent } from 'example-browser-ts-react';
import { SomeComponent } from 'example-browser-ts-react-i18n';

import { AppComponent } from '../src/app';

configure({ adapter: new Adapter() });

describe('test my code', () => {
  it('should show my app', () => {
    const wrapper = mount(<AppComponent />);

    const nameComponent = wrapper.find(NameComponent);
    expect(nameComponent.props()).toEqual({ a: 1, b: 2, name: '_otbe_' });

    const imageComponent = wrapper.find(ImageTestComponent);
    expect(imageComponent.props()).toEqual({});

    const locale = wrapper.find('p').at(2);
    expect(locale.props().children).toEqual(['locale: ', 'de_DE']);

    const someComponent = wrapper.find(SomeComponent);
    expect(someComponent.props()).toEqual({});
  });
});
