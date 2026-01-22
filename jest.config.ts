/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src/test/typescript"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/main/typescript/$1"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json"
      }
    ]
  },
  setupFilesAfterEnv: ["<rootDir>/src/test/typescript/setup.ts"],
  collectCoverageFrom: ["src/main/typescript/**/*.{ts,tsx}", "!src/main/typescript/**/*.d.ts"],
  coverageDirectory: "coverage"
};
