import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store";
import { useTheme } from "../shared/theme";
import { SurveyPromptModal } from "../features/survey/components/survey-prompt-modal";
import { SurveyService } from "../features/survey/services/survey.service";
import { hasOneMonthPassed } from "../utility";

export default function RootLayout() {
  const { isLoggedIn, userId } = useAuthStore();
  const { isDark } = useTheme();

  // Handle rehydration state (wait for SecureStore to read data)
  const [isReady, setIsReady] = useState(false);
  const [showSurveyPrompt, setShowSurveyPrompt] = useState(false);

  useEffect(() => {
    // Zustand persist hydration - assuming fast for now
    setIsReady(true);
  }, []);

  // Check if user needs to retake the survey
  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (!isLoggedIn || !userId) return;

      try {
        // Get the latest emission data
        const latestEmission = await SurveyService.getLatestEmission(userId);

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
