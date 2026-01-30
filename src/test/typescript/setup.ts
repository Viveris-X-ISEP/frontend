/**
 * Jest setup file
 * Runs before each test file
 */

// Mock expo-secure-store for Node.js test environment
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn()
}));

// Mock expo-router for Node.js test environment
jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn()
  },
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn()
  })),
  Link: "Link",
  Redirect: "Redirect"
}));

// Set default environment variables for tests
process.env.EXPO_PUBLIC_API_URL = "http://localhost:8080/ProjetIndustrielBack";

// Clear all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
