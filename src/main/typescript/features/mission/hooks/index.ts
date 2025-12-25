import { useState, useEffect } from "react";
import { UserMissionService } from "../services/user-mission.service";
import { UserMission, CreateUserMissionDto, UpdateUserMissionDto } from "../types";

/**
 * Hook to fetch missions for a specific user
 */
export const useUserMissions = (userId: number) => {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await UserMissionService.getMissionsByUserId(userId);
        setMissions(data);
      } catch (err) {
        setError("Failed to fetch user missions.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMissions();
    }
  }, [userId]);

  return { missions, loading, error };
};

/**
 * Hook to fetch a specific user mission
 */
export const useUserMission = (userId: number, missionId: number) => {
  const [mission, setMission] = useState<UserMission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMission = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await UserMissionService.getUserMission(userId, missionId);
        setMission(data);
      } catch (err) {
        setError("Failed to fetch user mission.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && missionId) {
      fetchMission();
    }
  }, [userId, missionId]);

  return { mission, loading, error };
};

/**
 * Hook to create a user mission
 */
export const useCreateUserMission = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (dto: CreateUserMissionDto): Promise<UserMission | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserMissionService.createUserMission(dto);
      return data;
    } catch (err) {
      setError("Failed to create user mission.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

/**
 * Hook to update a user mission
 */
export const useUpdateUserMission = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    userId: number,
    missionId: number,
    dto: UpdateUserMissionDto
  ): Promise<UserMission | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserMissionService.updateUserMission(userId, missionId, dto);
      return data;
    } catch (err) {
      setError("Failed to update user mission.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

/**
 * Hook to delete a user mission
 */
export const useDeleteUserMission = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUserMission = async (userId: number, missionId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await UserMissionService.deleteUserMission(userId, missionId);
      return true;
    } catch (err) {
      setError("Failed to delete user mission.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteUserMission, loading, error };
};
