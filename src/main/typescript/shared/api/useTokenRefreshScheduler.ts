import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuthStore } from "../../store/auth-store";
import { clearAuthAndRedirect, isTokenNearExpiry, refreshAccessToken } from "./client";

const REFRESH_CHECK_INTERVAL_MS = 30000;
const REFRESH_NEAR_EXPIRY_MS = 90000;

export const useTokenRefreshScheduler = (): void => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoggedInRef = useRef(isLoggedIn);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(async () => {
    if (!isLoggedInRef.current) return;

    const accessToken = await SecureStore.getItemAsync("auth_token");
    const refreshToken = await SecureStore.getItemAsync("refresh_token");

    if (!accessToken || !refreshToken) {
      await clearAuthAndRedirect();
      return;
    }

    if (!isTokenNearExpiry(accessToken, REFRESH_NEAR_EXPIRY_MS)) {
      return;
    }

    await refreshAccessToken();
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current || !isLoggedInRef.current) return;
    intervalRef.current = setInterval(() => {
      void tick();
    }, REFRESH_CHECK_INTERVAL_MS);
    void tick();
  }, [tick]);

  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
    if (!isLoggedIn) {
      clearTimer();
      return;
    }

    if (AppState.currentState === "active") {
      startTimer();
    }
  }, [clearTimer, isLoggedIn, startTimer]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        startTimer();
      } else {
        clearTimer();
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    if (AppState.currentState === "active") {
      startTimer();
    }

    return () => {
      subscription.remove();
      clearTimer();
    };
  }, [clearTimer, startTimer]);
};
