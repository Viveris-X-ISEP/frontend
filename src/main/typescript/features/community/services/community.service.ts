import { apiClient } from "../../../shared/api/client";
import { UserMissionService } from "../../mission/services/user-mission.service";
import type { User } from "../../user/types";
import type { CommunityUser, CommunityUserProfile, PaginatedResponse } from "../types";

// Mock data for development (backend /users endpoint requires ADMIN role)
const MOCK_USERS: CommunityUser[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  username: `user${i + 1}`,
  profilePictureUrl: null,
  missionsCompleted: Math.floor(Math.random() * 20)
}));

export const CommunityService = {
  /**
   * Fetch paginated list of users
   * Note: Using mock data as backend /users endpoint requires ADMIN role
   * TODO: Request backend to add a public endpoint for community users
   */
  async getCommunityUsers(page: number, pageSize = 12): Promise<PaginatedResponse<CommunityUser>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const totalCount = MOCK_USERS.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = page * pageSize;
    const end = start + pageSize;

    const paginatedUsers = MOCK_USERS.slice(start, end);

    return {
      data: paginatedUsers,
      page,
      pageSize,
      totalPages,
      totalCount
    };
  },

  /**
   * Fetch detailed profile for a specific user
   * Combines user info with mission statistics
   * Note: /users/{id} is a public endpoint
   */
  async getCommunityUserProfile(userId: string): Promise<CommunityUserProfile> {
    const numericId = Number.parseInt(userId, 10);

    // Validate userId is a valid number
    if (Number.isNaN(numericId)) {
      throw new Error(`Invalid userId: ${userId}`);
    }

    // Check if this is a mock user
    const mockUser = MOCK_USERS.find((u) => u.id === userId);
    if (mockUser) {
      // Return mock profile data
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Ensure totalMissions is always >= missionsCompleted + activeMissions
      const activeMissions = Math.floor(Math.random() * 5);
      const additionalMissions = Math.floor(Math.random() * 5);
      const totalMissions = mockUser.missionsCompleted + activeMissions + additionalMissions;
      return {
        id: mockUser.id,
        username: mockUser.username,
        profilePictureUrl: mockUser.profilePictureUrl,
        totalPoints: mockUser.missionsCompleted * 50,
        missionsCompleted: mockUser.missionsCompleted,
        activeMissions,
        totalMissions
      };
    }

    // Fetch real user and missions in parallel
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
