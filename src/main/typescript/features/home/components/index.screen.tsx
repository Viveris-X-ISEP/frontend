import { useRouter } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type Theme, useTheme } from "../../../shared/theme";
import { useSurveyStatus } from "../../survey/hooks";

// TODO: Replace with actual user data from store or API
const AVATAR_PLACEHOLDER =
  "https://api.dicebear.com/7.x/avataaars/png?seed=EcoWarrior&backgroundColor=f0f0f0";

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);
  const { hasCompleted, isLoading } = useSurveyStatus();

  const handleStartSurvey = () => {
    // Navigate to survey intro with isFirstTime=true since user hasn't completed it yet
    router.push("/survey?isFirstTime=true" as never);
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

        {/* User Profile Card - Figma Style */}
        <View style={styles.profileCard}>
          <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>EcoWarrior</Text>
            <Text style={styles.level}>Niveau 1</Text>
            <Text style={styles.points}>0 Points</Text>
          </View>
        </View>

        {/* No Data Message with Survey Button */}
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataTitle}>Pas de données !</Text>
          <Text style={styles.noDataSubtitle}>Calculons votre empreinte carbone.</Text>

          {/* Survey Button - Inside content area per Figma */}
          <TouchableOpacity style={styles.surveyButton} onPress={handleStartSurvey}>
            <Text style={styles.surveyButtonText}>Répondre au questionnaire</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Survey completed - show regular home screen
  // TODO: Implement full home screen with emissions data
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Accueil</Text>

      {/* User Profile Card - Figma Style */}
      <View style={styles.profileCard}>
        <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>EcoWarrior</Text>
          <Text style={styles.level}>Niveau 3</Text>
          <Text style={styles.points}>1200 Points</Text>
        </View>
      </View>

      {/* TODO: Add mission card, emissions chart, etc. */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Empreinte carbone et missions à implémenter</Text>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.lg
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.lg
    },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.xl
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      marginRight: theme.spacing.md
    },
    profileInfo: {
      flex: 1
    },
    username: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text
    },
    level: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary
    },
    points: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.primary
    },
    noDataContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    noDataTitle: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },
    noDataSubtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.7,
      marginBottom: theme.spacing.lg
    },
    surveyButton: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: "center",
      marginTop: theme.spacing.md
    },
    surveyButtonText: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    placeholderText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      opacity: 0.5,
      textAlign: "center"
    }
  });
