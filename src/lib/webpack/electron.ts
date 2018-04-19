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
import { BaseOptions } from '../../options';

export const getElectronBuildConfig = async (
  options: BaseOptions
): Promise<WebpackConfig[]> => {
  const mainConfig: WebpackConfig = await {
    ...baseConfig,
    ...electronMainConfig,
    ...await getEntryAndOutput('electron-main', 'build'),
    ...getModuleAndPlugins('electron-main', 'build', options),
    externals: externalsSpa // is this needed here?
  };

  const rendererConfig: WebpackConfig = await {
    ...baseConfig,
    ...electronRendererConfig,
    ...await getEntryAndOutput('electron-renderer', 'build'),
    ...getModuleAndPlugins('electron-renderer', 'build', options),
    externals: externalsSpa // is this needed here?
  };

  return Promise.resolve([mainConfig, rendererConfig]);
};

export const getElectronReleaseConfig = async (
  options: BaseOptions
): Promise<WebpackConfig[]> => {
  const mainConfig: WebpackConfig = await {
    ...baseConfig,
    ...electronMainConfig,
    ...await getEntryAndOutput('electron-main', 'build -p'),
    ...getModuleAndPlugins('electron-main', 'build -p', options),
    externals: externalsSpa // is this needed here?
  };

  const rendererConfig: WebpackConfig = await {
    ...baseConfig,
    ...electronRendererConfig,
    ...await getEntryAndOutput('electron-renderer', 'build -p'),
    ...getModuleAndPlugins('electron-renderer', 'build -p', options),
    externals: externalsSpa // is this needed here?
  };

  return Promise.resolve([mainConfig, rendererConfig]);
};

export const getElectronUnitConfig = async (options: BaseOptions): Promise<WebpackConfig> => ({
  ...baseConfig,
  ...electronRendererConfig,
  ...await getEntryAndOutput('electron-renderer', 'unit'),
  ...getModuleAndPlugins('electron-renderer', 'unit', options),
  externals: enzymeExternals
});
