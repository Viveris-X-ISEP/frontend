import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../../store";
import { getUserIdFromToken } from "../../../utility/jwt.utils";
import { AuthService } from "../services";
import type { SignInCredentials } from "../types";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();

  const handleSignIn = async (credentials: SignInCredentials) => {
    if (!credentials.email.trim()) {
      setError("Email requis");
      return;
    }

    if (!credentials.password.trim()) {
      setError("Mot de passe requis");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.signIn(credentials);
      const userId = getUserIdFromToken(response.token);
      if (!userId) {
        throw new Error("Unable to extract user id from token");
      }
      await signIn(response.token, response.refreshToken, userId);
      router.replace("/(tabs)/(home)");
    } catch (err: unknown) {
      setError("Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
}
