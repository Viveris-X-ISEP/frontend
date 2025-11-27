import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useAuthStore } from '../store';

export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();

  // Handle rehydration state (wait for SecureStore to read data)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Zustand persist hydration - assuming fast for now
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Or a Splash Screen

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Protected: Only show if Logged In */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="mission" />
        <Stack.Screen name="user" />
        <Stack.Screen name="questionnaire" />
      </Stack.Protected>

      {/* Protected: Only show if Logged OUT */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="auth" />
      </Stack.Protected>

      {/* Public: Always accessible */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
