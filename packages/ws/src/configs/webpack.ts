import { Configuration } from 'webpack';
import history from 'connect-history-api-fallback';
import convert from 'koa-connect';

import { project } from '../project';
import { getBrowserReleaseConfig } from '../lib/webpack/browser';
import { getNodeBuildConfig } from '../lib/webpack/node';
import {
  getSpaReleaseConfig,
  getSpaBuildConfig,
  getSpaE2eConfig
} from '../lib/webpack/spa';

type Type = 'spa' | 'browser' | 'node' | 'cypress';

type Options = {
  type?: Type;
  env?: { [key: string]: string };
};

export const getWebpackConfig = (opts: Options = {}): Configuration => {
  if (typeof opts === 'string') {
    throw `Expected an options object, but got the string "${opts}"`;
  }

  const { type = project.ws.type, env = {} } = opts;

  // convert new env map to old env key-value-array
  const oldEnv = Object.entries(env).map(([key, value]) => ({
    key,
    value
  }));
  const options = {
    parent: {
      env: oldEnv
    }
  };

  switch (type) {
    case 'browser':
      return getBrowserReleaseConfig(options);
    case 'node':
      return getNodeBuildConfig(options);
    case 'cypress':
      return getSpaE2eConfig(options);
    case 'spa':
      if (process.env.WEBPACK_SERVE) {
        const config = getSpaBuildConfig(options);
        config.serve = {
          add(app, middleware, options) {
            app.use(convert(history()));
          }
        };
        return config;
      } else {
        return getSpaReleaseConfig(options);
      }
  }
};
