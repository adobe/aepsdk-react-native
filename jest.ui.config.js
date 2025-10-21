module.exports = {
  preset: "react-native",
  testMatch: [
    "**/packages/messaging/src/ui/**/*.spec.tsx",
    "**/packages/messaging/src/ui/**/*.spec.ts",
    "**/packages/messaging/src/ui/**/*.test.tsx",
    "**/packages/messaging/src/ui/**/*.test.ts"
  ],
  collectCoverageFrom: [
    "packages/messaging/src/ui/**/*.{ts,tsx}",
    "!packages/messaging/src/ui/**/*.d.ts",
    "!packages/messaging/src/ui/**/index.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/lib/",
    "/android/",
    "/ios/"
  ],
};