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

const options = {
  parent: {
    env: []
  }
};

type Type = 'spa' | 'browser' | 'node' | 'cypress';

export const getWebpackConfig = (
  type: Type = project.ws.type
): Configuration => {
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
