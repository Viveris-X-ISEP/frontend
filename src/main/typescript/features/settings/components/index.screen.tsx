import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import { useSignOut } from "../../auth/hooks";

export default function SettingsScreen() {
  const { handleSignOut } = useSignOut();
  const { theme, mode } = useTheme();
  const router = useRouter();

  const styles = createStyles(theme);

  // Get display value for theme
  const getThemeDisplayValue = () => {
    switch (mode) {
      case "light":
        return "Clair";
      case "dark":
        return "Sombre";
      case "system":
        return "Système";
    }
  };

  // TODO: Implement language store - placeholder for now
  const languageDisplayValue = "Français";

  return (
    <View style={styles.container}>
      {/* Profil Section */}
      <Text style={styles.sectionTitle}>Profil</Text>

      <TouchableOpacity style={styles.row} onPress={() => router.push("/(tabs)/settings/password")}>
        <Text style={styles.rowText}>Changer de mot de passe</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push("/(tabs)/settings/notifications")}
      >
        <Text style={styles.rowText}>Gérer les notifications</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
        <Text style={styles.logoutArrow}>→</Text>
      </TouchableOpacity>

      {/* Personnalisation Section */}
      <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Personnalisation</Text>

      <TouchableOpacity style={styles.row} onPress={() => router.push("/(tabs)/settings/theme")}>
        <Text style={styles.rowText}>Thème</Text>
        <Text style={styles.rowValue}>{getThemeDisplayValue()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => router.push("/(tabs)/settings/language")}>
        <Text style={styles.rowText}>Langage</Text>
        <Text style={styles.rowValue}>{languageDisplayValue}</Text>
      </TouchableOpacity>
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
      paddingBottom: 0
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.md
    },
    sectionSpacing: {
      marginTop: theme.spacing.xl
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.md
    },
    rowText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text
    },
    rowValue: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text
    },
    arrow: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.text
    },
    logoutText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.error
    },
    logoutArrow: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.error
    }
  });
