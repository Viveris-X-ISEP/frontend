import { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme, type Theme } from '../../../shared/theme';

interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'missions',
    label: 'Nouvelles missions',
    description:
      'Recevoir une notification quand de nouvelles missions sont disponibles',
  },
  {
    id: 'reminders',
    label: 'Rappels',
    description: 'Recevoir des rappels pour les missions en cours',
  },
  {
    id: 'community',
    label: 'Communauté',
    description: 'Notifications liées à la communauté',
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  // TODO: Persist notification preferences
  const [settings, setSettings] = useState<Record<string, boolean>>({
    missions: true,
    reminders: true,
    community: false,
  });

  const toggleSetting = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      {notificationSettings.map((setting) => (
        <View key={setting.id} style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{setting.label}</Text>
            {setting.description && (
              <Text style={styles.description}>{setting.description}</Text>
            )}
          </View>
          <Switch
            value={settings[setting.id]}
            onValueChange={() => toggleSetting(setting.id)}
            trackColor={{
              false: theme.colors.outline,
              true: theme.colors.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>
      ))}
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    textContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    label: {
      fontSize: theme.fontSizes.md,
      color: theme.colors.text,
      fontWeight: '500',
    },
    description: {
      fontSize: theme.fontSizes.sm,
      color: theme.colors.text,
      opacity: 0.7,
      marginTop: theme.spacing.xs,
    },
  });