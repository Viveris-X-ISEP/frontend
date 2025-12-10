import { useState, useCallback } from "react";
import type { SurveyQuestion, SurveyAnswer } from "../types";

// Survey questions data
// TODO: These could come from an API or be localized
const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "transport",
    text: "À quelle fréquence utilisez-vous les transports en commun ?",
    options: [
      { id: "daily", label: "Quotidiennement", value: "daily" },
      { id: "weekly", label: "Quelques fois par semaine", value: "weekly" },
      { id: "rarely", label: "Rarement", value: "rarely" },
      { id: "never", label: "Jamais", value: "never" },
    ],
  },
  {
    id: "car",
    text: "Possédez-vous une voiture personnelle ?",
    options: [
      {
        id: "yes_daily",
        label: "Oui, je l'utilise quotidiennement",
        value: "yes_daily",
      },
      {
        id: "yes_occasionally",
        label: "Oui, mais je l'utilise rarement",
        value: "yes_occasionally",
      },
      { id: "no", label: "Non", value: "no" },
    ],
  },
  {
    id: "diet",
    text: "Comment décririez-vous votre régime alimentaire ?",
    options: [
      { id: "vegan", label: "Végétalien", value: "vegan" },
      { id: "vegetarian", label: "Végétarien", value: "vegetarian" },
      {
        id: "flexitarian",
        label: "Flexitarien (peu de viande)",
        value: "flexitarian",
      },
      { id: "omnivore", label: "Omnivore", value: "omnivore" },
    ],
  },
  {
    id: "heating",
    text: "Quel type de chauffage utilisez-vous principalement ?",
    options: [
      { id: "electric", label: "Électrique", value: "electric" },
      { id: "gas", label: "Gaz", value: "gas" },
      { id: "wood", label: "Bois", value: "wood" },
      { id: "heat_pump", label: "Pompe à chaleur", value: "heat_pump" },
    ],
  },
  {
    id: "waste",
    text: "À quelle fréquence triez-vous vos déchets ?",
    options: [
      { id: "always", label: "Toujours", value: "always" },
      { id: "often", label: "Souvent", value: "often" },
      { id: "sometimes", label: "Parfois", value: "sometimes" },
      { id: "never", label: "Jamais", value: "never" },
    ],
  },
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
  const currentAnswer = answers.find(
    (a) => a.questionId === currentQuestion?.id,
  );

  const selectAnswer = useCallback(
    (answerId: string, value: string) => {
      setAnswers((prev) => {
        const existingIndex = prev.findIndex(
          (a) => a.questionId === currentQuestion.id,
        );
        const newAnswer: SurveyAnswer = {
          questionId: currentQuestion.id,
          answerId,
          value,
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAnswer;
          return updated;
        }
        return [...prev, newAnswer];
      });
    },
    [currentQuestion?.id],
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
    resetSurvey,
  };
}
