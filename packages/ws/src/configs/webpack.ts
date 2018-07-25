import { project, WsConfig } from '../project';
import { getBrowserReleaseConfig } from '../lib/webpack/browser';
import { getNodeBuildConfig } from '../lib/webpack/node';
import { getSpaReleaseConfig } from '../lib/webpack/spa';

const options = {
  parent: {
    env: []
  }
};

export const getWebpackConfig = (type: WsConfig['type'] = project.ws.type) => {
  switch (type) {
    case 'browser':
      return getBrowserReleaseConfig(options);
    case 'node':
      return getNodeBuildConfig(options);
    case 'spa':
      return getSpaReleaseConfig(options);
  }
};
