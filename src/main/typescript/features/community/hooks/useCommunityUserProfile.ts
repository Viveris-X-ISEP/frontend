import { useEffect, useState } from "react";
import { CommunityService } from "../services/community.service";
import type { CommunityUserProfile } from "../types";

interface UseCommunityUserProfileReturn {
  profile: CommunityUserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useCommunityUserProfile(userId: string): UseCommunityUserProfileReturn {
  const [profile, setProfile] = useState<CommunityUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await CommunityService.getCommunityUserProfile(userId);
        setProfile(data);
      } catch (err) {
        setError("Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
