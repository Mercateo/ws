import { Configuration } from 'webpack';

// see https://storybook.js.org/configurations/custom-webpack-config/#full-control-mode--default
export const getStorybookWebpackConfig = (
  baseConfig: Configuration,
  configType: 'DEVELOPMENT' | 'PRODUCTION',
  defaultConfig: Configuration
): Configuration => {
  defaultConfig.module!.rules.push({
    test: /\.(ts|tsx)$/,
    include: [/stories/],
    use: [
      {
        loader: require.resolve('@storybook/addon-storysource/loader'),
        options: { parser: 'typescript' }
      }
    ],
    enforce: 'pre'
  });

  defaultConfig.module!.rules.push({
    test: /\.(ts|tsx)$/,
    include: [/src/, /stories/],
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['env']
          // env: {
          //   test: {
          //     plugins: ['require-context-hook'] // needed by storyshots i guess
          //   }
          // },
          // plugins: [
          //   // [
          //   //   '@babel/plugin-styled-components',
          //   //   {
          //   //     minify: false,
          //   //     transpileTemplateLiterals: false
          //   //   }
          //   // ]
          // ],
          // compact: true
        }
      },
      {
        loader: require.resolve('ts-loader'),
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
