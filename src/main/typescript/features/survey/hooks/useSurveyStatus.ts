import { useState, useEffect } from "react";
import { SurveyService } from "../services";

/**
 * Hook to check if the user has completed the survey
 * Used to conditionally show survey prompt on home screen
 * and enable/disable missions tab
 */
export function useSurveyStatus() {
  const [hasCompleted, setHasCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSurveyStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const completed = await SurveyService.hasCompletedSurvey();
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
  };

  useEffect(() => {
    checkSurveyStatus();
  }, []);

  return {
    hasCompleted,
    isLoading,
    error,
    refetch: checkSurveyStatus,
  };
}
