import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  MISSION_CATEGORY_IMAGES,
  type MissionCategory
} from "../../../shared/constants/mission-categories";
import { type Theme, useTheme } from "../../../shared/theme";
import { useAuthStore } from "../../../store";
import { useDeleteUserMission } from "../../mission/hooks";
import type { UserMission } from "../../mission/types";
import { MissionStatus } from "../../mission/types/mission-status";
import type { Mission as MissionsMission } from "../../missions/types";
import { UserService } from "../../user/services/user.service";

export default function ActiveScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const token = useAuthStore((state) => state.token);

  const [userId, setUserId] = useState<number | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  type EnrichedUserMission = UserMission & { mission?: MissionsMission };
  const [missions, setMissions] = useState<EnrichedUserMission[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { deleteUserMission, loading: deleteLoading } = useDeleteUserMission();

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const user = await UserService.getCurrentUser(token);
        setUserId(user.id);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [token]);

  const fetchMissions = React.useCallback(
    async (isRefreshing = false) => {
      if (!userId) return;

      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setMissionsLoading(true);
      }
      setError(null);

      try {
        const { UserMissionService } = await import("../../mission/services/user-mission.service");
        const { getMissionById } = await import("../../missions/services/missions.service");

        const userMissions = await UserMissionService.getMissionsByUserId(userId);

        const enrichedMissions = await Promise.all(
          userMissions.map(async (userMission) => {
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
      } catch (err) {
        console.error("Error fetching missions:", err);
        setError("Impossible de charger les missions");
      } finally {
        if (isRefreshing) {
          setRefreshing(false);
        } else {
          setMissionsLoading(false);
        }
      }
    },
    [userId]
  );

  React.useEffect(() => {
    fetchMissions();
  }, [fetchMissions]);

  // Refresh missions when screen comes into focus (e.g., after update screen)
  useFocusEffect(
    React.useCallback(() => {
      fetchMissions();
    }, [fetchMissions])
  );

  const onRefresh = React.useCallback(() => {
    fetchMissions(true);
  }, [fetchMissions]);

  const truncateDescription = (text: string, maxLength = 30) => {
    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > 0) {
      return `${truncated.substring(0, lastSpaceIndex)}...`;
    }

    return `${truncated}...`;
  };

  const handleCancel = async (missionId: number) => {
    if (!userId) return;

    Alert.alert("Annuler la mission", "Êtes-vous sûr de vouloir annuler cette mission ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Oui",
        onPress: async () => {
          const success = await deleteUserMission(userId, missionId);
          if (success) {
            setMissions(missions.filter((m) => m.missionId !== missionId));
            Alert.alert("Succès", "Mission annulée avec succès");
          } else {
            Alert.alert("Erreur", "Impossible d'annuler la mission");
          }
        }
      }
    ]);
  };

  const handleUpdate = (missionId: number) => {
    if (!userId) return;
    router.push(`/mission/update/${missionId}`);
  };

  if (loadingUser || missionsLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Veuillez vous connecter pour voir vos missions actives</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (missions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Aucune mission active</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={missions.filter((m) => m.status !== MissionStatus.COMPLETED)}
        keyExtractor={(item) => `${item.userId}-${item.missionId}`}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => {
          if (!item.mission) return null;

          const completionRate =
            item.mission.goal > 0 ? (item.completionRate / item.mission.goal) * 100 : 0;

          return (
            <View style={styles.missionBlock}>
              <Image
                source={MISSION_CATEGORY_IMAGES[item.mission.category as MissionCategory]}
                style={styles.categoryImage}
                resizeMode="cover"
              />

              <Text style={styles.title}>{item.mission.title}</Text>
              <Text style={styles.description}>
                {truncateDescription(item.mission.description)}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => handleCancel(item.missionId)}
                  disabled={deleteLoading}
                >
                  <Text style={styles.buttonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.updateButton]}
                  onPress={() => handleUpdate(item.missionId)}
                >
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {item.completionRate} / {item.mission.goal}{" "}
                  {item.mission.goalUnit?.toLowerCase() || ""}
                </Text>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[styles.progressBarFill, { width: `${Math.min(completionRate, 100)}%` }]}
                  />
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background
    },
    emptyText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.md
    },
    errorText: {
      color: "#ef4444",
      fontSize: theme.fontSizes.md
    },
    listContainer: {
      padding: theme.spacing.lg
    },
    missionBlock: {
      backgroundColor: theme.colors.inputBackground,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      elevation: 2
    },
    categoryImage: {
      width: "100%",
      height: 120,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden"
    },
    title: {
      fontSize: theme.fontSizes.md,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    description: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      opacity: 0.7
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md
    },
    button: {
      alignItems: "center",
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      justifyContent: "center"
    },
    cancelButton: {
      backgroundColor: "#ef4444"
    },
    updateButton: {
      backgroundColor: theme.colors.primary
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.xs,
      fontWeight: "600"
    },
    progressContainer: {
      marginTop: theme.spacing.sm
    },
    progressText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      fontWeight: "600"
    },
    progressBarBackground: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.outline,
      borderRadius: theme.borderRadius.full,
      overflow: "hidden"
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full
    }
  });
