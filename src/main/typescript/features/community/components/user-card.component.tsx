import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import type { CommunityUser } from "../types";

interface UserCardProps {
  user: CommunityUser;
  onPress: () => void;
}

export function UserCard({ user, onPress }: UserCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const avatarUrl =
    user.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/png?seed=${user.username}`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.missions}>{user.missionsCompleted} missions accomplies</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Voir Profil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.outline
    },
    info: {
      flex: 1,
      marginLeft: theme.spacing.md
    },
    username: {
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
      color: theme.colors.text
    },
    missions: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: theme.spacing.xs
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md
    },
    buttonText: {
      fontSize: theme.fontSizes.sm,
      fontWeight: "600",
      color: theme.colors.background
    }
  });
