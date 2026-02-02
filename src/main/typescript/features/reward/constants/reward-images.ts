// Map reward identifiers (id or slug) to local image assets.
// Add entries here when you add files under src/main/resources/images/rewards/
const REWARD_IMAGES: Record<string, number> = {
  "reward-1": require("../../../../resources/images/rewards/reward-1.png"),
  "reward-2": require("../../../../resources/images/rewards/reward-2.png"),
  "reward-3": require("../../../../resources/images/rewards/reward-3.png")
};

// Default fallback to app icon (already present in resources)
const FALLBACK_IMAGE = require("../../../../resources/images/icon.png");

export const getRewardImage = (rewardTitle?: string, rewardId?: number): number => {
  // Try to find by slugified title
  if (rewardTitle) {
    const slug = rewardTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (REWARD_IMAGES[slug]) return REWARD_IMAGES[slug];
  }

  // Try by id key
  if (typeof rewardId === "number") {
    const idKey = `reward-${rewardId}`;
    if (REWARD_IMAGES[idKey]) return REWARD_IMAGES[idKey];
  }

  // Fallback
  return FALLBACK_IMAGE;
};
