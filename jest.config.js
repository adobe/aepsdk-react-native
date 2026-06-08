const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: "@react-native/jest-preset",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  setupFiles: ["<rootDir>/tests/jest/setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    // Resolve react-native from the E2E test app's local node_modules so root
    // devDependencies never need to include react-native (avoids hoisting conflicts
    // between apps that use different RN versions).
    "^react-native$": "<rootDir>/apps/AwesomeProject/node_modules/react-native",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/lib/",
    "/android/",
    "/ios/",
    "/apps/",
    "/packages/messaging/src/ui/"
  ],
};
