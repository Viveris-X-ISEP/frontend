// TODO: Fix signUp api call

import { apiClient } from "../../../shared/api";
import type {
  AuthResponse,
  RefreshTokenPayload,
  SignInCredentials,
  SignUpCredentials,
  SignUpPayload,
} from "../types";

export const AuthService = {
  /**
   * POST /auth/login
   * Authenticate user with email and password
   */
  signIn: async (credentials: SignInCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  /**
   * POST /auth/register
   * Register a new user account
   */
  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    // Remove confirmPassword (not sent to backend)
    const payload: SignUpPayload = {
      email: credentials.email,
      username: credentials.username,
      password: credentials.password,
    };
    const response = await apiClient.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const payload: RefreshTokenPayload = { refreshToken };
    const response = await apiClient.post<AuthResponse>("/auth/refresh", payload);
    return response.data;
  },

  /**
   * GET /users/me
   * Get current authenticated user information
   */
  getUserInfo: async (): Promise<import("../types").UserDto> => {
    const response = await apiClient.get<import("../types").UserDto>("/users/me");
    return response.data;
  },

  /**
   * Client-side logout (no backend endpoint)
   * Tokens are cleared locally
   */
  signOut: async (): Promise<void> => {
    // No backend logout endpoint - handled client-side
  },
};
