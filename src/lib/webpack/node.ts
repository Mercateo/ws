import { WebpackSingleConfig, nodeSourceMapEntry, outputDev, getModuleConfig, externalsNode, resolveLoader, resolve, devtool, outputTest } from './options';
import { project } from '../../project';

export const nodeBuildOptions: WebpackSingleConfig = {
  entry: [
    nodeSourceMapEntry,
    project.ws.srcEntry
  ],
  output: {
    ...outputDev,
    libraryTarget: 'commonjs2'
  },
  module: getModuleConfig('build'),
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

export const nodeUnitOptions: WebpackSingleConfig = {
  entry: [
    nodeSourceMapEntry,
    project.ws.unitEntry
  ],
  output: {
    ...outputTest,
    libraryTarget: 'commonjs2'
  },
  module: getModuleConfig('unit'),
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
