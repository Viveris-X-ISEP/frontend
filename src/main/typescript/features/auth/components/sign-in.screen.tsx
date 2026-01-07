import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { type Theme, useTheme } from "../../../shared/theme";
import { useSignIn } from "../hooks";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleSignIn, isLoading, error } = useSignIn();
  const { theme } = useTheme();

  const onSubmit = () => {
    handleSignIn({ email, password });
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Content de vous revoir !</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.input.placeholder}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Mot de passe"
          placeholderTextColor={theme.input.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <Link href="/auth/forgot-password" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Oubli de mot de passe ?</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.bottomContainer}>
        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Pas de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onSubmit}
          disabled={isLoading}
        >
          <Text style={styles.primaryButtonText}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
          <Text style={styles.secondaryButtonText}>Se connecter avec Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Dynamic styles based on theme
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    input: {
      backgroundColor: theme.input.background,
      color: theme.input.text,
      height: theme.input.height,
      borderRadius: theme.input.borderRadius,
      paddingHorizontal: theme.input.paddingHorizontal,
      marginBottom: theme.spacing.md,
      fontSize: theme.fontSizes.md,
    },
    passwordContainer: {
      position: "relative",
      marginBottom: theme.spacing.md,
    },
    passwordInput: {
      backgroundColor: theme.input.background,
      color: theme.input.text,
      height: theme.input.height,
      borderRadius: theme.input.borderRadius,
      paddingHorizontal: theme.input.paddingHorizontal,
      paddingRight: 50,
      fontSize: theme.fontSizes.md,
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 15,
    },
    link: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
      textAlign: "center",
      marginVertical: theme.spacing.sm,
    },
    error: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: "center",
    },
    bottomContainer: {
      flex: 1,
      justifyContent: "flex-end",
      marginBottom: theme.spacing.xl,
    },
    button: {
      height: 56,
      borderRadius: theme.borderRadius.full,
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.button.primary.background,
    },
    primaryButtonText: {
      color: theme.button.primary.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: "600",
    },
    secondaryButton: {
      backgroundColor: theme.button.secondary.background,
    },
    secondaryButtonText: {
      color: theme.button.secondary.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: "600",
    },
  });
