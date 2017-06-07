import {
  WebpackSingleConfig,
  outputDev,
  getModuleConfig,
  indexHtmlPlugin,
  extractCssPlugin,
  loaderOptionsPlugin,
  resolveLoader,
  devtool,
  resolve,
  defineProductionPlugin,
  outputTest,
  enzymeExternals
} from './options';
import { project } from '../../project';

export const getElectronDevOptions = (): WebpackSingleConfig => ({
  entry: project.ws.srcEntry,
  output: {
    ...outputDev,
    filename: '[name].js'
  },
  module: getModuleConfig('build'),
  plugins: [indexHtmlPlugin, extractCssPlugin, loaderOptionsPlugin],
  target: 'electron',
  externals: project.ws.externals ? [project.ws.externals] : [],
  performance: {
    hints: false
  },
  resolveLoader,
  resolve,
  devtool
});

export const getElectronReleaseOptions = () => {
  const options = getElectronDevOptions();

  return {
    ...options,
    plugins: [...options.plugins!, defineProductionPlugin]
  };
};

export const electronUnitOptions: WebpackSingleConfig = {
  entry: project.ws.unitEntry,
  output: outputTest,
  module: getModuleConfig('unit'),
  plugins: [extractCssPlugin, loaderOptionsPlugin],
  target: 'electron',
  externals: enzymeExternals.concat(
    project.ws.externals ? [project.ws.externals] : []
  ),
  performance: {
    hints: false
  },
  resolveLoader,
  resolve,
  devtool
};
