import { apiClient } from "../../../shared/api";
import type { RewardDto } from "../types";

export const RewardService = {
  createReward: async (payload: Partial<RewardDto>): Promise<RewardDto> => {
    const response = await apiClient.post<RewardDto>("/rewards", payload);
    return response.data;
  },

  getRewardById: async (id: number): Promise<RewardDto> => {
    const response = await apiClient.get<RewardDto>(`/rewards/${id}`);
    return response.data;
  },

  getAllRewards: async (): Promise<RewardDto[]> => {
    const response = await apiClient.get<RewardDto[]>("/rewards");
    return response.data;
  },

  updateReward: async (id: number, payload: Partial<RewardDto>): Promise<RewardDto> => {
    const response = await apiClient.put<RewardDto>(`/rewards/${id}`, payload);
    return response.data;
  },

  deleteReward: async (id: number): Promise<void> => {
    await apiClient.delete(`/rewards/${id}`);
  },

  getRewardsByPointsCostGreaterThanEqual: async (minPoints: number): Promise<RewardDto[]> => {
    const response = await apiClient.get<RewardDto[]>("/rewards/search/points-greater-equal", {
      params: { minPoints }
    });
    return response.data;
  },

  getRewardsByPointsCostLessThanEqual: async (maxPoints: number): Promise<RewardDto[]> => {
    const response = await apiClient.get<RewardDto[]>("/rewards/search/points-less-equal", {
      params: { maxPoints }
    });
    return response.data;
  },

  getRewardsByTitleContainsIgnoreCase: async (titlePart: string): Promise<RewardDto[]> => {
    const response = await apiClient.get<RewardDto[]>("/rewards/search/title", {
      params: { titlePart }
    });
    return response.data;
  },

  getRewardsByDescriptionContainsIgnoreCase: async (descPart: string): Promise<RewardDto[]> => {
    const response = await apiClient.get<RewardDto[]>("/rewards/search/description", {
      params: { descPart }
    });
    return response.data;
  }
};
