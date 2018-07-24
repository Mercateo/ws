import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Loadable from 'react-loadable';

const Foo = Loadable({
  loader: () => import('./Foo'),
  loading: () => <p>Loading foo...</p>
});

const Bar = Loadable({
  loader: () => import('./Bar'),
  loading: () => <p>Loading bar...</p>
});

render(
  <BrowserRouter>
    <>
      <p>Click these links!</p>
      <Link to="/foo">Go to foo!</Link> | <Link to="/bar">Go to bar!</Link>
      <hr />
      <Route exact path="/foo" component={Foo} />
      <Route exact path="/bar" component={Bar} />
    </>
  </BrowserRouter>,
  document.getElementById('app')
);
