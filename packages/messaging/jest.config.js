module.exports = {
  preset: "react-native",
  testMatch: ["<rootDir>/src/ui/**/*.spec.tsx"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/ui/components/**/*.{ts,tsx}",
    "<rootDir>/src/ui/utils/**/*.{ts,tsx}",
    "<rootDir>/src/ui/hooks/**/*.{ts,tsx}",
    "<rootDir>/src/ui/providers/**/*.{ts,tsx}",
    "!**/*.spec.tsx",
    "!**/__tests__/**",
  ],
  coverageReporters: ["text", "text-summary", "html", "lcov"],
  coverageDirectory: "<rootDir>/coverage",
};