const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: "<rootDir>/apps/AEPSampleApp/node_modules/react-native",
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
    // Resolve react-native from AEPSampleApp's node_modules — react-native is not hoisted
    // to root (nmHoistingLimits: workspaces), so we point both preset and mapper here.
    "^react-native$": "<rootDir>/apps/AEPSampleApp/node_modules/react-native",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/lib/",
    "/android/",
    "/ios/",
    "/apps/",
    "/e2e/",
    "/packages/messaging/src/ui/"
  ],
};
