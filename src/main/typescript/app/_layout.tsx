import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { SurveyPromptModal } from "../features/survey/components/survey-prompt-modal";
import { SurveyService } from "../features/survey/services/survey.service";
import { useTheme } from "../shared/theme";
import { useAuthStore } from "../store";
import { hasOneMonthPassed } from "../utility";

export default function RootLayout() {
  const { isLoggedIn, userId, signOut } = useAuthStore();
  const { isDark } = useTheme();

  // Handle rehydration state (wait for SecureStore to read data)
  const [isReady, setIsReady] = useState(false);
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);

  // Track if we've already validated auth state
  const hasValidatedAuth = useRef(false);

  // Validate auth state on app startup (only once)
  useEffect(() => {
    const validateAuthState = async () => {
      if (hasValidatedAuth.current) {
        return;
      }
      hasValidatedAuth.current = true;

      // If Zustand says we're logged in, verify tokens exist in SecureStore
      if (isLoggedIn) {
        const token = await SecureStore.getItemAsync("auth_token");
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        // If tokens don't exist, the persisted state is stale - sign out
        if (!token || !refreshToken) {
          console.log("Stale auth state detected - tokens missing from SecureStore");
          await signOut();
        }
      }
      setIsReady(true);
    };

    validateAuthState();
  }, [isLoggedIn, signOut]);

  // Check if user needs to retake the survey
  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (!isLoggedIn || !userId) return;

      try {
        // Get the latest emission data
        const latestEmission = await SurveyService.getLatestApiEmission(userId);

        // Check if more than one month has passed since the last survey
        if (latestEmission?.periodStart) {
          const shouldPromptSurvey = hasOneMonthPassed(latestEmission.periodStart);

          if (shouldPromptSurvey) {
            setShowSurveyPrompt(true);
          }
        }
      } catch (error) {
        // If there's no emission data, user hasn't completed survey yet
        // Don't show the prompt for first-time users
        console.log("No emission data found or error:", error);
      }
    };

    if (isReady && isLoggedIn) {
      checkSurveyStatus();
    }
  }, [isReady, isLoggedIn, userId]);

  if (!isReady) return null; // Or a Splash Screen

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SurveyPromptModal visible={showSurveyPrompt} onClose={() => setShowSurveyPrompt(false)} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected: Only show if Logged In */}
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="mission/detail/[id]" />
          <Stack.Screen name="mission/update/[id]" />
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
