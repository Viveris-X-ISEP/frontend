import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "../../../../main/typescript/shared/api/client";
import { useAuthStore } from "../../../../main/typescript/store/auth-store";

// Mock auth store
jest.mock("../../../../main/typescript/store/auth-store", () => ({
  useAuthStore: {
    setState: jest.fn(),
    getState: jest.fn()
  }
}));

describe("API Client", () => {
  let mockApi: MockAdapter;
  let axiosMock: MockAdapter;

  // Helper to create JWT tokens for testing
  const createJwt = (expiresInSeconds: number): string => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      sub: "1",
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
      iat: Math.floor(Date.now() / 1000)
    };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    return `${encodedHeader}.${encodedPayload}.signature`;
  };

  const createInvalidJwt = (): string => {
    return "invalid.jwt";
  };

  beforeEach(() => {
    // Create mock adapters
    mockApi = new MockAdapter(apiClient);
    axiosMock = new MockAdapter(axios);

    // Reset all mocks
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    // Reset axios defaults to ensure clean state
    axiosMock.reset();
  });

  afterEach(() => {
    mockApi.reset();
    mockApi.restore();
    axiosMock.reset();
    axiosMock.restore();
  });

  // =========================================
  // Request Interceptor - Public Endpoints
  // =========================================
  describe("Request Interceptor - Public Endpoints", () => {
    it("should NOT attach Authorization header to /auth/login", async () => {
      mockApi.onPost("/auth/login").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { token: "test-token" }];
      });

      await apiClient.post("/auth/login", {
        email: "test@test.com",
        password: "pass"
      });
    });

    it("should NOT attach Authorization header to /auth/register", async () => {
      mockApi.onPost("/auth/register").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { token: "test-token" }];
      });

      await apiClient.post("/auth/register", {
        email: "test@test.com",
        password: "pass"
      });
    });

    it("should attach Authorization header to /auth/refresh when token exists", async () => {
      const validToken = createJwt(3600);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      mockApi.onPost("/auth/refresh").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${validToken}`);
        return [200, { token: "new-token" }];
      });

      await apiClient.post("/auth/refresh", { refreshToken: "refresh-token" });
    });
  });

  // =========================================
  // Request Interceptor - Protected Endpoints
  // =========================================
  describe("Request Interceptor - Protected Endpoints", () => {
    it("should attach valid non-expired token to Authorization header", async () => {
      const validToken = createJwt(3600); // Expires in 1 hour
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      mockApi.onGet("/users/me").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${validToken}`);
        return [200, { id: 1, email: "test@test.com" }];
      });

      await apiClient.get("/users/me");
    });

    it("should make request without token if no token is stored", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      mockApi.onGet("/users/me").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, {}];
      });

      await apiClient.get("/users/me");
    });

    it("should proactively refresh token within expiry buffer before request", async () => {
      const almostExpiredToken = createJwt(5); // Expires in 5 seconds (within 10s buffer)
      const newToken = createJwt(3600);
      const refreshToken = "valid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      // Mock the refresh endpoint with full URL
      axiosMock
        .onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh", {
          refreshToken
        })
        .reply((config) => {
          expect(config.headers?.Authorization).toBe(`Bearer ${almostExpiredToken}`);
          return [200, { token: newToken, refreshToken: "new-refresh-token" }];
        });

      mockApi.onGet("/users/me").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${newToken}`);
        return [200, { id: 1 }];
      });

      await apiClient.get("/users/me");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", newToken);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refresh_token", "new-refresh-token");
    });

    it("should reject request if token refresh fails", async () => {
      const expiredToken = createJwt(-60);
      const refreshToken = "invalid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(expiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      axiosMock
        .onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh")
        .reply(401, { message: "Invalid refresh token" });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow(
        "Authentication failed: unable to refresh access token"
      );

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user_id");
      expect(useAuthStore.setState).toHaveBeenCalledWith({
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        userId: null
      });
      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });

    it("should refresh token expiring within 10 second buffer", async () => {
      const almostExpiredToken = createJwt(9); // Expires in 9 seconds (within 10s buffer)
      const newToken = createJwt(3600);
      const refreshToken = "valid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      axiosMock
        .onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh")
        .reply((config) => {
          expect(config.headers?.Authorization).toBe(`Bearer ${almostExpiredToken}`);
          return [200, { token: newToken, refreshToken: "new-refresh-token" }];
        });

      mockApi.onGet("/users/me").reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${newToken}`);
        return [200, { id: 1 }];
      });

      await apiClient.get("/users/me");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", newToken);
    });

    it("should handle invalid JWT format by treating as expired", async () => {
      const invalidToken = createInvalidJwt();
      const refreshToken = "valid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(invalidToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow(
        "Authentication failed: unable to refresh access token"
      );

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user_id");
      expect(useAuthStore.setState).toHaveBeenCalledWith({
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        userId: null
      });
      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });
  });

  // =========================================
  // Response Interceptor
  // =========================================
  describe("Response Interceptor", () => {
    it("should retry request once on 401 error with valid token", async () => {
      const validToken = createJwt(3600);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      let requestCount = 0;
      mockApi.onGet("/users/me").reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [401, { message: "Unauthorized" }];
        }
        return [200, { id: 1 }];
      });

      const result = await apiClient.get("/users/me");

      expect(result.status).toBe(200);
      expect(requestCount).toBe(2);
    });

    it("should retry request once on 403 error with valid token", async () => {
      const validToken = createJwt(3600);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      let requestCount = 0;
      mockApi.onGet("/users/me").reply(() => {
        requestCount++;
        if (requestCount === 1) {
          return [403, { message: "Forbidden" }];
        }
        return [200, { id: 1 }];
      });

      const result = await apiClient.get("/users/me");

      expect(result.status).toBe(200);
      expect(requestCount).toBe(2);
    });

    it("should clear auth and redirect on 401 with expired token", async () => {
      const expiredToken = createJwt(-60);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(expiredToken);

      mockApi.onGet("/users/me").reply(401, { message: "Unauthorized" });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user_id");
      expect(useAuthStore.setState).toHaveBeenCalledWith({
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        userId: null
      });
      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });

    it("should NOT handle auth errors for public endpoints", async () => {
      mockApi.onPost("/auth/login").reply(401, { message: "Invalid credentials" });

      await expect(apiClient.post("/auth/login", {})).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });

    it("should NOT retry more than once to prevent loops", async () => {
      const validToken = createJwt(3600);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      let requestCount = 0;
      mockApi.onGet("/users/me").reply(() => {
        requestCount++;
        return [401, { message: "Unauthorized" }];
      });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      // First request + one retry = 2 total
      expect(requestCount).toBe(2);
    });

    it("should pass through non-auth errors without retry", async () => {
      const validToken = createJwt(3600);
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(validToken);

      mockApi.onGet("/users/me").reply(500, { message: "Server error" });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).not.toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  // =========================================
  // Token Refresh Logic
  // =========================================
  describe("Token Refresh Logic", () => {
    it("should successfully refresh token and store new tokens", async () => {
      const almostExpiredToken = createJwt(5);
      const refreshToken = "valid-refresh-token";
      const newToken = createJwt(3600);

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      axiosMock
        .onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh", {
          refreshToken
        })
        .reply((config) => {
          expect(config.headers?.Authorization).toBe(`Bearer ${almostExpiredToken}`);
          return [200, { token: newToken, refreshToken: "new-refresh-token" }];
        });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await apiClient.get("/users/me");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("auth_token", newToken);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refresh_token", "new-refresh-token");
    });

    it("should clear auth and redirect when refresh token is missing", async () => {
      const almostExpiredToken = createJwt(5);

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user_id");
      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });

    it("should clear auth and redirect when refresh API fails", async () => {
      const almostExpiredToken = createJwt(5);
      const refreshToken = "invalid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      axiosMock
        .onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh")
        .reply(401, { message: "Invalid refresh token" });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
      expect(useAuthStore.setState).toHaveBeenCalledWith({
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        userId: null
      });
      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });

    it("should handle network errors during token refresh", async () => {
      const almostExpiredToken = createJwt(5);
      const refreshToken = "valid-refresh-token";

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(almostExpiredToken);
        if (key === "refresh_token") return Promise.resolve(refreshToken);
        return Promise.resolve(null);
      });

      axiosMock.onPost("http://localhost:8080/ProjetIndustrielBack/auth/refresh").networkError();

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });
  });

  // =========================================
  // Auth Clearing and Redirect
  // =========================================
  describe("Auth Clearing and Redirect", () => {
    it("should delete all auth tokens from SecureStore on refresh failure", async () => {
      const expiredToken = createJwt(-60);

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(expiredToken);
        if (key === "refresh_token") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("auth_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("user_id");
    });

    it("should update Zustand auth state on auth failure", async () => {
      const expiredToken = createJwt(-60);

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(expiredToken);
        if (key === "refresh_token") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(useAuthStore.setState).toHaveBeenCalledWith({
        isLoggedIn: false,
        token: null,
        refreshToken: null,
        userId: null
      });
    });

    it("should redirect to sign-in screen on auth failure", async () => {
      const expiredToken = createJwt(-60);

      (SecureStore.getItemAsync as jest.Mock).mockImplementation((key: string) => {
        if (key === "auth_token") return Promise.resolve(expiredToken);
        if (key === "refresh_token") return Promise.resolve(null);
        return Promise.resolve(null);
      });

      mockApi.onGet("/users/me").reply(200, { id: 1 });

      await expect(apiClient.get("/users/me")).rejects.toThrow();

      expect(router.replace).toHaveBeenCalledWith("/auth/sign-in");
    });
  });
});
