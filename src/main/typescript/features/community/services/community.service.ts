import { apiClient } from "../../../shared/api/client";
import { UserMissionService } from "../../mission/services/user-mission.service";
import type { User } from "../../user/types";
import type { CommunityUser, CommunityUserProfile, PaginatedResponse } from "../types";

export const CommunityService = {
  /**
   * Fetch all users and return a paginated slice
   * Note: Backend doesn't support pagination, so we implement client-side pagination
   */
  async getCommunityUsers(
    page: number,
    pageSize: number = 12
  ): Promise<PaginatedResponse<CommunityUser>> {
    const response = await apiClient.get<User[]>("/users");
    const allUsers = response.data;

    const totalCount = allUsers.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = page * pageSize;
    const end = start + pageSize;

    const paginatedUsers = allUsers.slice(start, end);

    // Transform to CommunityUser format
    const communityUsers: CommunityUser[] = paginatedUsers.map((user) => ({
      id: String(user.id),
      username: user.username,
      profilePictureUrl: user.profilePictureUrl || null,
      missionsCompleted: 0 // Will be populated if needed
    }));

    return {
      data: communityUsers,
      page,
      pageSize,
      totalPages,
      totalCount
    };
  },

  /**
   * Fetch detailed profile for a specific user
   * Combines user info with mission statistics
   */
  async getCommunityUserProfile(userId: string): Promise<CommunityUserProfile> {
    const numericId = Number.parseInt(userId, 10);

    // Fetch user and missions in parallel
    const [userResponse, missions] = await Promise.all([
      apiClient.get<User>(`/users/${numericId}`),
      UserMissionService.getMissionsByUserId(numericId)
    ]);

    const user = userResponse.data;

    return {
      id: String(user.id),
      username: user.username,
      profilePictureUrl: user.profilePictureUrl || null,
      totalPoints: missions
        .filter((m) => m.status === "COMPLETED")
        .reduce((sum, m) => sum + (m.mission?.points ?? 0), 0),
      missionsCompleted: missions.filter((m) => m.status === "COMPLETED").length,
      activeMissions: missions.filter((m) => m.status === "IN_PROGRESS").length,
      totalMissions: missions.length
    };
  }
};
