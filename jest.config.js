module.exports = {
  maxConcurrency: 10,
  preset: './apps/AEPSampleApp/node_modules/react-native/jest-preset.js',
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '\\.(ts|tsx)$': 'ts-jest'
  },
  setupFiles: ['./tests/jest/setup.ts'],
  testMatch: ['**/packages/**/__tests__/*.ts'],
  modulePaths: ['node_modules', './apps/AEPSampleApp/node_modules'],
  testPathIgnorePatterns: ['./packages/template'],
  moduleDirectories: ['node_modules', './apps/AEPSampleApp/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};