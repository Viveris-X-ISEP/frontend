import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

type ThemeOption = "light" | "dark" | "system";

interface ThemeOptionConfig {
  value: ThemeOption;
  label: string;
}

const themeOptions: ThemeOptionConfig[] = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
  { value: "system", label: "Système" },
];

export default function ThemeScreen() {
  const { theme, mode, setMode } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {themeOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.row}
          onPress={() => setMode(option.value)}
        >
          <Text style={styles.rowText}>{option.label}</Text>
          {mode === option.value && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    rowText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
    },
    checkmark: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
  });
