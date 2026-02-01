import { FontAwesome5 } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { router } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  ALL_CATEGORIES,
  MISSION_CATEGORY_DISPLAY_NAMES,
  MISSION_CATEGORY_IMAGES,
  MissionCategory,
} from "../../../shared/constants/mission-categories";
import { type Theme, useTheme } from "../../../shared/theme";
import { useAuthStore } from "../../../store";
import { UserMissionService } from "../../mission/services/user-mission.service";
import type { UserMission } from "../../mission/types";
import { MissionStatus } from "../../mission/types/mission-status";
import { SurveyService } from "../../survey/services/survey.service";
import type { UserEmissionDto } from "../../survey/types";
import { useMissions } from "../hook/useMissions";

export default function CatalogueScreen() {
  const { missions, loading } = useMissions();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const userId = useAuthStore((state) => state.userId);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [sliderValues, setSliderValues] = useState([50, 800]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [mainEmissionCategory, setMainEmissionCategory] =
    useState<MissionCategory | null>(null);

  // Fetch user, their missions, and emissions
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const missions = await UserMissionService.getMissionsByUserId(userId);
        setUserMissions(missions);

        // Fetch user emissions to determine main emission category
        try {
          const emissions = await SurveyService.getLatestEmission(userId);
          const mainCategory = determineMainEmissionCategory(emissions);
          setMainEmissionCategory(mainCategory);
        } catch (err) {
          console.log("No emissions data found for user");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userId]);

  // Determine which emission category is the highest
  const determineMainEmissionCategory = (
    emissions: UserEmissionDto,
  ): MissionCategory | null => {
    const categories = [
      {
        category: MissionCategory.TRANSPORT,
        value: emissions.transportEmissions,
      },
      {
        category: MissionCategory.ALIMENTATION,
        value: emissions.foodEmissions,
      },
      { category: MissionCategory.LOGEMENT, value: emissions.housingEmissions },
      {
        category: MissionCategory.NUMERIQUE,
        value: emissions.digitalEmissions,
      },
    ];

    const maxCategory = categories.reduce((max, current) =>
      current.value > max.value ? current : max,
    );

    return maxCategory.value > 0 ? maxCategory.category : null;
  };

  const getMissionStatus = (missionId: number) => {
    const userMission = userMissions.find((um) => um.missionId === missionId);
    if (!userMission) return null;

    if (userMission.status === MissionStatus.COMPLETED) return "completed";
    if (
      userMission.status === MissionStatus.IN_PROGRESS ||
      userMission.status === MissionStatus.ASSIGNED
    )
      return "active";

    return null;
  };

  const truncateDescription = (text: string, maxLength = 30) => {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > 0) {
      return `${truncated.substring(0, lastSpaceIndex)}...`;
    }

    return `${truncated}...`;
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
  };

  // Separate suggested missions from others
  const { suggestedMissions, otherMissions } = useMemo(() => {
    const filtered = missions.filter((mission) => {
      const categoryMatch =
        selectedCategory === ALL_CATEGORIES ||
        mission.category === selectedCategory;
      const rewardMatch =
        mission.rewardPoints >= sliderValues[0] &&
        mission.rewardPoints <= sliderValues[1];
      return categoryMatch && rewardMatch;
    });

    // If no main category or specific category selected, show all in "other" section
    if (!mainEmissionCategory || selectedCategory !== ALL_CATEGORIES) {
      return { suggestedMissions: [], otherMissions: filtered };
    }

    // Separate suggested (main category) from other missions
    const suggested = filtered.filter(
      (m) => m.category === mainEmissionCategory,
    );
    const others = filtered.filter((m) => m.category !== mainEmissionCategory);

    return { suggestedMissions: suggested, otherMissions: others };
  }, [missions, selectedCategory, sliderValues, mainEmissionCategory]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Chargement des missions...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => bottomSheetRef.current?.expand()}
      >
        {/* text with filter icon outline */}
        <Text style={styles.filterButtonText}>
          <FontAwesome5 name="filter" size={16} color={theme.colors.text} />{" "}
          Filter
        </Text>
      </TouchableOpacity>

      <FlatList
        data={[...suggestedMissions, ...otherMissions]}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {suggestedMissions.length > 0 && (
              <View style={styles.sectionHeader}>
                <FontAwesome5
                  name="star"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.sectionTitle}>
                  Missions suggérées pour vous
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item, index }) => {
          const status = getMissionStatus(item.id);
          const isDisabled = status !== null;
          const isSuggested = index < suggestedMissions.length;
          const isFirstOther = index === suggestedMissions.length;

          return (
            <>
              {isFirstOther && otherMissions.length > 0 && (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Autres missions</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.missionBlock}
                onPress={() =>
                  !isDisabled && router.push(`/mission/detail/${item.id}`)
                }
                disabled={isDisabled}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.points}>{item.rewardPoints} points</Text>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>
                    {truncateDescription(item.description)}
                  </Text>
                  <Text style={styles.category}>{item.category}</Text>
                </View>
                <Image
                  source={
                    MISSION_CATEGORY_IMAGES[item.category as MissionCategory]
                  }
                  style={styles.categoryImage}
                  resizeMode="cover"
                />

                {isSuggested && (
                  <View style={styles.suggestedBadge}>
                    <FontAwesome5
                      name="star"
                      size={12}
                      color={theme.colors.background}
                    />
                  </View>
                )}

                {status === "completed" && (
                  <View style={styles.overlay}>
                    <View style={styles.overlayContent}>
                      <FontAwesome5
                        name="check-circle"
                        size={32}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.overlayText}>Terminée</Text>
                    </View>
                  </View>
                )}

                {status === "active" && (
                  <View style={styles.overlay}>
                    <View style={styles.overlayContent}>
                      <FontAwesome5
                        name="hourglass-half"
                        size={32}
                        color={theme.colors.primary}
                      />
                      <Text style={styles.overlayText}>En cours</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.colors.background }}
        activeOffsetY={[-10, 10]}
        failOffsetX={[-10, 10]}
      >
        <BottomSheetScrollView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Filtrer</Text>

          <Text style={styles.sectionTitle}>Categorie</Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === ALL_CATEGORIES &&
                  styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(ALL_CATEGORIES)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === ALL_CATEGORIES &&
                    styles.selectedCategoryButtonText,
                ]}
              >
                {ALL_CATEGORIES}
              </Text>
            </TouchableOpacity>
            {Object.values(MissionCategory).map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category &&
                    styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category &&
                      styles.selectedCategoryButtonText,
                  ]}
                >
                  {MISSION_CATEGORY_DISPLAY_NAMES[category]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Récompense</Text>
          <Text style={styles.subsectionTitle}>Points</Text>
          <MultiSlider
            values={sliderValues}
            onValuesChange={handleSliderChange}
            min={50}
            max={800}
            step={1}
            sliderLength={280}
            selectedStyle={{ backgroundColor: theme.colors.primary }}
            unselectedStyle={{ backgroundColor: theme.colors.outline }}
            markerStyle={{
              backgroundColor: theme.colors.primary,
              width: 10,
              height: 10,
              borderWidth: 0,
            }}
          />
          <Text style={styles.sliderValue}>
            {sliderValues[0]} Points - {sliderValues[1]} Points
          </Text>
        </BottomSheetScrollView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.md,
    },
    listContainer: {
      padding: theme.spacing.lg,
    },
    missionBlock: {
      backgroundColor: theme.colors.inputBackground,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      elevation: 2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
    },
    points: {
      fontSize: theme.fontSizes.md,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    filterButton: {
      backgroundColor: theme.colors.inputBackground,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
      margin: theme.spacing.md,
      alignSelf: "flex-start",
    },
    filterButtonText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.md,
      fontWeight: "bold",
    },
    bottomSheetContent: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    bottomSheetTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.text,
      marginVertical: theme.spacing.md,
    },
    subsectionTitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      marginVertical: theme.spacing.md,
    },
    categoryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    categoryButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.background,
      margin: theme.spacing.xs,
    },
    selectedCategoryButton: {
      backgroundColor: theme.colors.primary,
    },
    categoryButtonText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    selectedCategoryButtonText: {
      color: theme.colors.background,
    },
    slider: {
      width: "100%",
      height: 40,
    },
    sliderValue: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      textAlign: "center",
      marginVertical: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },
    categoryImage: {
      width: 120,
      height: 80,
      marginBottom: theme.spacing.sm,
      borderRadius: 8,
      overflow: "hidden",
    },
    category: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      marginTop: theme.spacing.sm,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      borderRadius: theme.borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    overlayContent: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    overlayText: {
      color: "#ffffff",
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    suggestedBadge: {
      position: "absolute",
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
    },
  });
