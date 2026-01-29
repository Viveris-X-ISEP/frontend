import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore, useSurveyStore } from "../../../store";
import { SurveyService } from "../services";
import type { FootprintQuizzPayload, SurveyAnswer } from "../types";

export function useSubmitSurvey() {
  const userId = useAuthStore((state) => state.userId);
  const markSurveyCompleted = useSurveyStore((state) => state.markSurveyCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Transform survey answers into API payload
   * Maps simplified survey answers to full FootprintQuizzDto structure
   */
  const transformAnswersToPayload = (answers: SurveyAnswer[]): FootprintQuizzPayload => {
    const getAnswerValue = (questionId: string): string | number => {
      return answers.find((a) => a.questionId === questionId)?.value ?? "";
    };

    const getNumericAnswer = (questionId: string, defaultValue: number): number => {
      const value = getAnswerValue(questionId);
      if (typeof value === "number") return value;
      const parsed = Number.parseInt(value as string, 10);
      return Number.isNaN(parsed) ? defaultValue : parsed;
    };

    // Transport answers
    const fuelType = (getAnswerValue("car_fuel_type") as string) || "GASOLINE";
    const kmPerYear = getNumericAnswer("car_km_per_year", 10000);
    const carPassengers = getNumericAnswer("car_passengers", 1);
    const publicTransportType = (getAnswerValue("public_transport_type") as string) || "BUS";
    const publicTransportFreq =
      (getAnswerValue("public_transport_frequency") as string) || "MEDIUM";
    const shortFlights = getNumericAnswer("air_short_flights", 0);
    const mediumFlights = getNumericAnswer("air_medium_flights", 0);
    const longFlights = getNumericAnswer("air_long_flights", 0);
    const bikeUse = getNumericAnswer("bike_use_per_week", 0);

    // Food answers
    const redMeat = getNumericAnswer("red_meat_per_week", 3);
    const whiteMeat = getNumericAnswer("white_meat_per_week", 3);
    const fish = getNumericAnswer("fish_per_week", 2);
    const dairy = getNumericAnswer("dairy_per_week", 7);

    // Housing answers
    const housingType = (getAnswerValue("housing_type") as string) || "APARTMENT";
    const surfaceArea = getNumericAnswer("surface_area", 50);
    const heatingSource = (getAnswerValue("heating_energy_source") as string) || "GAZ";

    // Digital answers
    const streamingHours = getNumericAnswer("streaming_hours_per_week", 10);
    const chargingFrequency = getNumericAnswer("charging_frequency_per_day", 2);
    const devicesOwned = getNumericAnswer("devices_owned", 4);

    return {
      userId,
      transportDto: {
        car: {
          fuelType: fuelType as FootprintQuizzPayload["transportDto"]["car"]["fuelType"],
          kilometersPerYear: kmPerYear,
          passengers: carPassengers
        },
        publicTransport: {
          type: publicTransportType as FootprintQuizzPayload["transportDto"]["publicTransport"]["type"],
          useFrequency:
            publicTransportFreq as FootprintQuizzPayload["transportDto"]["publicTransport"]["useFrequency"]
        },
        airTransport: {
          shortFlightsFrequencyPerYear: shortFlights,
          mediumFlightsFrequencyPerYear: mediumFlights,
          longFlightsFrequencyPerYear: longFlights
        },
        bikeUsePerWeek: bikeUse
      },
      foodDto: {
        redMeatConsumptionPerWeek: redMeat,
        whiteMeatConsumptionPerWeek: whiteMeat,
        fishConsumptionPerWeek: fish,
        dairyConsumptionPerWeek: dairy
      },
      housingDto: {
        housingType: housingType as FootprintQuizzPayload["housingDto"]["housingType"],
        surfaceArea: surfaceArea,
        heatingEnergySource:
          heatingSource as FootprintQuizzPayload["housingDto"]["heatingEnergySource"]
      },
      digitalDto: {
        digitalConsumption: {
          hoursOfStreamingPerWeek: streamingHours,
          chargingFrequencyPerDay: chargingFrequency
        },
        numberOfDevicesOwned: devicesOwned
      }
    };
  };

  const submitSurvey = async (answers: SurveyAnswer[]) => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = transformAnswersToPayload(answers);
      await SurveyService.calculateEmissions(payload);

      // Mark survey as completed to trigger home screen refresh
      markSurveyCompleted();

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
