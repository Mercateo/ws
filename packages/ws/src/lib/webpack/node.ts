import {
  WebpackConfig,
  baseConfig,
  nodeConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getNodeBuildConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...nodeConfig,
  ...getEntryAndOutput('node', 'build'),
  ...getModuleAndPlugins('node', 'build', options)
});

export const getNodeUnitConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...nodeConfig,
  ...getEntryAndOutput('node', 'unit'),
  ...getModuleAndPlugins('node', 'unit', options)
});
