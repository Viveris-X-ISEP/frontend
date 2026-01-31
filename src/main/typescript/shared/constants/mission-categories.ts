export enum MissionCategory {
  TRANSPORT = "TRANSPORT",
  ALIMENTATION = "ALIMENTATION",
  LOGEMENT = "LOGEMENT",
  NUMERIQUE = "NUMERIQUE"
}

export const MISSION_CATEGORY_DISPLAY_NAMES: Record<MissionCategory, string> = {
  [MissionCategory.TRANSPORT]: "Transport",
  [MissionCategory.ALIMENTATION]: "Alimentation",
  [MissionCategory.LOGEMENT]: "Logement",
  [MissionCategory.NUMERIQUE]: "Numérique"
};

export const MISSION_CATEGORY_IMAGES: Record<MissionCategory, number> = {
  [MissionCategory.LOGEMENT]: require("../../../resources/images/missions_categories/logement.jpg"),
  [MissionCategory.ALIMENTATION]: require("../../../resources/images/missions_categories/alimentation.jpg"),
  [MissionCategory.NUMERIQUE]: require("../../../resources/images/missions_categories/numerique.jpg"),
  [MissionCategory.TRANSPORT]: require("../../../resources/images/missions_categories/transport.jpg")
};

export const ALL_CATEGORIES = "Tout";
