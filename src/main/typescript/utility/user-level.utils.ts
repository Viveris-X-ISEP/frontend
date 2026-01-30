export const calculateLevel = (totalPoints: number): number => {
  return Math.floor(totalPoints / 500) + 1;
};

export const calculateCompletedPoints = (
  missions: Array<{
    status: string;
    mission?: { rewardPoints?: number; points?: number };
  }>
): number => {
  if (!missions || !Array.isArray(missions)) {
    return 0;
  }

  return missions.reduce((total, userMission) => {
    if (userMission.status === "COMPLETED" && userMission.mission) {
      const points = userMission.mission.rewardPoints || userMission.mission.points || 0;
      return total + points;
    }
    return total;
  }, 0);
};

/**
 * Calculate total points from completed missions
 */
export const calculateTotalPoints = (
  missions: Array<{
    status: string;
    completionRate: number;
    mission?: { points: number };
  }>
): number => {
  if (!missions || !Array.isArray(missions)) {
    return 0;
  }

  return missions.reduce((total, userMission) => {
    if (userMission.status === "COMPLETED" && userMission.mission) {
      return total + userMission.mission.points;
    }
    // Partial points for in-progress missions
    if (userMission.status === "IN_PROGRESS" && userMission.mission) {
      return total + Math.floor((userMission.mission.points * userMission.completionRate) / 100);
    }
    return total;
  }, 0);
};

/**
 * Get progress to next level
 */
export const getLevelProgress = (
  totalPoints: number
): { current: number; max: number; percentage: number } => {
  const pointsInCurrentLevel = totalPoints % 500;
  return {
    current: pointsInCurrentLevel,
    max: 500,
    percentage: (pointsInCurrentLevel / 500) * 100
  };
};
