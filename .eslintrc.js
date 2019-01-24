module.exports = {
  ...require('./packages/ws/eslintrc.config'),
  overrides: [
    {
      files: ['packages/{ws,example-node-ts-2}/{bin,src}/**/*.{js,ts}'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
