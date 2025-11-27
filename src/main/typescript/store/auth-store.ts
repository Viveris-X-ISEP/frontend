import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';

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
  },
};

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;

  // Actions
  signIn: (token: string, refreshToken: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateTokens: (token: string, refreshToken: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      refreshToken: null,

      signIn: async (token, refreshToken) => {
        // Store tokens in SecureStore (separate from Zustand persistence for security)
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
        set({ isLoggedIn: true, token, refreshToken });
      },

      signOut: async () => {
        // Clear tokens from SecureStore
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        set({ isLoggedIn: false, token: null, refreshToken: null });
      },

      updateTokens: async (token, refreshToken) => {
        // Update tokens in SecureStore
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('refresh_token', refreshToken);
        set({ token, refreshToken });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      // Only persist isLoggedIn state; tokens are in SecureStore
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn }),
    }
  )
);
