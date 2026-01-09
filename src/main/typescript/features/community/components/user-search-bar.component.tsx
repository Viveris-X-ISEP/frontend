import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

interface UserSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function UserSearchBar({ value, onChangeText }: UserSearchBarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={theme.colors.text} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher des utilisateurs"
        placeholderTextColor={`${theme.colors.text}99`}
      />
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.lg
    },
    icon: {
      marginRight: theme.spacing.sm,
      opacity: 0.7
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: theme.fontSizes.md,
      color: theme.colors.text
    }
  });
