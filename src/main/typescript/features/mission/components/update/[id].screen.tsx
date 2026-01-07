import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme, type Theme } from "../../../../shared/theme";
import { useAuthStore } from "../../../../store";
import { UserService } from "../../../user/services/user.service";
import { UserMissionService } from "../../services/user-mission.service";
import { getMissionById } from "../../../missions/services/missions.service";
import { MaterialIcons } from "@expo/vector-icons";
import { MissionStatus } from "../../types/mission-status";

export default function MissionUpdateScreen() {
  const { id } = useLocalSearchParams();
  const missionId = parseInt(id as string);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const token = useAuthStore((state) => state.token);

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mission, setMission] = useState<any>(null);
  const [userMission, setUserMission] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const user = await UserService.getCurrentUser(token);
        setUserId(user.id);

        const [missionData, userMissionData] = await Promise.all([
          getMissionById(missionId),
          UserMissionService.getUserMission(user.id, missionId),
        ]);

        setMission(missionData);
        setUserMission(userMissionData);
        setProgress(userMissionData.completionRate || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
        Alert.alert("Erreur", "Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, missionId]);

  const handleIncrement = () => {
    if (mission && progress < mission.goal) {
      setProgress((prev) => Math.min(prev + 1, mission.goal));
    }
  };

  const handleDecrement = () => {
    setProgress((prev) => Math.max(prev - 1, 0));
  };

  const handleInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    if (mission) {
      setProgress(Math.min(Math.max(numValue, 0), mission.goal));
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);
    try {
      const dto: any = {
        completionRate: progress,
        updatedAt: new Date().toISOString(),
      };

      // If progress reaches goal, mark completed
      if (mission && progress >= mission.goal) {
        dto.status = MissionStatus.COMPLETED;
        dto.completedAt = new Date().toISOString();
      } else if (progress > 0) {
        dto.status = MissionStatus.IN_PROGRESS;
      }

      await UserMissionService.updateUserMission(userId, missionId, dto);

      Alert.alert("Succès", "Progression mise à jour avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.error("Error updating mission:", err);
      Alert.alert("Erreur", "Impossible de mettre à jour la progression");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!mission || !userMission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Mission non trouvée</Text>
      </View>
    );
  }

  const completionRate = mission.goal > 0 ? (progress / mission.goal) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.description}>{mission.description}</Text>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Progression actuelle</Text>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleDecrement}
                disabled={progress <= 0}
              >
                <MaterialIcons
                  name="remove"
                  size={24}
                  color={progress <= 0 ? theme.colors.outline : theme.colors.text}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={progress.toString()}
                onChangeText={handleInputChange}
                keyboardType="numeric"
                maxLength={mission.goal.toString().length}
              />

              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleIncrement}
                disabled={progress >= mission.goal}
              >
                <MaterialIcons
                  name="add"
                  size={24}
                  color={progress >= mission.goal ? theme.colors.outline : theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.statusText}>
              Statut actuel: {progress} / {mission.goal}{" "}
              {mission.goalUnit ? mission.goalUnit.toLowerCase() : ""}
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[styles.progressBarFill, { width: `${Math.min(completionRate, 100)}%` }]}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={theme.colors.background} />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingBottom: theme.spacing.md,
    },
    content: {
      padding: theme.spacing.lg,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    errorText: {
      color: "#ef4444",
      fontSize: theme.fontSizes.md,
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      opacity: 0.7,
    },
    inputSection: {
      marginBottom: theme.spacing.xl,
    },
    label: {
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.md,
    },
    controlButton: {
      width: 50,
      height: 50,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      width: 120,
      height: 50,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.inputBackground,
      color: theme.colors.text,
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      textAlign: "center",
      paddingHorizontal: theme.spacing.sm,
    },
    statusSection: {
      marginBottom: theme.spacing.xl,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.md,
    },
    statusText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontWeight: "600",
      textAlign: "center",
    },
    progressBarBackground: {
      width: "100%",
      height: 12,
      backgroundColor: theme.colors.outline,
      borderRadius: theme.borderRadius.full,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      marginTop: theme.spacing.lg,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: "bold",
    },
    header: {
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    closeButton: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.sm,
    },
  });
