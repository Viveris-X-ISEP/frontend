import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
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

export default config;
