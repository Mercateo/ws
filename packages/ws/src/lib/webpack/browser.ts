import {
  WebpackConfig,
  externalsBrowser,
  enzymeExternals,
  baseConfig,
  releaseConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { BaseOptions } from '../../options';

export const getBrowserBuildConfig = async (
  options: BaseOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...(await getEntryAndOutput('browser', 'build')),
  ...getModuleAndPlugins('browser', 'build', options),
  externals: externalsBrowser
});

export const getBrowserReleaseConfig = async (
  options: BaseOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...releaseConfig,
  ...(await getEntryAndOutput('browser', 'build -p')),
  ...getModuleAndPlugins('browser', 'build -p', options),
  externals: externalsBrowser,
  mode: 'production'
});

export const getBrowserUnitConfig = async (
  options: BaseOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...(await getEntryAndOutput('browser', 'unit')),
  ...getModuleAndPlugins('browser', 'unit', options),
  externals: enzymeExternals
});
