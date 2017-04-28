import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { AppComponent } from './app';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/de_DE"/>}/>
      <Route path="/:locale" component={AppComponent}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('app')
);
