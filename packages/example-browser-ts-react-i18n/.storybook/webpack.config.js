module.exports = ({ config, mode }) => {
  const babelLoader = config.module.rules[0].use[0];
  const envPreset = babelLoader.options.presets[0];
  envPreset[1].corejs = 2; // get rid of babel warning

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          configFile: '../stories/tsconfig.json',
          transpileOnly: mode === 'DEVELOPMENT'
        }
      }
    ]
  });
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
