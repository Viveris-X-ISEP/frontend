import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store";
import { AuthService } from "../services";
import type { SignInCredentials } from "../types";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();

  const handleSignIn = async (credentials: SignInCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.signIn(credentials);
      await signIn(response.token, response.refreshToken, response.userId);
      router.replace("/(tabs)/(home)");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; error?: string } } };
      const message =
        error.response?.data?.message || error.response?.data?.error || "Identifiants invalides";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
}
