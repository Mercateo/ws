const config = require('@mercateo/ws').getJestConfig();

module.exports = {
  ...config,
  transform: {
    ...config.transform,
    '^.+\\.jsx?$': '<rootDir>/babel.transformer.js'
  }
};
