const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: "react-native",
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
    "^react-native$": "<rootDir>/node_modules/react-native",
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
