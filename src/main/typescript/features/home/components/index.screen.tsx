import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useAuthStore } from "../../../store/auth-store";
import { calculateCompletedPoints, calculateLevel, calculateTotalPoints } from "../../../utility";
import { useActiveMissions } from "../../mission/hooks/useActiveMissions";
import { useLatestEmissions, useSurveyStatus } from "../../survey/hooks";
import { useUser } from "../../user/hooks/useUser";
import { ActiveMissionCard } from "./active-mission-card";
import { EmissionsCard } from "./emissions-card";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const [refreshKey, setRefreshKey] = useState(0);
  const { hasCompleted, isLoading } = useSurveyStatus();
  const { token, userId } = useAuthStore();
  const { user, loading: userLoading } = useUser(undefined, token || undefined);
  const { emissions, loading: emissionsLoading } = useLatestEmissions(userId, refreshKey);
  const {
    missions,
    activeMission,
    loading: missionsLoading
  } = useActiveMissions(userId, refreshKey);

  // Calculate dynamic user stats - with safety checks
  const totalPoints = missions ? calculateTotalPoints(missions) : 0;
  const completedPoints = missions ? calculateCompletedPoints(missions) : 0;
  const userLevel = calculateLevel(totalPoints);

  // Auto-refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only refresh if user is logged in
      if (userId) {
        setRefreshKey((prev) => prev + 1);
      }
    }, [userId])
  );

  const AVATAR_PLACEHOLDER =
    user?.profilePictureUrl ||
    `https://api.dicebear.com/7.x/avataaars/png?seed=${user?.username || "User"}&backgroundColor=f0f0f0`;

  const handleStartSurvey = () => {
    // Navigate to survey intro with isFirstTime=true since user hasn't completed it yet
    router.push("/survey?isFirstTime=true" as never);
  };

  // Show loading state while checking survey status or user data
  if (isLoading || userLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Survey not completed - show prompt to take survey
  if (!hasCompleted) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Text style={styles.title}>Accueil</Text>

        {/* User Profile Card - Figma Style */}
        <View style={styles.profileCard}>
          <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.username || "Utilisateur"}</Text>
            <Text style={styles.level} />
            <Text style={styles.points} />
          </View>
        </View>

        {/* No Data Message with Survey Button */}
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataTitle}>Pas de données !</Text>
          <Text style={styles.noDataSubtitle}>Calculons votre empreinte carbone.</Text>

          {/* Survey Button - Inside content area per Figma */}
          <TouchableOpacity style={styles.surveyButton} onPress={handleStartSurvey}>
            <Text style={styles.surveyButtonText}>Répondre au questionnaire</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Survey completed - show regular home screen
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Accueil</Text>

        {/* User Profile Card - Figma Style */}
        <View style={styles.profileCard}>
          <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.username || "Utilisateur"}</Text>
            {/* PAS DE SYSTEME DE NIVEAU POUR L'INSTANT
            <Text style={styles.level}>Niveau {userLevel}</Text>
            */}
            <Text style={styles.points}>{completedPoints} Points</Text>
          </View>
        </View>

        {/* Active Mission Card */}
        {missionsLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <ActiveMissionCard userMission={activeMission} />
        )}

        {/* Emissions Chart */}
        {emissionsLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <EmissionsCard emissions={emissions} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
      paddingBottom: 0
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xl
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      marginRight: theme.spacing.md
    },
    profileInfo: {
      flex: 1
    },
    username: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text
    },
    level: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary
    },
    points: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary
    },
    noDataContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    noDataTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    noDataSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      marginBottom: theme.spacing.lg
    },
    surveyButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: "center",
      marginTop: theme.spacing.md
    },
    surveyButtonText: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    }
  });
