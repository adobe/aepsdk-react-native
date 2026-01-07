module.exports = {
  maxConcurrency: 10,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation)/)',
  ],
  setupFiles: ['./tests/jest/setup.ts'],
  testMatch: ['**/packages/**/__tests__/*.ts'],
  modulePaths: ['node_modules', './apps/AEPSampleAppNewArchEnabled/node_modules'],
  testPathIgnorePatterns: ['./packages/template'],
  moduleDirectories: ['node_modules', './apps/AEPSampleAppNewArchEnabled/node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/apps/AEPSampleAppNewArchEnabled/node_modules/react-native'
  },
};