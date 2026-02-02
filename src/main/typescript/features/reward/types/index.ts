export interface RewardDto {
  id: number;
  title: string;
  description?: string;
  pointsCost?: number;
}

export interface UserRewardDto {
  userId: number;
  rewardId: number;
  reward?: RewardDto; // optional: useful to display reward details in UI
  quantity: number;
  obtainedAt: string; // ISO date string
  source?: string;
}
