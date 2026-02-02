import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import { useAuthStore } from "../../../store";
import { getPasswordStrength } from "../../../utility";
import { UserService } from "../../user/services/user.service";

export default function PasswordScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAuthStore((state) => state.userId);
  const { unmetRules, isStrong } = getPasswordStrength(newPassword);
  const showPasswordRules = newPassword.length > 0 && unmetRules.length > 0;
  const passwordRulesText = showPasswordRules
    ? `Le mot de passe doit contenir :\n- ${unmetRules.join("\n- ")}`
    : "";

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!userId) {
      setError("Utilisateur non connecté");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!isStrong) {
      setError("Le mot de passe est trop faible");
      return;
    }

    setIsLoading(true);
    try {
      await UserService.changePassword(userId, {
        currentPassword,
        newPassword
      });
      setSuccess("Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Échec du changement de mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe actuel"
          placeholderTextColor={theme.input.placeholder}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrentPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowCurrentPassword(!showCurrentPassword)}
        >
          <MaterialCommunityIcons
            name={showCurrentPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Nouveau mot de passe"
          placeholderTextColor={theme.input.placeholder}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <MaterialCommunityIcons
            name={showNewPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {showPasswordRules && <Text style={styles.passwordRules}>{passwordRulesText}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmer le nouveau mot de passe"
          placeholderTextColor={theme.input.placeholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialCommunityIcons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Modification..." : "Modifier le mot de passe"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg
    },
    input: {
      backgroundColor: theme.input.background,
      color: theme.input.text,
      height: theme.input.height,
      borderRadius: theme.input.borderRadius,
      paddingHorizontal: theme.input.paddingHorizontal,
      marginBottom: theme.spacing.md,
      fontSize: theme.fontSizes.md
    },
    passwordContainer: {
      position: "relative",
      marginBottom: theme.spacing.md
    },
    passwordInput: {
      backgroundColor: theme.input.background,
      color: theme.input.text,
      height: theme.input.height,
      borderRadius: theme.input.borderRadius,
      paddingHorizontal: theme.input.paddingHorizontal,
      paddingRight: 50,
      fontSize: theme.fontSizes.md
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 15
    },
    button: {
      backgroundColor: theme.colors.primary,
      height: 56,
      borderRadius: theme.borderRadius.full,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.lg
    },
    buttonDisabled: {
      opacity: 0.6
    },
    buttonText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: "600"
    },
    error: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: "center"
    },
    success: {
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
      textAlign: "center"
    },
    passwordRules: {
      color: theme.colors.text,
      opacity: 0.7,
      fontSize: theme.fontSizes.sm,
      marginBottom: theme.spacing.md
    }
  });
