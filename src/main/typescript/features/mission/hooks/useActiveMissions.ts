import { useState, useEffect } from "react";
import { UserMissionService } from "../services/user-mission.service";
import { UserMission } from "../types";

export const useActiveMissions = (userId: number | null, refreshTrigger?: number) => {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [activeMission, setActiveMission] = useState<UserMission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setMissions(data);
        
        // Find the first in-progress mission
        const inProgress = data.find(
          (m) => m.status === "IN_PROGRESS" && m.completionRate < 100
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
