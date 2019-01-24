// note: don't name this file .eslintrc.js
// see https://github.com/eslint/eslint/issues/10136#issuecomment-457085660
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true
    }
  },
  plugins: [
    // https://github.com/benmosher/eslint-plugin-import
    'import',
    // https://github.com/jest-community/eslint-plugin-jest
    'jest'
  ],
  rules: {
    'import/no-extraneous-dependencies': 'error',
    'jest/no-focused-tests': 'error',
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-var': 'error',
    'no-unused-expressions': 'error',
    'object-shorthand': 'error',
    'spaced-comment': 'error'
  }
};
