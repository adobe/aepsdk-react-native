module.exports = {
  preset: "react-native",
  testMatch: ["<rootDir>/src/ui/**/*.spec.tsx"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/ui/components/**/*.{ts,tsx}", // only components
    "!**/*.spec.tsx",
    "!**/__tests__/**",
  ],
  coverageReporters: ["text", "text-summary", "html", "lcov"],
  coverageDirectory: "<rootDir>/coverage",
};