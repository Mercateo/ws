import { WebpackSingleConfig, outputDev, getModuleConfig, indexHtmlPlugin, extractCssPlugin, loaderOptionsPlugin, resolveLoader, resolve, devtool, outputRelease, extractCssHashPlugin, defineProductionPlugin, minifyJsPlugin, productionOptionsPlugin, devtoolProduction, outputTest, enzymeExternals, nodeSourceMapEntry, externalsNode } from './options';
import { project } from '../../project';
import { optimize } from 'webpack';

export const getSpaDevOptions = (): WebpackSingleConfig => ({
  entry: project.ws.srcEntry,
  output: {
    ...outputDev,
    publicPath: '/',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  module: getModuleConfig('build'),
  plugins: [
    indexHtmlPlugin,
    extractCssPlugin,
    loaderOptionsPlugin
  ],
  externals: [],
  performance: {
    hints: false
  },
  resolveLoader,
  resolve,
  devtool
});

export const getSpaReleaseOptions: () => WebpackSingleConfig = () => {
  const devOptions = getSpaDevOptions();

  return {
    ...devOptions,
    output: {
      ...outputRelease,
      libraryTarget: 'umd',
      filename: '[name].[chunkhash].js',
      chunkFilename: `[name].[chunkhash].lazy.js`
    },
    module: getModuleConfig('build -p'),
    plugins: [
      indexHtmlPlugin,
      new optimize.CommonsChunkPlugin({ names: ['manifest'] }),
      extractCssHashPlugin,
      loaderOptionsPlugin,
      defineProductionPlugin,
      minifyJsPlugin,
      productionOptionsPlugin
    ],
    devtool: devtoolProduction
  };
};

export const spaUnitOptions: WebpackSingleConfig = {
  entry: project.ws.unitEntry,
  output: outputTest,
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
};

export const spaE2eOptions: WebpackSingleConfig = {
  entry: [
    nodeSourceMapEntry,
    project.ws.e2eEntry
  ],
  output: {
    ...outputTest,
    libraryTarget: 'commonjs2'
  },
  module: getModuleConfig('e2e'),
  externals: externalsNode,
  performance: {
    hints: false
  },
  // in order to ignore built-in modules like path, fs, etc.
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  resolveLoader,
  resolve,
  devtool
};
