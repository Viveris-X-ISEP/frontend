import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

interface UserStatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
}

export function UserStatCard({ icon, value, label }: UserStatCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      {icon}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: "center"
    },
    value: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: theme.spacing.sm
    },
    label: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.7,
      textAlign: "center",
      marginTop: theme.spacing.xs
    }
  });
