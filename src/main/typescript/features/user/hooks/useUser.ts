import { useEffect, useState } from "react";
import { useAuthStore } from "../../../store/auth-store";
import { UserService } from "../services/user.service";
import type { User } from "../types";

export const useUser = (id?: number) => {
  const userId = useAuthStore((state) => state.userId);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const targetUserId = id ?? userId ?? undefined;
        if (targetUserId) {
          const fetchedUser = await UserService.getUserById(targetUserId);
          setUser(fetchedUser);
        }
      } catch (err) {
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, userId]);

  return { user, loading, error };
};
