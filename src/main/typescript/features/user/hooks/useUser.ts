import { useState, useEffect } from "react";
import { UserService } from "../services/user.service";
import { User } from "../types";

export const useUser = (id?: number, token?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        if (id) {
          const fetchedUser = await UserService.getUserById(id);
          setUser(fetchedUser);
        } else if (token) {
          const currentUser = await UserService.getCurrentUser(token);
          setUser(currentUser);
        }
      } catch (err) {
        setError("Failed to fetch user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, token]);

  return { user, loading, error };
};