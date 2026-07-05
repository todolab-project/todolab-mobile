import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation';
import { typography, useAppTheme } from '@/theme';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: typography.size.caption,
          fontWeight: typography.weight.semibold,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '오늘',
          tabBarAccessibilityLabel: '오늘',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'sun.max.fill', android: 'today', web: 'today' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '달력',
          tabBarAccessibilityLabel: '캘린더',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: '기록함',
          tabBarAccessibilityLabel: '기록함',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'tray.full.fill', android: 'inbox', web: 'inbox' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarAccessibilityLabel: '프로필',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'person.crop.circle.fill', android: 'person', web: 'person' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
