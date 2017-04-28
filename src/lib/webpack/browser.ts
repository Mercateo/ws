import { project } from '../../project';
import { WebpackSingleConfig, outputDev, getModuleConfig, extractCssPlugin, loaderOptionsPlugin, externalsBrowser, resolveLoader, resolve, devtool, outputRelease, defineProductionPlugin, minifyJsPlugin, devtoolProduction, outputTest, enzymeExternals } from './options';

export const getBrowserDevOptions = (): WebpackSingleConfig => ({
  entry: project.ws.srcEntry,
  // would be an webpack agnostic module in the future https://github.com/webpack/webpack/issues/2933
  // this is not really useful until then
  output: {
    ...outputDev,
    publicPath: '/',
    libraryTarget: 'umd',
    library: project.name
  },
  module: getModuleConfig('build'),
  plugins: [
    extractCssPlugin,
    loaderOptionsPlugin
  ],
  externals: externalsBrowser,
  performance: {
    hints: false
  },
  resolveLoader,
  resolve,
  devtool
});

export const getBrowserReleaseOptions = (): WebpackSingleConfig => {
  const devOptions = getBrowserDevOptions();

  return {
    ...devOptions,
    // useful for people without a build pipeline
    output: {
      ...outputRelease,
      libraryTarget: 'umd',
      library: project.name
    },
    module: getModuleConfig('build -p'),
    plugins: [
      extractCssPlugin,
      loaderOptionsPlugin,
      defineProductionPlugin,
      minifyJsPlugin
    ],
    devtool: devtoolProduction
  };
};

export const getBrowserUnitOptions = (): WebpackSingleConfig => ({
  entry: project.ws.unitEntry,
  output: {
    ...outputTest,
    libraryTarget: 'umd',
    library: project.name
  },
  // module: moduleBrowser,
  module: getModuleConfig('unit'),
  plugins: [
    extractCssPlugin,
    loaderOptionsPlugin
  ],
  externals: enzymeExternals,
  performance: {
    hints: false
  },
  resolveLoader,
  resolve,
  devtool
});
