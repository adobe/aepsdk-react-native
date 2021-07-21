module.exports = {
    maxConcurrency: 10,
    preset: './tests/AEPSampleApp/node_modules/react-native/jest-preset.js',
    transform: {
      "^.+\\.js$": "./tests/AEPSampleApp/node_modules/react-native/jest/preprocessor.js"
    },
    setupFiles: ['./tests/jest/setup.js'],
    testMatch: ['**/packages/**/__tests__/*.js'],
    modulePaths: ['node_modules', './tests/AEPSampleApp/node_modules'],
    testPathIgnorePatterns: ['./packages/template'],
    moduleDirectories: ['node_modules', './tests/AEPSampleApp/node_modules'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
};