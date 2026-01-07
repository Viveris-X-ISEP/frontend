import type { MissionStatus } from "./mission-status";

export interface Mission {
  id: number;
  title: string;
  description: string;
  category: string;
  points: number;
  difficulty: string;
  duration: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserMission {
  userId: number;
  missionId: number;
  mission?: Mission;
  status: MissionStatus;
  completionRate: number;
  maxReduction?: number | null;
  completedAt?: Date | string;
  startedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateUserMissionDto {
  userId: number;
  missionId: number;
  status: MissionStatus;
  completionRate: number;
  maxReduction?: number | null;
  startedAt?: Date | string;
  completedAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface UpdateUserMissionDto {
  status?: MissionStatus;
  completionRate?: number;
  maxReduction?: number | null;
  completedAt?: Date | string;
}
