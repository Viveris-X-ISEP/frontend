// ===========================================
// SURVEY QUESTION & ANSWER TYPES
// ===========================================

/**
 * Represents a single answer option for a survey question
 */
export interface SurveyAnswerOption {
  id: string;
  label: string;
  value: string;
}

/**
 * Represents a single survey question
 */
export interface SurveyQuestion {
  id: string;
  text: string;
  options: SurveyAnswerOption[];
}

/**
 * User's answer to a single question
 */
export interface SurveyAnswer {
  questionId: string;
  answerId: string;
  value: string;
}

// ===========================================
// REQUEST PAYLOADS (sent to backend)
// ===========================================

/**
 * Payload for submitting user emissions data
 * TODO: Update fields based on actual backend DTO from UserEmissionsController
 */
export interface SubmitEmissionsPayload {
  transportFrequency: string;
  publicTransportUsage: string;
  dietType: string;
  homeHeating: string;
  wasteRecycling: string;
  // Add more fields as needed based on backend requirements
}

// ===========================================
// RESPONSE PAYLOADS (received from backend)
// ===========================================

/**
 * Response after submitting emissions
 * TODO: Update based on actual backend response
 */
export interface EmissionsResponse {
  id: number;
  userId: number;
  totalEmissions: number;
  transportEmissions: number;
  foodEmissions: number;
  housingEmissions: number;
  wasteEmissions: number;
  createdAt: string;
}

/**
 * User emissions summary (for home screen)
 * TODO: Update based on actual backend response
 */
export interface UserEmissionsSummary {
  totalEmissions: number;
  percentageChange: number;
  breakdown: {
    transport: number;
    food: number;
    housing: number;
    waste: number;
  };
  hasCompletedSurvey: boolean;
}

// ===========================================
// SURVEY STATE (frontend-only)
// ===========================================

export interface SurveyState {
  currentQuestionIndex: number;
  answers: SurveyAnswer[];
  isLoading: boolean;
  error: string | null;
}

export interface SurveyFormState {
  isSubmitting: boolean;
  error: string | null;
}
