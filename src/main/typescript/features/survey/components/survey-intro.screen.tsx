import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, type Theme } from "../../../shared/theme";

export default function SurveyIntroScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const handleClose = () => {
    router.back();
  };

  const handleStart = () => {
    router.push("/survey/questions" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Ionicons
          name="close"
          size={theme.fontSizes.xxl}
          color={theme.colors.text}
        />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Il est temps pour un nouveau départ !</Text>
        <Text style={styles.subtitle}>
          Cela fait un moment que vous n&apos;avez pas mis à jour votre
          empreinte carbone. Refaites le sondage pour un suivi plus précis et
          des défis personnalisés.
        </Text>

        {/* Earth Illustration */}
        <View style={styles.imageContainer}>
          {/* TODO: Replace with actual Earth image asset */}
          <View style={styles.imagePlaceholder}>
            <Ionicons name="earth" size={120} color={theme.colors.primary} />
          </View>
        </View>
      </View>

      {/* Start Button */}
      <TouchableOpacity style={styles.startButton} onPress={handleStart}>
        <Text style={styles.startButtonText}>Démarrer le questionnaire</Text>
      </TouchableOpacity>
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
    closeButton: {
      alignSelf: "flex-end",
      padding: theme.spacing.sm,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md,
    },
    subtitle: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      textAlign: "center",
      lineHeight: theme.fontSizes.md * 1.5,
      opacity: 0.8,
    },
    imageContainer: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    imagePlaceholder: {
      width: 250,
      height: 250,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      alignItems: "center",
      justifyContent: "center",
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      paddingVertical: theme.spacing.md,
      alignItems: "center",
      marginBottom: theme.spacing.lg,
    },
    startButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.lg,
      fontWeight: "600",
    },
  });
