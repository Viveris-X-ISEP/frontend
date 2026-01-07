import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

interface LanguageOption {
  value: string;
  label: string;
}

const languageOptions: LanguageOption[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

export default function LanguageScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // TODO: Implement language store
  const currentLanguage = "fr";

  const handleLanguageSelect = (languageCode: string) => {
    // TODO: Implement language switching
    console.log("Language selected:", languageCode);
  };

  return (
    <View style={styles.container}>
      {languageOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.row}
          onPress={() => handleLanguageSelect(option.value)}
        >
          <Text style={styles.rowText}>{option.label}</Text>
          {currentLanguage === option.value && <Text style={styles.checkmark}>✓</Text>}
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
