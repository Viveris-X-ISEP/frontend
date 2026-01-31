import { apiClient } from "../../../shared/api";
import type { UserRewardDto } from "../types";

export const UserRewardService = {
  getAll: async (): Promise<UserRewardDto[]> => {
    const response = await apiClient.get<UserRewardDto[]>(`/user-rewards`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<UserRewardDto[]> => {
    const response = await apiClient.get<UserRewardDto[]>(`/user-rewards/user/${userId}`);
    return response.data;
  },

  getByRewardId: async (rewardId: number): Promise<UserRewardDto[]> => {
    const response = await apiClient.get<UserRewardDto[]>(`/user-rewards/reward/${rewardId}`);
    return response.data;
  },

  getByIds: async (userId: number, rewardId: number): Promise<UserRewardDto | null> => {
    try {
      const response = await apiClient.get<UserRewardDto>(`/user-rewards/user/${userId}/reward/${rewardId}`);
      return response.data;
    } catch {
      return null;
    }
  },

  create: async (payload: Partial<UserRewardDto>): Promise<UserRewardDto> => {
    const response = await apiClient.post<UserRewardDto>(`/user-rewards`, payload);
    return response.data;
  },

  update: async (userId: number, rewardId: number, payload: Partial<UserRewardDto>): Promise<UserRewardDto> => {
    const response = await apiClient.put<UserRewardDto>(`/user-rewards/user/${userId}/reward/${rewardId}`, payload);
    return response.data;
  },

  delete: async (userId: number, rewardId: number): Promise<void> => {
    await apiClient.delete(`/user-rewards/user/${userId}/reward/${rewardId}`);
  }
};
