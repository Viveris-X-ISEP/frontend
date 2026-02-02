import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../../store";
import { getPasswordStrength } from "../../../utility";
import { getUserIdFromToken } from "../../../utility/jwt.utils";
import { AuthService } from "../services";
import type { SignUpCredentials } from "../types";

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useAuthStore((state) => state.signIn);
  const router = useRouter();

  const getSignUpErrorMessage = (message?: string, status?: number) => {
    if (!message && status !== 409) {
      return "Échec de l'inscription";
    }

    const normalized = message?.toLowerCase() ?? "";
    const mentionsEmail = normalized.includes("email") || normalized.includes("e-mail");
    const mentionsUsername =
      normalized.includes("username") ||
      normalized.includes("nom d'utilisateur") ||
      normalized.includes("nom dutilisateur");
    const indicatesExists =
      normalized.includes("existe") ||
      normalized.includes("already") ||
      normalized.includes("exists") ||
      normalized.includes("utilise") ||
      normalized.includes("utilisé");

    if (mentionsEmail && indicatesExists) {
      return "Cet email est déjà utilisé";
    }

    if (mentionsUsername && indicatesExists) {
      return "Ce nom d'utilisateur est déjà utilisé";
    }

    if (status === 409) {
      return "Email ou nom d'utilisateur déjà utilisé";
    }

    return message ?? "Échec de l'inscription";
  };

  const handleSignUp = async (credentials: SignUpCredentials) => {
    // Client-side validation
    if (credentials.password !== credentials.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const { isStrong } = getPasswordStrength(credentials.password);

    if (!isStrong) {
      setError("Le mot de passe est trop faible");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await AuthService.signUp(credentials);
      const userId = getUserIdFromToken(response.token);
      if (!userId) {
        throw new Error("Unable to extract user id from token");
      }
      await signIn(response.token, response.refreshToken, userId);
      router.replace("/(tabs)/(home)");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
      };
      const apiMessage = error.response?.data?.message || error.response?.data?.error;
      setError(getSignUpErrorMessage(apiMessage, error.response?.status));
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
}
