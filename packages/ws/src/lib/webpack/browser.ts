import {
  WebpackConfig,
  externalsBrowser,
  enzymeExternals,
  baseConfig,
  releaseConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getBrowserBuildConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...getEntryAndOutput('browser', 'build'),
  ...getModuleAndPlugins('browser', 'build', options),
  externals: externalsBrowser
});

export const getBrowserReleaseConfig = (
  options: EnvOptions
): WebpackConfig => ({
  ...baseConfig,
  ...releaseConfig,
  ...getEntryAndOutput('browser', 'build -p'),
  ...getModuleAndPlugins('browser', 'build -p', options),
  externals: externalsBrowser,
  mode: 'production'
});

export const getBrowserUnitConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...getEntryAndOutput('browser', 'unit'),
  ...getModuleAndPlugins('browser', 'unit', options),
  externals: enzymeExternals
});
