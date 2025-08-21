module.exports = {
  maxConcurrency: 10,
  preset: './apps/AEPSampleAppNewArchEnabled/node_modules/react-native/jest-preset.js',
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': 'ts-jest'
  },
  setupFiles: ['./tests/jest/setup.ts'],
  testMatch: ['**/packages/**/__tests__/*.ts', '**/packages/**/__tests__/*.tsx'],
  modulePaths: ['node_modules', './apps/AEPSampleAppNewArchEnabled/node_modules'],
  testPathIgnorePatterns: ['./packages/template'],
  moduleDirectories: ['node_modules', './apps/AEPSampleAppNewArchEnabled/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};