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
// ENUM TYPES (matching backend enums)
// ===========================================

export type FuelType = 'ELECTRIC' | 'GASOLINE' | 'DIESEL' | 'HYBRID';
export type LowMediumHigh = 'LOW' | 'MEDIUM' | 'HIGH';
export type PublicTransportType = 'BUS' | 'METRO' | 'TRAIN' | 'TRAM';
export type EnergySource =
  | 'GAZ'
  | 'FUEL_OIL'
  | 'ELECTRICITY'
  | 'HEAT_PUMP'
  | 'WOOD'
  | 'CHIPS'
  | 'HEAT_NETWORK';
export type HousingType = 'APARTMENT' | 'HOUSE';
export type EstimateOrigin = 'QUIZZ' | 'API' | 'MISSION';

// ===========================================
// REQUEST PAYLOADS (sent to backend)
// Matches: FootprintQuizzDto
// ===========================================

export interface Car {
  fuelType: FuelType;
  kilometersPerYear: number;
  passengers: number;
}

export interface PublicTransport {
  type: PublicTransportType;
  useFrequency: LowMediumHigh;
}

export interface AirTransport {
  shortHaulFlightsPerYear: number;
  longHaulFlightsPerYear: number;
}

export interface Transport {
  car: Car;
  publicTransport: PublicTransport;
  airTransport: AirTransport;
  bikeUsePerWeek: number;
}

export interface Food {
  redMeatConsumptionPerWeek: number;
  whiteMeatConsumptionPerWeek: number;
  fishConsumptionPerWeek: number;
  dairyConsumptionPerWeek: number;
}

export interface Housing {
  housingType: HousingType;
  surfaceArea: number;
  heatingEnergySource: EnergySource;
}

export interface DigitalConsumption {
  streamingHoursPerWeek: number;
  emailsPerDay: number;
}

export interface Digital {
  digitalConsumption: DigitalConsumption;
  numberOfDevicesOwned: number;
}

/**
 * Payload for submitting user emissions data
 * Matches backend: FootprintQuizzDto
 * POST /emissions/calculate
 */
export interface FootprintQuizzPayload {
  userId: number;
  food: Food;
  transport: Transport;
  housing: Housing;
  digital: Digital;
}

// ===========================================
// RESPONSE PAYLOADS (received from backend)
// Matches: UserEmissionDto
// ===========================================

/**
 * Response from emissions endpoints
 * Matches backend: UserEmissionDto
 */
export interface UserEmissionDto {
  userId: number;
  housingEmissions: number;
  transportEmissions: number;
  foodEmissions: number;
  digitalEmissions: number;
  totalEmissions: number;
  periodStart: string;
  origin: EstimateOrigin;
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

