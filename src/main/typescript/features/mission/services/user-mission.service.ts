import { UserMission, CreateUserMissionDto, UpdateUserMissionDto } from "../types";
import { apiClient } from "../../../shared/api/client";

export const UserMissionService = {
  /**
   * Get all missions for a specific user
   */
  async getMissionsByUserId(userId: number): Promise<UserMission[]> {
    const response = await apiClient.get<UserMission[]>(`/user-missions/user/${userId}`);
    return response.data;
  },

  /**
   * Get all users who have a specific mission
   */
  async getUsersByMissionId(missionId: number): Promise<UserMission[]> {
    const response = await apiClient.get<UserMission[]>(`/user-missions/mission/${missionId}`);
    return response.data;
  },

  /**
   * Get a specific user's mission
   */
  async getUserMission(userId: number, missionId: number): Promise<UserMission> {
    const response = await apiClient.get<UserMission>(`/user-missions/user/${userId}/mission/${missionId}`);
    return response.data;
  },

  /**
   * Assign a mission to a user
   */
  async createUserMission(dto: CreateUserMissionDto): Promise<UserMission> {
    const response = await apiClient.post<UserMission>("/user-missions", dto);
    return response.data;
  },

  /**
   * Update a user's mission
   */
  async updateUserMission(userId: number, missionId: number, dto: UpdateUserMissionDto): Promise<UserMission> {
    const response = await apiClient.put<UserMission>(`/user-missions/user/${userId}/mission/${missionId}`, dto);
    return response.data;
  },

  /**
   * Delete a user's mission assignment
   */
  async deleteUserMission(userId: number, missionId: number): Promise<void> {
    await apiClient.delete(`/user-missions/user/${userId}/mission/${missionId}`);
  },
};
