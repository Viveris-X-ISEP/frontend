export interface CommunityUser {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  missionsCompleted: number;
}

export interface CommunityUserProfile {
  id: string;
  username: string;
  profilePictureUrl: string | null;
  totalPoints: number;
  missionsCompleted: number;
  activeMissions: number;
  totalMissions: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
