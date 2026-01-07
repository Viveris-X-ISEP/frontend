import React, { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useMissions } from "../hook/useMissions";
import { useTheme, type Theme } from "../../../shared/theme";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { Image } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../../store";
import { UserService } from "../../user/services/user.service";
import { UserMissionService } from "../../mission/services/user-mission.service";
import { MissionStatus } from "../../mission/types/mission-status";
import { UserMission } from "../../mission/types";

export default function CatalogueScreen() {
  const { missions, loading } = useMissions();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const token = useAuthStore((state) => state.token);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [sliderValues, setSliderValues] = useState([50, 800]);
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // Fetch user and their missions
  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const user = await UserService.getCurrentUser(token);
        setUserId(user.id);

        const missions = await UserMissionService.getMissionsByUserId(user.id);
        setUserMissions(missions);
      } catch (err) {
        console.error("Error fetching user missions:", err);
      }
    };

    fetchUserData();
  }, [token]);

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

  const truncateDescription = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  };

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
  };

  const categoryImages = {
    Logement: require("../../../../resources/images/missions_categories/logement.png"),
    Alimentation: require("../../../../resources/images/missions_categories/alimentation.png"),
    Numérique: require("../../../../resources/images/missions_categories/numerique.png"),
    Transport: require("../../../../resources/images/missions_categories/transport.png"),
  };

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      const categoryMatch = selectedCategory === "Tout" || mission.category === selectedCategory;
      const rewardMatch =
        mission.rewardPoints >= sliderValues[0] && mission.rewardPoints <= sliderValues[1];
      return categoryMatch && rewardMatch;
    });
  }, [missions, selectedCategory, sliderValues]);

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
          <FontAwesome5 name="filter" size={16} color={theme.colors.text} /> Filter
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredMissions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const status = getMissionStatus(item.id);
          const isDisabled = status !== null;

          return (
            <TouchableOpacity
              style={styles.missionBlock}
              onPress={() => !isDisabled && router.push(`/mission/detail/${item.id}`)}
              disabled={isDisabled}
            >
              <View style={styles.textContainer}>
                <Text style={styles.points}>{item.rewardPoints} points</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{truncateDescription(item.description)}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Image
                source={categoryImages[item.category as keyof typeof categoryImages]}
                style={styles.categoryImage}
                resizeMode="cover"
              />

              {status === "completed" && (
                <View style={styles.overlay}>
                  <View style={styles.overlayContent}>
                    <FontAwesome5 name="check-circle" size={32} color={theme.colors.primary} />
                    <Text style={styles.overlayText}>Terminée</Text>
                  </View>
                </View>
              )}

              {status === "active" && (
                <View style={styles.overlay}>
                  <View style={styles.overlayContent}>
                    <FontAwesome5 name="hourglass-half" size={32} color={theme.colors.primary} />
                    <Text style={styles.overlayText}>En cours</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
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
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Filtrer</Text>

          <Text style={styles.sectionTitle}>Categorie</Text>
          <View style={styles.categoryContainer}>
            {["Tout", "Logement", "Alimentation", "Numérique", "Transport"].map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
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
        </BottomSheetView>
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
      justifyContent: "space-between",
    },
    categoryButton: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.outline,
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
  });
