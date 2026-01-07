import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTheme, type Theme } from "../../../../shared/theme";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useMission } from "../../../missions/hook/useMissions";
import { useCreateUserMission } from "../../hooks";
import { useAuthStore } from "../../../../store";
import { UserService } from "../../../user/services/user.service";
import { MissionStatus } from "../../types/mission-status";

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mission, loading } = useMission(Number(id));
  const token = useAuthStore((state) => state.token);
  const { create: createUserMission } = useCreateUserMission();

  const handleEmbark = async () => {
    if (!token) {
      Alert.alert("Erreur", "Veuillez vous connecter pour commencer cette mission");
      return;
    }

    if (!mission) {
      Alert.alert("Erreur", "Mission introuvable");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get current user
      const user = await UserService.getCurrentUser(token);

      const now = new Date();
      const payload = {
        userId: user.id,
        missionId: mission.id,
        status: MissionStatus.IN_PROGRESS,
        completionRate: 0,
        startedAt: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      const result = await createUserMission(payload);

      if (result) {
        Alert.alert("Succès", "Mission ajoutée à vos missions actives !", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/missions/active"),
          },
        ]);
      } else {
        Alert.alert("Erreur", "Impossible d'ajouter cette mission");
      }
    } catch (error) {
      console.error("Error embarking on mission:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryImages = {
    Logement: require("../../../../../resources/images/missions_categories/logement.png"),
    Alimentation: require("../../../../../resources/images/missions_categories/alimentation.png"),
    Numérique: require("../../../../../resources/images/missions_categories/numerique.png"),
    Transport: require("../../../../../resources/images/missions_categories/transport.png"),
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!mission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Mission not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <Image
          source={categoryImages[mission.category as keyof typeof categoryImages]}
          style={styles.headerImage}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={styles.description}>{mission.description}</Text>

          <Text style={styles.sectionTitle}>Mission Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="card-giftcard" size={24} color={theme.colors.text} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Rewards</Text>
              <Text style={styles.detailValue}>{mission.rewardPoints} Points</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.startButton, isSubmitting && styles.startButtonDisabled]}
          onPress={handleEmbark}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.background} />
          ) : (
            <Text style={styles.startButtonText}>Embark!</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    },
    errorText: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text,
    },
    header: {
      height: 60,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },

    scrollView: {
      flex: 1,
    },
    headerImage: {
      width: "100%",
      height: 220,
    },
    content: {
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    description: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 45,
      height: 45,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.md,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.sm,
    },
    detailContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    detailLabel: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    detailValue: {
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
      color: theme.colors.text,
    },
    footer: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      alignItems: "center",
    },
    startButtonText: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.background,
    },
    startButtonDisabled: {
      opacity: 0.6,
    },
  });
