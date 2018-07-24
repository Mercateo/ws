import {
  WebpackConfig,
  baseConfig,
  nodeConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { BaseOptions } from '../../options';

export const getNodeBuildConfig = async (
  options: BaseOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...nodeConfig,
  ...(await getEntryAndOutput('node', 'build')),
  ...getModuleAndPlugins('node', 'build', options)
});

export const getNodeUnitConfig = async (
  options: BaseOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...nodeConfig,
  ...(await getEntryAndOutput('node', 'unit')),
  ...getModuleAndPlugins('node', 'unit', options)
});
