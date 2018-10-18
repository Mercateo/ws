import { join } from 'path';
import { Configuration } from 'webpack';
import history from 'connect-history-api-fallback';

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
      if (process.env.WEBPACK_DEV_SERVER) {
        const config = getSpaBuildConfig(options);
        const publicPath = project.ws.publicPath ? project.ws.publicPath : '/';
        config.devServer = {
          stats: 'errors-only',
          publicPath,
          hot: true,
          before(app) {
            app.use((req, res, next) => {
              if (req.path === '/') {
                res.redirect(publicPath);
              } else {
                next();
              }
            });
            app.use(
              history({
                index: join(publicPath, '/index.html')
              })
            );
          }
        };
        return config;
      } else {
        return getSpaReleaseConfig(options);
      }
  }
};
