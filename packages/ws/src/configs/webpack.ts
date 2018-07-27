import { project, WsConfig } from '../project';
import { getBrowserReleaseConfig } from '../lib/webpack/browser';
import { getNodeBuildConfig } from '../lib/webpack/node';
import { getSpaReleaseConfig, getSpaBuildConfig } from '../lib/webpack/spa';
// import watch from '../actions/watch';

import history from 'connect-history-api-fallback';
import convert from 'koa-connect';
import { WebpackConfig } from '../lib/webpack/options';

const options = {
  parent: {
    env: []
  }
};

export const getWebpackConfig = async (
  type: WsConfig['type'] = project.ws.type
): Promise<WebpackConfig> => {
  switch (type) {
    case 'browser':
      return getBrowserReleaseConfig(options);
    case 'node':
      return getNodeBuildConfig(options);
    case 'spa':
      if (process.env.WEBPACK_SERVE) {
        // return watch({ ...options, hot: true });
        const config = await getSpaBuildConfig(options);
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
