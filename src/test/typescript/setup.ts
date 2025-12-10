/**
 * Jest setup file
 * Runs before each test file
 */

// Mock expo-secure-store for Node.js test environment
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Set default environment variables for tests
process.env.EXPO_PUBLIC_API_URL = "http://localhost:8080/ProjetIndustrielBack";

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
