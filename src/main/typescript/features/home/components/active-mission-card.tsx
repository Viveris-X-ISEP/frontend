import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import type { UserMission } from "../../mission/types";

interface ActiveMissionCardProps {
  userMission: UserMission | null;
}

export const ActiveMissionCard = ({ userMission }: ActiveMissionCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  if (!userMission || !userMission.mission) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mission en cours</Text>
        <Text style={styles.noMission}>Aucune mission active</Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push("/(tabs)/missions" as never)}
        >
          <Text style={styles.browseButtonText}>Parcourir les missions</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { mission, completionRate, status } = userMission;

  const handlePress = () => {
    router.push("/(tabs)/missions/active" as never);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.title}>Mission en cours</Text>
        <FontAwesome5 name="trophy" size={20} color={theme.colors.primary} />
      </View>

      <Text style={styles.missionTitle}>{mission.title}</Text>
      <Text style={styles.missionDescription} numberOfLines={2}>
        {mission.description}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${Math.min(completionRate, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>{completionRate.toFixed(0)}%</Text>
      </View>

      {/* Mission Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Catégorie</Text>
          <Text style={styles.detailValue}>{mission.category}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Points</Text>
          <Text style={styles.detailValue}>{mission.rewardPoints}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Statut</Text>
          <Text style={styles.detailValue}>{status === "IN_PROGRESS" ? "En cours" : status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md
    },
    title: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.text
    },
    missionTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    missionDescription: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      marginBottom: theme.spacing.lg
    },
    progressContainer: {
      marginBottom: theme.spacing.lg
    },
    progressBackground: {
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.full,
      overflow: "hidden",
      marginBottom: theme.spacing.xs
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full
    },
    progressText: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      textAlign: "right"
    },
    detailsContainer: {
      flexDirection: "row",
      justifyContent: "space-between"
    },
    detailItem: {
      flex: 1,
      alignItems: "center"
    },
    detailLabel: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.6,
      marginBottom: theme.spacing.xs
    },
    detailValue: {
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
      color: theme.colors.primary
    },
    noMission: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.5,
      textAlign: "center",
      marginVertical: theme.spacing.lg
    },
    browseButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: "center"
    },
    browseButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    }
  });
