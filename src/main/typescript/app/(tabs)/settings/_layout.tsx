import { Stack } from 'expo-router';
import { useTheme } from '../../../shared/theme';

export default function SettingsLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Paramètres',
        }}
      />
      <Stack.Screen
        name="password"
        options={{
          title: 'Mot de passe',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="theme"
        options={{
          title: 'Thème',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Langage',
        }}
      />
    </Stack>
  );
}