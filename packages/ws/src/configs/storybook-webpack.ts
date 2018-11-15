import { Configuration } from 'webpack';

// see https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode--default
export const getStorybookWebpackConfig = (
  baseConfig: Configuration,
  configType: 'DEVELOPMENT' | 'PRODUCTION',
  defaultConfig: Configuration
): Configuration => {
  const jsRule: any = defaultConfig.module!.rules.find(
    (rule) => rule.test!.toString() === '/\\.(mjs|jsx?)$/'
  );
  const babelLoaderWithConfig = jsRule.use[0];

  defaultConfig.module!.rules.push({
    test: /\.tsx?$/,
    include: [/src/, /stories/],
    use: [
      babelLoaderWithConfig,
      {
        loader: 'ts-loader',
        options: {
          configFile: '.storybook/tsconfig.json',
          transpileOnly: defaultConfig.mode === 'development'
        }
      }
    ]
  });

  defaultConfig.resolve!.extensions!.push('.ts', '.tsx');

  return defaultConfig;
};
