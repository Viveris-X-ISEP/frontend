import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useCommunityUserProfile } from "../hooks/useCommunityUserProfile";
import { UserPointsCard } from "./user-points-card.component";
import { UserStatCard } from "./user-stat-card.component";

export default function CommunityProfileScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { id } = useLocalSearchParams<{ id: string }>();

  const { profile, loading, error } = useCommunityUserProfile(id || "");

  const avatarUrl =
    profile?.profilePictureUrl ||
    `https://api.dicebear.com/7.x/avataaars/png?seed=${profile?.username || "User"}`;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error || "Profil non trouvé"}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profil</Text>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <Text style={styles.username}>{profile.username}</Text>
        </View>

        {/* Points Card */}
        <UserPointsCard points={profile.totalPoints} />

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <UserStatCard
            icon={<FontAwesome5 name="trophy" size={24} color={theme.colors.primary} />}
            value={profile.missionsCompleted}
            label="Missions complétées"
          />
          <UserStatCard
            icon={<Ionicons name="time" size={24} color="#FFA500" />}
            value={profile.activeMissions}
            label="En cours"
          />
          <UserStatCard
            icon={<MaterialIcons name="eco" size={24} color="#4ADE80" />}
            value={profile.totalMissions}
            label="Total missions"
          />
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
      padding: theme.spacing.lg
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    errorText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.error,
      textAlign: "center"
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: theme.spacing.xl
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      marginBottom: theme.spacing.md
    },
    username: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.spacing.md
    }
  });
