import { useState, useEffect, useCallback } from "react";
import { SurveyService } from "../services";

// TODO: Get userId from auth store once it's implemented
const MOCK_USER_ID = 1;

/**
 * Hook to check if the user has completed the survey
 * Used to conditionally show survey prompt on home screen
 * and enable/disable missions tab
 */
export function useSurveyStatus(userId: number = MOCK_USER_ID) {
  const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSurveyStatus = useCallback(async () => {
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

  useEffect(() => {
    checkSurveyStatus();
  }, [checkSurveyStatus]);

  return {
    hasCompleted,
    isLoading,
    error,
    refetch: checkSurveyStatus,
  };
}
