import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSignOut } from '../../auth/hooks';
import { useTheme, type Theme } from '../../../shared/theme';

export default function SettingsScreen() {
  const { handleSignOut } = useSignOut();
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Profil Section */}
      <Text style={styles.sectionTitle}>Profil</Text>

      {/* Logout Button */}
      <TouchableOpacity style={styles.row} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
        <Text style={styles.arrow}>→</Text>
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
    },
    sectionTitle: {
      fontSize: theme.fontSizes.lg,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    logoutText: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.error,
    },
    arrow: {
      fontSize: theme.fontSizes.lg,
      color: theme.colors.error,
    },
  });