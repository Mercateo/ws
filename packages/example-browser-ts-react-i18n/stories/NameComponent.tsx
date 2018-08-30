import React from 'react';
import { storiesOf } from '@storybook/react';
import { select } from '@storybook/addon-knobs';
import { Translations } from '@mercateo/ws-intl';
import { NameComponent } from '../src';

const stories = storiesOf('NameComponent', module);

const first = ['Jane', 'John', 'Henry'];
const last = ['Doe', 'Smith'];

stories.add('Simple Usage', () => (
  <Translations messages={require('../dist-i18n/en_US.js')}>
    <NameComponent
      first={select('first', first, first[0])}
      last={select('last', last, last[0])}
    />
  </Translations>
));
