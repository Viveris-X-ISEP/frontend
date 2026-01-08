import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSurveyStatus } from "../../features/survey/hooks";
import { useTheme } from "../../shared/theme";

export default function TabLayout() {
  const { theme } = useTheme();
  const { hasCompleted } = useSurveyStatus();

  // TODO: Verify how survey completion is tracked in backend
  // If hasCompleted is null (loading), default to false to hide missions
  const isMissionsEnabled = hasCompleted === true;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.primary,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            paddingTop: 8,
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.outline
          },
          default: {
            paddingTop: 8,
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.outline
          }
        })
      }}
    >
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={28} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="trophy"
              size={28}
              color={isMissionsEnabled ? color : theme.colors.outline}
            />
          ),
          // Disable tab press if survey not completed
          tabBarButton: isMissionsEnabled ? undefined : () => null
        }}
        listeners={{
          tabPress: (e) => {
            if (!isMissionsEnabled) {
              // Prevent navigation to missions if survey not completed
              e.preventDefault();
            }
          }
        }}
      />
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Entypo name="home" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Ionicons name="people" size={28} color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <FontAwesome name="gear" size={28} color={color} />
        }}
      />
    </Tabs>
  );
}
