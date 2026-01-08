import { useCallback, useState } from "react";
import type { SurveyAnswer, SurveyQuestion } from "../types";

/**
 * Survey questions mapped to FootprintQuizzDto fields
 * Total: 19 fields across 4 categories
 */
const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // ==========================================
  // TRANSPORT CATEGORY (9 questions)
  // ==========================================
  {
    id: "car_fuel_type",
    text: "Quel type de carburant utilise votre voiture ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "GASOLINE", label: "Essence", value: "GASOLINE" },
      { id: "DIESEL", label: "Diesel", value: "DIESEL" },
      { id: "ELECTRIC", label: "Électrique", value: "ELECTRIC" },
      { id: "HYBRID", label: "Hybride", value: "HYBRID" }
    ]
  },
  {
    id: "car_km_per_year",
    text: "Combien de kilomètres parcourez-vous en voiture par an ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "0", label: "Je n'ai pas de voiture", value: "0" },
      { id: "5000", label: "Moins de 5 000 km", value: "5000" },
      { id: "10000", label: "5 000 - 10 000 km", value: "10000" },
      { id: "15000", label: "10 000 - 20 000 km", value: "15000" },
      { id: "25000", label: "Plus de 20 000 km", value: "25000" }
    ]
  },
  {
    id: "car_passengers",
    text: "En moyenne, combien de passagers voyagent avec vous en voiture ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "1", label: "Je suis seul(e)", value: "1" },
      { id: "2", label: "2 personnes", value: "2" },
      { id: "3", label: "3 personnes", value: "3" },
      { id: "4", label: "4 personnes ou plus", value: "4" }
    ]
  },
  {
    id: "public_transport_type",
    text: "Quel type de transport en commun utilisez-vous principalement ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "BUS", label: "Bus", value: "BUS" },
      { id: "TRAMWAY", label: "Tramway", value: "TRAMWAY" },
      { id: "METRO", label: "Métro", value: "METRO" },
      { id: "TRAIN", label: "Train", value: "TRAIN" }
    ]
  },
  {
    id: "public_transport_frequency",
    text: "À quelle fréquence utilisez-vous les transports en commun ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "HIGH", label: "Quotidiennement", value: "HIGH" },
      { id: "MEDIUM", label: "Quelques fois par semaine", value: "MEDIUM" },
      { id: "LOW", label: "Rarement ou jamais", value: "LOW" }
    ]
  },
  {
    id: "air_short_flights",
    text: "Combien de vols courts (<3h) prenez-vous par an ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "1", label: "1-2 vols", value: "1" },
      { id: "3", label: "3-5 vols", value: "3" },
      { id: "6", label: "Plus de 5 vols", value: "6" }
    ]
  },
  {
    id: "air_medium_flights",
    text: "Combien de vols moyens (3-6h) prenez-vous par an ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "1", label: "1-2 vols", value: "1" },
      { id: "3", label: "3-5 vols", value: "3" },
      { id: "6", label: "Plus de 5 vols", value: "6" }
    ]
  },
  {
    id: "air_long_flights",
    text: "Combien de vols longs (>6h) prenez-vous par an ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "1", label: "1-2 vols", value: "1" },
      { id: "3", label: "3-5 vols", value: "3" },
      { id: "6", label: "Plus de 5 vols", value: "6" }
    ]
  },
  {
    id: "bike_use_per_week",
    text: "Combien de fois par semaine utilisez-vous le vélo ?",
    category: "transport",
    inputType: "radio",
    options: [
      { id: "0", label: "Jamais", value: "0" },
      { id: "1", label: "1-2 fois", value: "1" },
      { id: "3", label: "3-5 fois", value: "3" },
      { id: "7", label: "Tous les jours", value: "7" }
    ]
  },

  // ==========================================
  // FOOD CATEGORY (4 questions)
  // ==========================================
  {
    id: "red_meat_per_week",
    text: "Combien de repas à base de viande rouge consommez-vous par semaine ?",
    category: "food",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "1", label: "1-2 repas", value: "1" },
      { id: "3", label: "3-5 repas", value: "3" },
      { id: "7", label: "Plus de 5 repas", value: "7" }
    ]
  },
  {
    id: "white_meat_per_week",
    text: "Combien de repas à base de volaille consommez-vous par semaine ?",
    category: "food",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "2", label: "1-3 repas", value: "2" },
      { id: "4", label: "4-6 repas", value: "4" },
      { id: "7", label: "Plus de 6 repas", value: "7" }
    ]
  },
  {
    id: "fish_per_week",
    text: "Combien de repas à base de poisson consommez-vous par semaine ?",
    category: "food",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucun", value: "0" },
      { id: "1", label: "1-2 repas", value: "1" },
      { id: "3", label: "3-4 repas", value: "3" },
      { id: "5", label: "Plus de 4 repas", value: "5" }
    ]
  },
  {
    id: "dairy_per_week",
    text: "Combien de portions de produits laitiers consommez-vous par semaine ?",
    category: "food",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucune", value: "0" },
      { id: "3", label: "1-5 portions", value: "3" },
      { id: "7", label: "6-10 portions", value: "7" },
      { id: "14", label: "Plus de 10 portions", value: "14" }
    ]
  },

  // ==========================================
  // HOUSING CATEGORY (3 questions)
  // ==========================================
  {
    id: "housing_type",
    text: "Quel est votre type de logement ?",
    category: "housing",
    inputType: "radio",
    options: [
      { id: "APARTMENT", label: "Appartement", value: "APARTMENT" },
      { id: "HOUSE", label: "Maison", value: "HOUSE" },
      { id: "COLOCATION", label: "Colocation", value: "COLOCATION" },
      { id: "VILLA", label: "Villa", value: "VILLA" }
    ]
  },
  {
    id: "surface_area",
    text: "Quelle est la superficie de votre logement ?",
    category: "housing",
    inputType: "radio",
    options: [
      { id: "30", label: "Moins de 30 m²", value: "30" },
      { id: "50", label: "30-50 m²", value: "50" },
      { id: "80", label: "50-80 m²", value: "80" },
      { id: "100", label: "80-120 m²", value: "100" },
      { id: "150", label: "Plus de 120 m²", value: "150" }
    ]
  },
  {
    id: "heating_energy_source",
    text: "Quelle est votre source d'énergie principale pour le chauffage ?",
    category: "housing",
    inputType: "radio",
    options: [
      { id: "GAZ", label: "Gaz", value: "GAZ" },
      { id: "ELECTRICITY", label: "Électricité", value: "ELECTRICITY" },
      { id: "FUEL_OIL", label: "Fioul", value: "FUEL_OIL" },
      { id: "HEAT_PUMP", label: "Pompe à chaleur", value: "HEAT_PUMP" },
      { id: "WOOD", label: "Bois", value: "WOOD" },
      { id: "HEAT_NETWORK", label: "Réseau de chaleur", value: "HEAT_NETWORK" }
    ]
  },

  // ==========================================
  // DIGITAL CATEGORY (3 questions)
  // ==========================================
  {
    id: "streaming_hours_per_week",
    text: "Combien d'heures de streaming vidéo regardez-vous par semaine ?",
    category: "digital",
    inputType: "radio",
    options: [
      { id: "0", label: "Aucune", value: "0" },
      { id: "5", label: "Moins de 5 heures", value: "5" },
      { id: "10", label: "5-10 heures", value: "10" },
      { id: "20", label: "10-20 heures", value: "20" },
      { id: "30", label: "Plus de 20 heures", value: "30" }
    ]
  },
  {
    id: "charging_frequency_per_day",
    text: "Combien de fois par jour rechargez-vous vos appareils électroniques ?",
    category: "digital",
    inputType: "radio",
    options: [
      { id: "1", label: "1 fois", value: "1" },
      { id: "2", label: "2 fois", value: "2" },
      { id: "3", label: "3 fois", value: "3" },
      { id: "4", label: "4 fois ou plus", value: "4" }
    ]
  },
  {
    id: "devices_owned",
    text: "Combien d'appareils électroniques possédez-vous ? (téléphones, tablettes, ordinateurs, etc.)",
    category: "digital",
    inputType: "radio",
    options: [
      { id: "1", label: "1-2 appareils", value: "1" },
      { id: "3", label: "3-4 appareils", value: "3" },
      { id: "5", label: "5-6 appareils", value: "5" },
      { id: "8", label: "Plus de 6 appareils", value: "8" }
    ]
  }
];

export function useSurvey() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);

  const questions = SURVEY_QUESTIONS;
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Get the current answer for the current question
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const selectAnswer = useCallback(
    (answerId: string, value: string | number) => {
      setAnswers((prev) => {
        const existingIndex = prev.findIndex((a) => a.questionId === currentQuestion.id);
        const newAnswer: SurveyAnswer = {
          questionId: currentQuestion.id,
          answerId,
          value
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAnswer;
          return updated;
        }
        return [...prev, newAnswer];
      });
    },
    [currentQuestion?.id]
  );

  const goToNextQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [isLastQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [isFirstQuestion]);

  const resetSurvey = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
  }, []);

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    currentAnswer,
    answers,
    isFirstQuestion,
    isLastQuestion,
    selectAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    resetSurvey
  };
}
