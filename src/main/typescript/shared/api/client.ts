import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../../store/auth-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"];

interface JwtPayload {
  exp: number;
}

// Decode JWT and extract payload
const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// Check if token is expired (with 10s buffer)
const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - 10000;
};

// Check if token is actually expired (no buffer)
const isTokenExpiredStrict = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

// Check if token is near expiry (default 90s buffer)
const isTokenNearExpiry = (token: string, thresholdMs = 90000): boolean => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000 - thresholdMs;
};

// Clear auth data and redirect to sign-in
const clearAuthAndRedirect = async (): Promise<void> => {
  await SecureStore.deleteItemAsync("auth_token");
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("user_id");

  useAuthStore.setState({
    isLoggedIn: false,
    token: null,
    refreshToken: null,
    userId: null
  });

  router.replace("/auth/sign-in");
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" }
});

// Token refresh state
let refreshPromise: Promise<string | null> | null = null;

// Refresh access token
const refreshAccessToken = async (): Promise<string | null> => {
  // Return existing refresh promise if already refreshing
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("auth_token");
      const refreshToken = await SecureStore.getItemAsync("refresh_token");
      if (!accessToken || isTokenExpiredStrict(accessToken)) {
        await clearAuthAndRedirect();
        return null;
      }
      if (!refreshToken) throw new Error("No refresh token");

      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const { token, refreshToken: newRefreshToken } = response.data;

      await SecureStore.setItemAsync("auth_token", token);
      await SecureStore.setItemAsync("refresh_token", newRefreshToken);

      useAuthStore.setState({
        token,
        refreshToken: newRefreshToken,
        isLoggedIn: true
      });

      return token;
    } catch (error) {
      await clearAuthAndRedirect();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export { clearAuthAndRedirect, isTokenExpired, isTokenNearExpiry, refreshAccessToken };

// Request interceptor: Check token expiration and refresh if needed
apiClient.interceptors.request.use(
  async (config) => {
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));
    if (isPublicEndpoint) return config;

    let token = await SecureStore.getItemAsync("auth_token");

    // Refresh token if expired
    if (token && isTokenExpired(token)) {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        const authError: Error & { code?: string; details?: unknown } = new Error(
          "Authentication failed: unable to refresh access token"
        );
        authError.code = "AUTH_REFRESH_FAILED";
        authError.details = { reason: "Token refresh returned null" };
        return Promise.reject(authError);
      }
      token = newToken;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unexpected auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error has no config, it was thrown from request interceptor - pass through
    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    // On 401/403 from non-public endpoints, attempt one retry with token refresh
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (isAuthError && !isPublicEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait if already refreshing: use the same promise-based mechanism as the request interceptor
      if (refreshPromise) {
        try {
          await refreshPromise;
        } catch {
          // Ignore refresh errors here; the subsequent token check will handle invalid state
        }
      }

      const token = await SecureStore.getItemAsync("auth_token");
      if (token && !isTokenExpired(token)) {
        // Update auth store to maintain consistency with SecureStore
        useAuthStore.setState({ token });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      }

      // Token still invalid, clear auth and redirect
      await clearAuthAndRedirect();
    }

    return Promise.reject(error);
  }
);
