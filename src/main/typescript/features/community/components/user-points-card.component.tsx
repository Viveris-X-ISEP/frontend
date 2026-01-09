import { FontAwesome5 } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

interface UserPointsCardProps {
  points: number;
}

export function UserPointsCard({ points }: UserPointsCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <FontAwesome5 name="star" size={32} color={theme.colors.primary} />
      <Text style={styles.value}>{points}</Text>
      <Text style={styles.label}>Points totaux</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: "center",
      marginBottom: theme.spacing.lg
    },
    value: {
      fontSize: 48,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginTop: theme.spacing.sm
    },
    label: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: theme.spacing.xs
    }
  });
