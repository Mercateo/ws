import expect from 'expect';
import React from 'react';
import {
  NameComponent,
  ImageTestComponent
} from 'ws-examples-browser-ts-react';
import { SomeComponent } from 'ws-examples-browser-ts-react-i18n';
import { AppComponent } from '../src/app';
import { mount } from 'enzyme';

describe('test my code', () => {
  it('should show my app', () => {
    const app = mount(<AppComponent />);

    const nameComponent = app.childAt(0);
    expect(nameComponent.type()).toBe(NameComponent);
    expect(nameComponent.props()).toEqual({ a: 1, b: 2, name: '_otbe_' });

    const imageComponent = app.childAt(1);
    expect(imageComponent.type()).toBe(ImageTestComponent);
    expect(imageComponent.props()).toEqual({});

    const locale = app.childAt(3);
    expect(locale.type()).toBe('p');
    expect(locale.props().children).toEqual(['locale: ', 'de_DE']);

    const someComponent = app.childAt(7);
    expect(someComponent.type()).toBe(SomeComponent);
    expect(someComponent.props()).toEqual({});

    // .toEqual([
    //   <NameComponent a={1} b={2} name="_otbe_" />,
    //   <ImageTestComponent />,
    //   <p>Dev Build</p>,
    //   <p>locale: {'en_GB'}</p>,
    //   <p>intl locale: {'en-GB'}</p>,
    //   <p>language code: {'en'}</p>,
    //   <p>country code: {'GB'}</p>,
    //   <SomeComponent />,
    //   <OtherComponent />,
    //   <p>Hello user!</p>,
    //   <p>I'm an app.</p>,
    //   <p>colour</p>,
    //   <p>january</p>,
    //   <p>Loading app...</p>,
    //   <p>You have no photos.</p>,
    //   <p>You have one photo.</p>,
    //   <p>You have 2 photos.</p>,
    //   <p>She is great.</p>,
    //   <p>He is great.</p>,
    //   <p>D'oh!</p>,
    //   <p>Damn!</p>,
    //   <p>My name is John Snow.</p>
    // ]);
  });
});
