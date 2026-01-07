import { useCallback, useEffect, useState } from "react";
import { useAuthStore, useSurveyStore } from "../../../store";
import { SurveyService } from "../services";

/**
 * Hook to check if the user has completed the survey
 * Used to conditionally show survey prompt on home screen
 * and enable/disable missions tab
 */
export function useSurveyStatus() {
  const userId = useAuthStore((state) => state.userId);
  const lastSubmissionTimestamp = useSurveyStore((state) => state.lastSubmissionTimestamp);
  const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSurveyStatus = useCallback(async () => {
    if (!userId) {
      setHasCompleted(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const completed = await SurveyService.hasCompletedSurvey(userId);
      setHasCompleted(completed);
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        "Impossible de vérifier le statut du questionnaire";
      setError(message);
      // Default to false if we can't check
      setHasCompleted(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Re-check when userId changes or when survey is completed (lastSubmissionTimestamp updates)
  useEffect(() => {
    checkSurveyStatus();
  }, [checkSurveyStatus, lastSubmissionTimestamp]);

  return {
    hasCompleted,
    isLoading,
    error,
    refetch: checkSurveyStatus,
  };
}
