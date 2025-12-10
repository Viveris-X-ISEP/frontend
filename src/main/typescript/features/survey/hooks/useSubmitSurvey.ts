import { useState } from "react";
import { useRouter } from "expo-router";
import { SurveyService } from "../services";
import type { SurveyAnswer, FootprintQuizzPayload } from "../types";

// TODO: Get userId from auth store once it's implemented
const MOCK_USER_ID = 1;

export function useSubmitSurvey(userId: number = MOCK_USER_ID) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Transform survey answers into API payload
   * Maps simplified survey answers to full FootprintQuizzDto structure
   */
  const transformAnswersToPayload = (
    answers: SurveyAnswer[],
  ): FootprintQuizzPayload => {
    const getAnswerValue = (questionId: string): string => {
      return answers.find((a) => a.questionId === questionId)?.value ?? "";
    };

    // Map survey answers to backend DTO structure
    const transportAnswer = getAnswerValue("transport");
    const carAnswer = getAnswerValue("car");
    const dietAnswer = getAnswerValue("diet");
    const heatingAnswer = getAnswerValue("heating");
    const wasteAnswer = getAnswerValue("waste");

    return {
      userId,
      transport: {
        car: {
          fuelType: carAnswer === "yes_daily" ? "GASOLINE" : "ELECTRIC",
          kilometersPerYear:
            carAnswer === "yes_daily"
              ? 15000
              : carAnswer === "yes_occasionally"
                ? 5000
                : 0,
          passengers: 1,
        },
        publicTransport: {
          type: "BUS",
          useFrequency:
            transportAnswer === "daily"
              ? "HIGH"
              : transportAnswer === "weekly"
                ? "MEDIUM"
                : "LOW",
        },
        airTransport: {
          shortHaulFlightsPerYear: 2,
          longHaulFlightsPerYear: 1,
        },
        bikeUsePerWeek: transportAnswer === "never" ? 0 : 3,
      },
      food: {
        redMeatConsumptionPerWeek:
          dietAnswer === "vegan"
            ? 0
            : dietAnswer === "vegetarian"
              ? 0
              : dietAnswer === "flexitarian"
                ? 2
                : 5,
        whiteMeatConsumptionPerWeek:
          dietAnswer === "vegan"
            ? 0
            : dietAnswer === "vegetarian"
              ? 0
              : dietAnswer === "flexitarian"
                ? 3
                : 4,
        fishConsumptionPerWeek:
          dietAnswer === "vegan" ? 0 : dietAnswer === "vegetarian" ? 0 : 2,
        dairyConsumptionPerWeek: dietAnswer === "vegan" ? 0 : 7,
      },
      housing: {
        housingType: "APARTMENT",
        surfaceArea: 60,
        heatingEnergySource:
          heatingAnswer === "electric"
            ? "ELECTRICITY"
            : heatingAnswer === "gas"
              ? "GAZ"
              : heatingAnswer === "wood"
                ? "WOOD"
                : "HEAT_PUMP",
      },
      digital: {
        digitalConsumption: {
          streamingHoursPerWeek: 10,
          emailsPerDay: 20,
        },
        numberOfDevicesOwned: 5,
      },
    };
  };

  const submitSurvey = async (answers: SurveyAnswer[]) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = transformAnswersToPayload(answers);
      await SurveyService.calculateEmissions(payload);

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
