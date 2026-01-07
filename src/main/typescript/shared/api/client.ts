import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../../store/auth-store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // Increased timeout to 20 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Endpoints that should NOT include Authorization header (public endpoints)
const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

// Request interceptor - inject Bearer token (except for public endpoints)
apiClient.interceptors.request.use(
  async (config) => {
    // Skip token injection for public auth endpoints
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));

    if (!isPublicEndpoint) {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip token refresh for public endpoints - they don't need auth
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );
    if (isPublicEndpoint) {
      return Promise.reject(error);
    }

    // If 401 or 403 and not already retrying, attempt token refresh
    // 403 can occur when token is invalid/expired on some backend configurations
    const isAuthError = error.response?.status === 401 || error.response?.status === 403;
    if (isAuthError && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        // Call refresh endpoint (without interceptors to avoid loop)
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        await SecureStore.setItemAsync("auth_token", token);
        await SecureStore.setItemAsync("refresh_token", newRefreshToken);

        processQueue(null, token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear tokens on refresh failure (user needs to re-login)
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user_id");

        // Sync Zustand auth state to trigger logout flow
        useAuthStore.setState({
          isLoggedIn: false,
          token: null,
          refreshToken: null,
          userId: null,
        });

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
