// https://on.cypress.io/plugins-guide
const wp = require('@cypress/webpack-preprocessor');
const { getWebpackConfig } = require('@mercateo/ws');

module.exports = (on, config) => {
  const options = {
    webpackOptions: getWebpackConfig({ type: 'cypress' })
  };
  on('file:preprocessor', wp(options));
};
