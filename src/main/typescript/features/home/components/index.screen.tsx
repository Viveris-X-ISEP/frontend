import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, type Theme } from "../../../shared/theme";
import { useSurveyStatus } from "../../survey/hooks";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { hasCompleted, isLoading } = useSurveyStatus();

  const handleStartSurvey = () => {
    router.push("/survey" as never);
  };

  // Show loading state while checking survey status
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Survey not completed - show prompt to take survey
  if (!hasCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Accueil</Text>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons
              name="person"
              size={theme.fontSizes.xxl}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.username}>EcoWarrior</Text>
            <Text style={styles.level}>Niveau 1</Text>
            <Text style={styles.points}>0 Points</Text>
          </View>
        </View>

        {/* No Data Message */}
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataTitle}>Pas de données !</Text>
          <Text style={styles.noDataSubtitle}>
            Calculons votre empreinte carbone.
          </Text>
        </View>

        {/* Survey Button */}
        <TouchableOpacity
          style={styles.surveyButton}
          onPress={handleStartSurvey}
        >
          <Text style={styles.surveyButtonText}>Répondre au questionnaire</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Survey completed - show regular home screen
  // TODO: Implement full home screen with emissions data
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Accueil</Text>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name="person"
            size={theme.fontSizes.xxl}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>EcoWarrior</Text>
          <Text style={styles.level}>Niveau 3</Text>
          <Text style={styles.points}>1200 Points</Text>
        </View>
      </View>

      {/* TODO: Add mission card, emissions chart, etc. */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>
          Empreinte carbone et missions à implémenter
        </Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    avatarPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    username: {
      fontSize: theme.fontSizes.lg,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    level: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary,
    },
    points: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.primary,
    },
    noDataContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    noDataTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    noDataSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
    },
    surveyButton: {
      backgroundColor: theme.colors.text,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },
    surveyButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: "600",
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholderText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.5,
      textAlign: "center",
    },
  });
