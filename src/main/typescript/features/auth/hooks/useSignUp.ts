import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store";
import { AuthService } from "../services";
import type { SignUpCredentials } from "../types";

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();

  const handleSignUp = async (credentials: SignUpCredentials) => {
    // Client-side validation
    if (credentials.password !== credentials.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (credentials.password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.signUp(credentials);
      // Backend doesn't return userId, so we need to fetch it from /users/me
      const userInfo = await AuthService.getUserInfo();
      await signIn(response.token, response.refreshToken, userInfo.id);
      router.replace("/(tabs)/(home)");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; error?: string } } };
      const message =
        error.response?.data?.message || error.response?.data?.error || "Échec de l'inscription";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
}
