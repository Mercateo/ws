import { Configuration } from 'webpack';
import {
  WebpackConfig,
  enzymeExternals,
  externalsSpa,
  baseConfig,
  releaseConfig,
  getEntryAndOutput,
  getModuleAndPlugins
} from './options';
import { EnvOptions } from '../../options';

export const getSpaBuildConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...getEntryAndOutput('spa', 'build'),
  ...getModuleAndPlugins('spa', 'build', options),
  externals: externalsSpa
});

export const getSpaReleaseConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...releaseConfig,
  ...getEntryAndOutput('spa', 'build -p'),
  ...getModuleAndPlugins('spa', 'build -p', options),
  mode: 'production'
});

export const getSpaUnitConfig = (options: EnvOptions): WebpackConfig => ({
  ...baseConfig,
  ...getEntryAndOutput('spa', 'unit'),
  ...getModuleAndPlugins('spa', 'unit', options),
  externals: enzymeExternals
});

export const getSpaE2eConfig = (options: EnvOptions): Configuration => ({
  // ...baseConfig,
  // ...getEntryAndOutput('browser', 'build'),
  // ...getModuleAndPlugins('browser', 'build', options)
  // externals: externalsSpa
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  devtool: 'inline-source-map'
});
