import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store";
import { AuthService } from "../services";

export function useSignOut() {
  const signOut = useAuthStore((state) => state.signOut);
  const router = useRouter();

  const handleSignOut = async () => {
    await AuthService.signOut();
    await signOut();
    router.replace("/auth/sign-in");
  };

  return { handleSignOut };
}
