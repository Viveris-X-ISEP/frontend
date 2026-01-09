import { useEffect, useState } from "react";
import { SurveyService } from "../services/survey.service";
import type { UserEmissionDto } from "../types";

export const useLatestEmissions = (userId: number | null, refreshTrigger?: number) => {
  const [emissions, setEmissions] = useState<UserEmissionDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger is intentionally used to force refetch
  useEffect(() => {
    const fetchEmissions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await SurveyService.getLatestEmission(userId);
        setEmissions(data);
      } catch (err) {
        setError("Impossible de récupérer les émissions");
        console.error("Error fetching emissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmissions();
  }, [userId, refreshTrigger]);

  return { emissions, loading, error };
};
