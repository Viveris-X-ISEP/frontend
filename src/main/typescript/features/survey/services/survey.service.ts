import { apiClient } from "../../../shared/api";
import type {
  SubmitEmissionsPayload,
  EmissionsResponse,
  UserEmissionsSummary,
} from "../types";

export const SurveyService = {
  /**
   * POST /user-emissions
   * Submit user emissions data from survey
   * TODO: Verify endpoint path from UserEmissionsController
   */
  submitEmissions: async (
    payload: SubmitEmissionsPayload,
  ): Promise<EmissionsResponse> => {
    const response = await apiClient.post<EmissionsResponse>(
      "/user-emissions",
      payload,
    );
    return response.data;
  },

  /**
   * GET /user-emissions
   * Get user's current emissions summary
   * TODO: Verify endpoint path from UserEmissionsController
   */
  getEmissions: async (): Promise<UserEmissionsSummary> => {
    const response =
      await apiClient.get<UserEmissionsSummary>("/user-emissions");
    return response.data;
  },

  /**
   * GET /user-emissions/has-completed
   * Check if user has completed the survey
   * TODO: Verify if this endpoint exists or if we should derive from getEmissions
   */
  hasCompletedSurvey: async (): Promise<boolean> => {
    try {
      const response =
        await apiClient.get<UserEmissionsSummary>("/user-emissions");
      return response.data?.hasCompletedSurvey ?? false;
    } catch {
      // If no emissions data exists, survey hasn't been completed
      return false;
    }
  },
};
