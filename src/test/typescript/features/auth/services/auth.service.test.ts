import MockAdapter from "axios-mock-adapter";
import { AuthService } from "../../../../../main/typescript/features/auth/services/auth.service";
import { apiClient } from "../../../../../main/typescript/shared/api/client";
import type {
  SignInCredentials,
  SignUpCredentials,
  AuthResponse,
} from "../../../../../main/typescript/features/auth/types";

describe("AuthService", () => {
  let mockApi: MockAdapter;

  beforeEach(() => {
    // Create a new mock adapter for the apiClient
    mockApi = new MockAdapter(apiClient);
  });

  afterEach(() => {
    // Reset the mock after each test
    mockApi.reset();
    mockApi.restore();
  });

  // =========================================
  // signIn tests
  // =========================================
  describe("signIn", () => {
    const validCredentials: SignInCredentials = {
      email: "test@example.com",
      password: "TestPassword123!",
    };

    const mockAuthResponse: AuthResponse = {
      token: "mock-jwt-token",
      refreshToken: "mock-refresh-token",
    };

    it("should successfully sign in with valid credentials", async () => {
      mockApi.onPost("/auth/login", validCredentials).reply(200, mockAuthResponse);

      const result = await AuthService.signIn(validCredentials);

      expect(result).toEqual(mockAuthResponse);
      expect(result.token).toBe("mock-jwt-token");
      expect(result.refreshToken).toBe("mock-refresh-token");
    });

    it("should throw an error when credentials are invalid", async () => {
      const invalidCredentials: SignInCredentials = {
        email: "wrong@example.com",
        password: "wrongpassword",
      };

      mockApi.onPost("/auth/login", invalidCredentials).reply(401, {
        message: "Invalid credentials",
      });

      await expect(AuthService.signIn(invalidCredentials)).rejects.toThrow();
    });

    it("should throw an error on network failure", async () => {
      mockApi.onPost("/auth/login").networkError();

      await expect(AuthService.signIn(validCredentials)).rejects.toThrow();
    });

    it("should throw an error on server error (500)", async () => {
      mockApi.onPost("/auth/login").reply(500, {
        message: "Internal server error",
      });

      await expect(AuthService.signIn(validCredentials)).rejects.toThrow();
    });

    it("should handle timeout", async () => {
      mockApi.onPost("/auth/login").timeout();

      await expect(AuthService.signIn(validCredentials)).rejects.toThrow();
    });
  });

  // =========================================
  // signUp tests
  // =========================================
  describe("signUp", () => {
    const validSignUpCredentials: SignUpCredentials = {
      email: "newuser@example.com",
      username: "newuser",
      password: "SecurePassword123!",
      confirmPassword: "SecurePassword123!",
    };

    const expectedPayload = {
      email: "newuser@example.com",
      username: "newuser",
      password: "SecurePassword123!",
    };

    const mockAuthResponse: AuthResponse = {
      token: "mock-jwt-token-for-new-user",
      refreshToken: "mock-refresh-token-for-new-user",
    };

    it("should successfully register a new user", async () => {
      mockApi.onPost("/auth/register", expectedPayload).reply(200, mockAuthResponse);

      const result = await AuthService.signUp(validSignUpCredentials);

      expect(result).toEqual(mockAuthResponse);
      expect(result.token).toBe("mock-jwt-token-for-new-user");
      expect(result.refreshToken).toBe("mock-refresh-token-for-new-user");
    });

    it("should not send confirmPassword to the backend", async () => {
      mockApi.onPost("/auth/register").reply((config) => {
        const payload = JSON.parse(config.data);
        // Verify confirmPassword is NOT in the payload
        expect(payload).not.toHaveProperty("confirmPassword");
        expect(payload).toEqual(expectedPayload);
        return [200, mockAuthResponse];
      });

      await AuthService.signUp(validSignUpCredentials);
    });

    it("should throw an error when email already exists", async () => {
      mockApi.onPost("/auth/register").reply(400, {
        message: "Email already registered",
      });

      await expect(AuthService.signUp(validSignUpCredentials)).rejects.toThrow();
    });

    it("should throw an error when username already exists", async () => {
      mockApi.onPost("/auth/register").reply(400, {
        message: "Username already taken",
      });

      await expect(AuthService.signUp(validSignUpCredentials)).rejects.toThrow();
    });

    it("should throw an error on server error", async () => {
      mockApi.onPost("/auth/register").reply(500, {
        message: "Internal server error",
      });

      await expect(AuthService.signUp(validSignUpCredentials)).rejects.toThrow();
    });

    it("should handle network failure", async () => {
      mockApi.onPost("/auth/register").networkError();

      await expect(AuthService.signUp(validSignUpCredentials)).rejects.toThrow();
    });
  });

  // =========================================
  // refreshToken tests
  // =========================================
  describe("refreshToken", () => {
    const validRefreshToken = "valid-refresh-token";

    const mockAuthResponse: AuthResponse = {
      token: "new-jwt-token",
      refreshToken: "new-refresh-token",
    };

    it("should successfully refresh tokens", async () => {
      mockApi
        .onPost("/auth/refresh", { refreshToken: validRefreshToken })
        .reply(200, mockAuthResponse);

      const result = await AuthService.refreshToken(validRefreshToken);

      expect(result).toEqual(mockAuthResponse);
      expect(result.token).toBe("new-jwt-token");
      expect(result.refreshToken).toBe("new-refresh-token");
    });

    it("should throw an error when refresh token is invalid", async () => {
      const invalidRefreshToken = "invalid-refresh-token";

      mockApi.onPost("/auth/refresh", { refreshToken: invalidRefreshToken }).reply(401, {
        message: "Invalid refresh token",
      });

      await expect(AuthService.refreshToken(invalidRefreshToken)).rejects.toThrow();
    });

    it("should throw an error when refresh token is expired", async () => {
      const expiredRefreshToken = "expired-refresh-token";

      mockApi.onPost("/auth/refresh", { refreshToken: expiredRefreshToken }).reply(401, {
        message: "Refresh token expired",
      });

      await expect(AuthService.refreshToken(expiredRefreshToken)).rejects.toThrow();
    });

    it("should handle server errors", async () => {
      mockApi.onPost("/auth/refresh").reply(500, {
        message: "Internal server error",
      });

      await expect(AuthService.refreshToken(validRefreshToken)).rejects.toThrow();
    });
  });

  // =========================================
  // signOut tests
  // =========================================
  describe("signOut", () => {
    it("should resolve without making API call (client-side only)", async () => {
      // signOut is handled client-side, no API call should be made
      await expect(AuthService.signOut()).resolves.toBeUndefined();
    });

    it("should complete successfully", async () => {
      const result = await AuthService.signOut();
      expect(result).toBeUndefined();
    });
  });
});
