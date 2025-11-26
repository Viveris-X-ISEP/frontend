import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo, FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4D996B',
        tabBarInactiveTintColor: '#000000',
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            paddingTop: 8,
          },
          default: {
            paddingTop: 8,
          },
        }),
      }}>
      <Tabs.Screen
        name="profile/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="trophy" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community/index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="gear" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
