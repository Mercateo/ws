import React, { Component } from 'react';
import { render } from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { fromPromise, IPromiseBasedObservable } from 'mobx-utils';
import { Router, Route, hashHistory, Link } from 'react-router';

require('normalize.css/normalize.css');
require('./style.less');

export interface LazyComponentProps {
  fetcher: () => Promise<any>;
  [key: string]: any;
}

export interface ILazyComponent<P> {
  render(props: P): JSX.Element;
}

@observer
export class LazyComponent extends Component<LazyComponentProps, {}> {
  @observable
  private result: IPromiseBasedObservable<{
    default: ILazyComponent<any>;
  }> | null = null;

  componentDidMount() {
    this.result = fromPromise(this.props.fetcher());
  }

  render() {
    const { fetcher, ...rest } = this.props;
    if (this.result) {
      switch (this.result.state) {
        case 'rejected':
          return <div>Error</div>;
        case 'fulfilled':
          return this.result.value.default.render(rest);
      }
    }
    return <p>Loading component...</p>;
  }
}

const Prelude = () => (
  <div>
    <p>
      Click here and the component <code>AppComponent</code> should be lazily
      loaded.
    </p>
    <Link to="/app">Show app.</Link>
  </div>
);

render(
  <Router history={hashHistory}>
    <Route path="/" component={Prelude} />
    <Route
      path="/app"
      component={(props) => (
        <LazyComponent
          fetcher={() => _import<ILazyComponent<{}>>('./app')}
          {...props}
        />
      )}
    />
  </Router>,
  document.getElementById('app')
);
