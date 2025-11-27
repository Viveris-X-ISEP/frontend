import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useSignUp } from '../hooks';
import { useTheme, type Theme } from '../../../shared/theme';

export default function SignUpScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { handleSignUp, isLoading, error } = useSignUp();
  const { theme } = useTheme();

  const onSubmit = () => {
    handleSignUp({ username, email, password, confirmPassword });
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Rejoignez la Green Team !</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          placeholderTextColor={theme.input.placeholder}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.input.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={theme.input.placeholder}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmation du mot de passe"
          placeholderTextColor={theme.input.placeholder}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <View style={styles.bottomContainer}>
          <Link href="/auth/sign-in" asChild>
            <TouchableOpacity>
              <Text style={styles.link}>Déjà inscrit ? Connectez-vous</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onSubmit}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Inscription...' : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>
              S'inscrire avec Google
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSizes.xxl,
      fontWeight: 'bold',
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
    link: {
      color: theme.colors.primary,
      fontSize: theme.fontSizes.md,
      textAlign: 'center',
      marginVertical: theme.spacing.sm,
    },
    error: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
    },
    button: {
      height: 56,
      borderRadius: theme.borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    primaryButton: {
      backgroundColor: theme.button.primary.background,
    },
    primaryButtonText: {
      color: theme.button.primary.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: theme.button.secondary.background,
    },
    secondaryButtonText: {
      color: theme.button.secondary.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: '600',
    },
  });