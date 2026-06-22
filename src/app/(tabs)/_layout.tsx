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
          title: 'Today',
          tabBarAccessibilityLabel: '오늘',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
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
        name="dday"
        options={{
          title: 'D-Day',
          tabBarAccessibilityLabel: '디데이',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'flag.fill', android: 'flag', web: 'flag' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarAccessibilityLabel: '더 보기',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon
              color={color}
              size={size}
              name={{ ios: 'ellipsis', android: 'more_horiz', web: 'more_horiz' }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
