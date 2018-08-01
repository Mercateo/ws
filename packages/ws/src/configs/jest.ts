const { defaults } = require('jest-config');

export const getJestConfig = () => ({
  testMatch: ['**/*.+(ts|tsx|js|jsx)'],
  // roots: ['<rootDir>/../src', '<rootDir>/../tests'],
  testPathIgnorePatterns: [
    'jest.config.js',
    '.babelrc.js',
    '__mocks__/',
    '^.+\\.d\\.ts$'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    // '^.+\\.jsx?$': join(__dirname, 'jest-transformer-jsx'),
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  globals: {
    // it looks like `ts-jest` resolves `process.cwd()/tsconfig.json` instead
    // of `<rootDir>/tsconfig.json` so we need that
    'ts-jest': {
      tsConfigFile: './tsconfig.json'
    }
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js'
  },
  // see https://github.com/facebook/jest/issues/6766
  testURL: 'http://localhost/'
});
