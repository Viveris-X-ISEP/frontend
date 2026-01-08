import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useSurveyStore } from "./survey-store";

// Custom SecureStore adapter for Zustand persist
const secureStorage = {
  getItem: async (name: string) => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  }
};

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
  userId: number | null;

  // Actions
  signIn: (token: string, refreshToken: string, userId: number) => Promise<void>;
  signOut: () => Promise<void>;
  updateTokens: (token: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      refreshToken: null,
      userId: null,

      signIn: async (token, refreshToken, userId) => {
        // Store tokens and userId in SecureStore (separate from Zustand persistence for security)
        await SecureStore.setItemAsync("auth_token", token);
        await SecureStore.setItemAsync("refresh_token", refreshToken);
        await SecureStore.setItemAsync("user_id", userId.toString());
        set({ isLoggedIn: true, token, refreshToken, userId });
      },

      signOut: async () => {
        // Clear tokens and userId from SecureStore
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("refresh_token");
        await SecureStore.deleteItemAsync("user_id");

        // Reset survey store to clear state for next user
        useSurveyStore.getState().reset();

        set({
          isLoggedIn: false,
          token: null,
          refreshToken: null,
          userId: null
        });
      },

      updateTokens: async (token, refreshToken) => {
        // Update tokens in SecureStore
        await SecureStore.setItemAsync("auth_token", token);
        await SecureStore.setItemAsync("refresh_token", refreshToken);
        set({ token, refreshToken });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      // Persist isLoggedIn and userId state; tokens are in SecureStore
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userId: state.userId
      })
    }
  )
);
