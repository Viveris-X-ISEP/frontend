import { useState } from "react";
import { useRouter } from "expo-router";
import { SurveyService } from "../services";
import type { SurveyAnswer, SubmitEmissionsPayload } from "../types";

export function useSubmitSurvey() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Transform survey answers into API payload
   * TODO: Adjust mapping based on actual backend DTO structure
   */
  const transformAnswersToPayload = (
    answers: SurveyAnswer[],
  ): SubmitEmissionsPayload => {
    const getAnswerValue = (questionId: string): string => {
      return answers.find((a) => a.questionId === questionId)?.value ?? "";
    };

    return {
      transportFrequency: getAnswerValue("transport"),
      publicTransportUsage: getAnswerValue("car"),
      dietType: getAnswerValue("diet"),
      homeHeating: getAnswerValue("heating"),
      wasteRecycling: getAnswerValue("waste"),
    };
  };

  const submitSurvey = async (answers: SurveyAnswer[]) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = transformAnswersToPayload(answers);
      await SurveyService.submitEmissions(payload);

      // Navigate back to home after successful submission
      router.replace("/(tabs)/(home)");
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        apiError.response?.data?.message ||
        apiError.response?.data?.error ||
        "Une erreur est survenue lors de la soumission du questionnaire";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitSurvey, isSubmitting, error };
}
