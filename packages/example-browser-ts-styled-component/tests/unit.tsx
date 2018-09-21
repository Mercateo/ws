import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { FancyStyle } from '../src/index';

configure({ adapter: new Adapter() });

describe('Styled component', () => {
  it('renders child text', () => {
    const wrapper = mount(<FancyStyle>My Cool Title</FancyStyle>);
    expect(wrapper.get(0).props.children).toBe('My Cool Title');
  });
});
