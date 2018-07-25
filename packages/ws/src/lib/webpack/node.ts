import {
  WebpackConfig,
  baseConfig,
  nodeConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getNodeBuildConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...nodeConfig,
  ...(await getEntryAndOutput('node', 'build')),
  ...getModuleAndPlugins('node', 'build', options)
});

export const getNodeUnitConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...nodeConfig,
  ...(await getEntryAndOutput('node', 'unit')),
  ...getModuleAndPlugins('node', 'unit', options)
});
