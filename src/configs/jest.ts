import { join } from 'path';

export const getJestConfig = () => ({
  testMatch: ['**/*.+(ts|tsx|js|jsx)'],
  // roots: ['<rootDir>/../src', '<rootDir>/../tests'],
  testPathIgnorePatterns: [
    '<rootDir>/jest.config.js',
    '<rootDir>/.babelrc.js',
    '<rootDir>/__mocks__/'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    // '^.+\\.jsx?$': join(__dirname, 'jest-transformer-jsx'),
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  //   globals: {
  //     'ts-jest': {
  //       tsConfigFile: './tsconfig.json'
  //     }
  //   },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js'
  }
});
