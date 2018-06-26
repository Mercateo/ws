module.exports = function modifyWebpackConfig(command, options) {
  // NEVER treat `options` as stable in its structure
  // this feature is highly experimental
  if (command === 'unit') {
    // this example shows you how you can add a new loader to a given rule
    const rule = options.module.rules.find(rule =>
      rule.test.toString().includes('.ts(x?)')
    );
    if (rule) {
      rule.use.unshift({
        loader: 'string-replace-loader',
        options: {
          search: '@BOO',
          replace: '@otbe'
        }
      });
    }

    // this example shows you how you can modify the babel config
    const plugin = options.plugins.find(
      plugin => plugin.name === 'HappyPack' && plugin.id === 'ts-browser-unit'
    );
    if (plugin) {
      const babel = plugin.config.loaders.find(
        loader => loader.loader === 'babel-loader'
      );
      if (babel) {
        babel.options.plugins.push('markdown');
      }
    }
  }
  return options;
};
