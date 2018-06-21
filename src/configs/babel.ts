import { project, WsConfig } from '../project';
import { babelBrowser, babelNode } from '../lib/webpack/options';

export const getBabelConfig = (type: WsConfig['type'] = project.ws.type) =>
  type === 'node' ? babelNode : babelBrowser;
