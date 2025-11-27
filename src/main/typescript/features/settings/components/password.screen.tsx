import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme, type Theme } from '../../../shared/theme';

export default function PasswordScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement password change API call
      console.log('Password change submitted');
    } catch (err) {
      setError('Échec du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe actuel"
        placeholderTextColor={theme.input.placeholder}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Nouveau mot de passe"
        placeholderTextColor={theme.input.placeholder}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer le nouveau mot de passe"
        placeholderTextColor={theme.input.placeholder}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
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
      paddingTop: theme.spacing.lg,
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
    button: {
      backgroundColor: theme.colors.primary,
      height: 56,
      borderRadius: theme.borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: theme.colors.text,
      fontSize: theme.fontSizes.lg,
      fontWeight: '600',
    },
    error: {
      color: theme.colors.error,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
  });