module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
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

  config.module.rules.push({
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
          //   //   'babel-plugin-styled-components',
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
          configFile: require.resolve('./tsconfig.json'),
          transpileOnly: config.mode === 'development'
        }
      }
    ]
  });

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
