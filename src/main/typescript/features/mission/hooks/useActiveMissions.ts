import { useEffect, useState } from "react";
import { getMissionById } from "../../missions/services/missions.service";
import type { Mission as MissionWithGoal } from "../../missions/types";
import { UserMissionService } from "../services/user-mission.service";
import type { UserMission } from "../types";

export type EnrichedUserMission = UserMission & { mission?: MissionWithGoal };

export const useActiveMissions = (userId: number | null, refreshTrigger?: number) => {
  const [missions, setMissions] = useState<EnrichedUserMission[]>([]);
  const [activeMission, setActiveMission] = useState<EnrichedUserMission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshTrigger is intentionally used to force refetch
  useEffect(() => {
    const fetchMissions = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await UserMissionService.getMissionsByUserId(userId);

        // Enrich each mission with full mission data including goal
        const enrichedMissions = await Promise.all(
          data.map(async (userMission) => {
            try {
              const fullMission = await getMissionById(userMission.missionId);
              return {
                ...userMission,
                mission: fullMission
              } as EnrichedUserMission;
            } catch (err) {
              console.error(`Error fetching mission ${userMission.missionId}:`, err);
              return {
                ...userMission,
                mission: undefined
              } as EnrichedUserMission;
            }
          })
        );

        setMissions(enrichedMissions);

        // Find the first in-progress mission (check against goal, not 100)
        const inProgress = enrichedMissions.find(
          (m) => m.status === "IN_PROGRESS" && m.mission && m.completionRate < m.mission.goal
        );
        setActiveMission(inProgress || null);
      } catch (err) {
        setError("Impossible de récupérer les missions");
        console.error("Error fetching missions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [userId, refreshTrigger]);

  return { missions, activeMission, loading, error };
};
