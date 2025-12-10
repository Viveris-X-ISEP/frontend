import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store";
import { useTheme } from "../shared/theme";

export default function RootLayout() {
  const { isLoggedIn } = useAuthStore();
  const { isDark } = useTheme();

  // Handle rehydration state (wait for SecureStore to read data)
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Zustand persist hydration - assuming fast for now
    setIsReady(true);
  }, []);

  if (!isReady) return null; // Or a Splash Screen

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected: Only show if Logged In */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="mission/detail/[id]" />
          <Stack.Screen name="mission/update/[id]" />
          <Stack.Screen name="user/[id]" />
          <Stack.Screen name="survey" />
        </Stack.Protected>

        {/* Protected: Only show if Logged OUT */}
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="auth" />
        </Stack.Protected>

        {/* Public: Always accessible */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
