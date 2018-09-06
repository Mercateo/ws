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
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json'
    }
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.css$': '<rootDir>/__mocks__/styleMock.js'
  }
});
