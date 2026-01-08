import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import ActiveMissionsScreen from "./active.screen";
import CatalogueScreen from "./catalogue.screen";

export default function MissionsLayoutScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState("catalogue");

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Missions</Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={[styles.menuButton]} onPress={() => setActiveTab("active")}>
          <Text
            style={[
              styles.menuButtonText,
              activeTab === "active"
                ? { color: theme.colors.text }
                : { color: theme.colors.primary }
            ]}
          >
            Active Missions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuButton]} onPress={() => setActiveTab("catalogue")}>
          <Text
            style={[
              styles.menuButtonText,
              activeTab === "catalogue"
                ? { color: theme.colors.text }
                : { color: theme.colors.primary }
            ]}
          >
            Mission Catalogue
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "active" ? <ActiveMissionsScreen /> : <CatalogueScreen />}
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginVertical: theme.spacing.lg
    },
    menuContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
      paddingBottom: theme.spacing.sm
    },
    menuButton: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      marginHorizontal: theme.spacing.sm
    },
    menuButtonText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary,
      fontWeight: "bold"
    },
    activeButtonText: {
      color: theme.colors.background
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      borderBottomWidth: 10,
      borderBottomColor: theme.colors.outline
    }
  });
