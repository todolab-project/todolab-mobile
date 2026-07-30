import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/navigation';
import { typography, useAppTheme } from '@/theme';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primaryPressed,
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
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              size={size}
              name={{
                ios: focused ? 'sun.max.fill' : 'sun.max',
                android: 'wb_sunny',
                web: 'today',
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '달력',
          tabBarAccessibilityLabel: '캘린더',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              size={size}
              name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarAccessibilityLabel: '프로필',
          tabBarIcon: ({ color, focused, size }) => (
            <TabBarIcon
              color={color}
              focused={focused}
              size={size}
              name={{ ios: 'person.crop.circle.fill', android: 'person', web: 'person' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
