import { apiClient } from "../../../shared/api";
import type { FootprintQuizzPayload, UserEmissionDto } from "../types";

export const SurveyService = {
  /**
   * POST /emissions/calculate
   * Calculate and save user emissions from survey
   */
  calculateEmissions: async (payload: FootprintQuizzPayload): Promise<UserEmissionDto> => {
    const response = await apiClient.post<UserEmissionDto>("/emissions/calculate", payload);
    return response.data;
  },

  /**
   * GET /emissions/user/:userId
   * Get latest emission for a user
   */
  getLatestEmission: async (userId: number): Promise<UserEmissionDto> => {
    const response = await apiClient.get<UserEmissionDto>(`/emissions/user/${userId}`);
    return response.data;
  },

  /**
   * GET /emissions/all/user/:userId
   * Get all emissions history for a user
   */
  getAllEmissions: async (userId: number): Promise<UserEmissionDto[]> => {
    const response = await apiClient.get<UserEmissionDto[]>(`/emissions/all/user/${userId}`);
    return response.data;
  },

  /**
   * GET /emissions/api/user/:userId
   * Get latest API-based emission for a user
   */
  getLatestApiEmission: async (userId: number): Promise<UserEmissionDto> => {
    const response = await apiClient.get<UserEmissionDto>(`/emissions/api/user/${userId}`);
    return response.data;
  },

  /**
   * GET /emissions/all/api/user/:userId
   * Get all API-based emissions for a user
   */
  getAllApiEmissions: async (userId: number): Promise<UserEmissionDto[]> => {
    const response = await apiClient.get<UserEmissionDto[]>(`/emissions/all/api/user/${userId}`);
    return response.data;
  },

  /**
   * GET /emissions/missions/user/:userId
   * Get latest mission-based emission for a user
   */
  getLatestMissionEmission: async (userId: number): Promise<UserEmissionDto> => {
    const response = await apiClient.get<UserEmissionDto>(`/emissions/missions/user/${userId}`);
    return response.data;
  },

  /**
   * GET /emissions/all/missions/user/:userId
   * Get all mission-based emissions for a user
   */
  getAllMissionEmissions: async (userId: number): Promise<UserEmissionDto[]> => {
    const response = await apiClient.get<UserEmissionDto[]>(
      `/emissions/all/missions/user/${userId}`
    );
    return response.data;
  },

  /**
   * Check if user has completed the survey by checking if they have emissions data
   */
  hasCompletedSurvey: async (userId: number): Promise<boolean> => {
    try {
      const response = await apiClient.get<UserEmissionDto>(`/emissions/user/${userId}`);
      return response.data !== null && response.data.totalEmissions > 0;
    } catch {
      // If no emissions data exists, survey hasn't been completed
      return false;
    }
  }
};
