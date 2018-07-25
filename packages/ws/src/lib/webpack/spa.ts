import {
  WebpackConfig,
  enzymeExternals,
  externalsSpa,
  baseConfig,
  nodeConfig,
  releaseConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getSpaBuildConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...(await getEntryAndOutput('spa', 'build')),
  ...getModuleAndPlugins('spa', 'build', options),
  externals: externalsSpa
});

export const getSpaReleaseConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...releaseConfig,
  ...(await getEntryAndOutput('spa', 'build -p')),
  ...getModuleAndPlugins('spa', 'build -p', options),
  mode: 'production'
});

export const getSpaUnitConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...(await getEntryAndOutput('spa', 'unit')),
  ...getModuleAndPlugins('spa', 'unit', options),
  externals: enzymeExternals
});

export const getSpaE2eConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...nodeConfig,
  ...(await getEntryAndOutput('node', 'e2e')),
  ...getModuleAndPlugins('node', 'e2e', options)
});
