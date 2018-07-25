import {
  WebpackConfig,
  enzymeExternals,
  baseConfig,
  electronMainConfig,
  electronRendererConfig,
  externalsSpa,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getElectronBuildConfig = async (
  options: EnvOptions
): Promise<WebpackConfig[]> => {
  const mainConfig: WebpackConfig = {
    ...baseConfig,
    ...electronMainConfig,
    ...(await getEntryAndOutput('electron-main', 'build')),
    ...getModuleAndPlugins('electron-main', 'build', options),
    externals: externalsSpa // is this needed here?
  };

  const rendererConfig: WebpackConfig = {
    ...baseConfig,
    ...electronRendererConfig,
    ...(await getEntryAndOutput('electron-renderer', 'build')),
    ...getModuleAndPlugins('electron-renderer', 'build', options),
    externals: externalsSpa // is this needed here?
  };

  return Promise.resolve([mainConfig, rendererConfig]);
};

export const getElectronReleaseConfig = async (
  options: EnvOptions
): Promise<WebpackConfig[]> => {
  const mainConfig: WebpackConfig = {
    ...baseConfig,
    ...electronMainConfig,
    ...(await getEntryAndOutput('electron-main', 'build -p')),
    ...getModuleAndPlugins('electron-main', 'build -p', options),
    externals: externalsSpa, // is this needed here?
    mode: 'production'
  };

  const rendererConfig: WebpackConfig = {
    ...baseConfig,
    ...electronRendererConfig,
    ...(await getEntryAndOutput('electron-renderer', 'build -p')),
    ...getModuleAndPlugins('electron-renderer', 'build -p', options),
    externals: externalsSpa, // is this needed here?
    mode: 'production'
  };

  return Promise.resolve([mainConfig, rendererConfig]);
};

export const getElectronUnitConfig = async (
  options: EnvOptions
): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...electronRendererConfig,
  ...(await getEntryAndOutput('electron-renderer', 'unit')),
  ...getModuleAndPlugins('electron-renderer', 'unit', options),
  externals: enzymeExternals
});
