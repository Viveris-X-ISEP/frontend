import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";

interface SurveyPromptModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SurveyPromptModal({ visible, onClose }: SurveyPromptModalProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const styles = createStyles(theme);

  const handleStartSurvey = () => {
    onClose();
    // Navigate to survey intro with isFirstTime=false since this is a re-take prompt
    router.push("/survey?isFirstTime=false" as never);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="leaf" size={48} color={theme.colors.primary} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Mise à jour de votre empreinte</Text>

          {/* Message */}
          <Text style={styles.message}>
            Cela fait plus d&apos;un mois depuis votre dernier sondage. Prenez quelques minutes pour
            mettre à jour votre empreinte carbone et obtenir des défis personnalisés plus précis.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleStartSurvey}>
              <Text style={styles.primaryButtonText}>Mettre à jour maintenant</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      width: "100%",
      maxWidth: 400,
      alignItems: "center"
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.inputBackground,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.lg
    },
    title: {
      fontSize: theme.fontSizes.xl,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: theme.spacing.md
    },
    message: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      textAlign: "center",
      lineHeight: theme.fontSizes.md * 1.5,
      opacity: 0.8,
      marginBottom: theme.spacing.xl
    },
    buttonContainer: {
      width: "100%",
      gap: theme.spacing.md
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.md,
      alignItems: "center"
    },
    primaryButtonText: {
      color: theme.colors.background,
      fontSize: theme.fontSizes.md,
      fontWeight: "600"
    },
    secondaryButton: {
      borderRadius: theme.borderRadius.full,
      paddingVertical: theme.spacing.md,
      alignItems: "center"
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.md,
      fontWeight: "500",
      opacity: 0.7
    }
  });
