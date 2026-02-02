import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useAuthStore } from "../../../store/auth-store";
import {
  calculateCompletedPoints,
  calculateLevel,
  calculateTotalPoints,
  getLevelProgress
} from "../../../utility";
import { useActiveMissions } from "../../mission/hooks/useActiveMissions";
import { getRewardImage } from "../../reward/constants/reward-images";
import type { RewardDto } from "../../reward/types";
import { useUser } from "../../user/hooks/useUser";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { userId, signOut } = useAuthStore();
  const { user, loading: userLoading } = useUser(userId ?? undefined);
  const { missions } = useActiveMissions(userId);

  // Calculate user stats
  const totalPoints = missions ? calculateTotalPoints(missions) : 0;
  const completedPoints = missions ? calculateCompletedPoints(missions) : 0;
  const userLevel = calculateLevel(totalPoints);
  const levelProgress = getLevelProgress(totalPoints);

  const AVATAR_PLACEHOLDER =
    user?.profilePictureUrl ||
    `https://api.dicebear.com/7.x/avataaars/png?seed=${user?.username || "User"}&backgroundColor=f0f0f0`;

  const handleLogout = async () => {
    await signOut();
    router.replace("/auth/sign-in" as never);
  };

  const completedMissions = missions?.filter((m) => m.status === "COMPLETED").length || 0;
  const inProgressMissions = missions?.filter((m) => m.status === "IN_PROGRESS").length || 0;

  // Rewards
  const [availableRewards, setAvailableRewards] = useState<RewardDto[] | null>(null);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [selectedReward, setSelectedReward] = useState<RewardDto | null>(null);
  const [rewardModalVisible, setRewardModalVisible] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) return;
      setRewardsLoading(true);
      try {
        const { RewardService } = await import("../../reward/services");
        const res = await RewardService.getRewardsByPointsCostLessThanEqual(totalPoints);
        setAvailableRewards(res);
      } catch (err) {
        console.error("Failed to load rewards by points:", err);
      } finally {
        setRewardsLoading(false);
      }
    };

    fetchRewards();
  }, [user?.id, totalPoints]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.md }}
      >
        <Text style={styles.title}>Profil</Text>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
          <Text style={styles.username}>{user?.username || "Utilisateur"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Points Card - Large Display */}
        <View style={styles.pointsCard}>
          <FontAwesome5 name="star" size={32} color={theme.colors.primary} />
          <Text style={styles.pointsValue}>{totalPoints}</Text>
          <Text style={styles.pointsLabel}>Points totaux</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <FontAwesome5 name="trophy" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>{completedMissions}</Text>
            <Text style={styles.statLabel}>Missions complétées</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#FFA500" />
            <Text style={styles.statValue}>{inProgressMissions}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="eco" size={24} color="#4ADE80" />
            <Text style={styles.statValue}>{missions?.length || 0}</Text>
            <Text style={styles.statLabel}>Total missions</Text>
          </View>
        </View>

        {/* Menu Options */}
        {/* Rewards */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Text
            style={[styles.title, { fontSize: theme.fontSizes.lg, marginBottom: theme.spacing.md }]}
          >
            Récompenses
          </Text>

          {rewardsLoading ? (
            <Text>Chargement...</Text>
          ) : !availableRewards || availableRewards.length === 0 ? (
            <Text style={{ color: theme.colors.text, opacity: 0.7 }}>Aucune récompense</Text>
          ) : (
            <FlatList
              data={availableRewards}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: theme.spacing.sm }}
              keyExtractor={(i) => i.id.toString()}
              renderItem={({ item }) => {
                // Compact badge: only image + title below
                const imgSource = getRewardImage(item.title, item.id);

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedReward(item);
                      setRewardModalVisible(true);
                    }}
                    style={styles.badgeButton}
                  >
                    <View style={styles.badgeImageWrapper}>
                      <Image source={imgSource} style={styles.badgeImage} />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            // Modal for reward details
          )}
        </View>

        {/* Reward details modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={rewardModalVisible}
          onRequestClose={() => setRewardModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              padding: theme.spacing.lg
            }}
            activeOpacity={1}
            onPressOut={() => setRewardModalVisible(false)}
          >
            <View
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg
              }}
            >
              {selectedReward ? (
                <>
                  <Image
                    source={getRewardImage(selectedReward.title, selectedReward.id)}
                    style={{
                      width: 120,
                      height: 120,
                      alignSelf: "center",
                      borderRadius: 12
                    }}
                  />
                  <Text
                    style={{
                      fontSize: theme.fontSizes.lg,
                      fontWeight: "bold",
                      color: theme.colors.text,
                      marginTop: theme.spacing.md,
                      textAlign: "center"
                    }}
                  >
                    {selectedReward.title || `Récompense #${selectedReward.id}`}
                  </Text>
                  {selectedReward.description ? (
                    <Text
                      style={{
                        color: theme.colors.text,
                        opacity: 0.8,
                        marginTop: theme.spacing.sm
                      }}
                    >
                      {selectedReward.description}
                    </Text>
                  ) : null}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: theme.spacing.md
                    }}
                  >
                    <Text style={{ color: theme.colors.text }}>Coût</Text>
                    <Text style={{ color: theme.colors.text }}>
                      {selectedReward.pointsCost ?? 0} pts
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      marginTop: theme.spacing.md,
                      backgroundColor: theme.colors.primary,
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.md,
                      alignItems: "center"
                    }}
                    onPress={() => setRewardModalVisible(false)}
                  >
                    <Text
                      style={{
                        color: theme.colors.background,
                        fontWeight: "bold"
                      }}
                    >
                      Fermer
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/settings" as never)}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
              <Text style={styles.menuText}>Paramètres</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <MaterialIcons name="logout" size={24} color="#EF4444" />
              <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#EF4444" />
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
      color: theme.colors.text,
      marginBottom: theme.spacing.xs
    },
    email: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7
    },
    pointsCard: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: "center",
      marginBottom: theme.spacing.lg
    },
    pointsValue: {
      fontSize: 48,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginTop: theme.spacing.sm
    },
    pointsLabel: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: theme.spacing.xs
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.md
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      alignItems: "center"
    },
    statValue: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: theme.spacing.sm
    },
    statLabel: {
      fontSize: theme.fontSizes.xs,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginTop: theme.spacing.xs
    },
    menuContainer: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      overflow: "hidden"
    },
    menuItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background
    },
    menuLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md
    },
    menuText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      fontWeight: "500"
    },
    /* Badges */
    badgeButton: {
      marginRight: theme.spacing.md,
      alignItems: "center"
    },
    badgeImageWrapper: {
      width: 80,
      height: 80,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden"
    },
    badgeImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover"
    },
    logoutText: {
      color: "#EF4444"
    }
  });
