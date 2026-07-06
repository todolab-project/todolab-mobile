import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type ProfileItem = {
  accent: 'amber' | 'sage' | 'blue';
  title: string;
  description: string;
  href: '/dday' | '/completed' | '/settings';
  icon: SymbolViewProps['name'];
};

const profileItems: ProfileItem[] = [
  {
    accent: 'amber',
    title: '목표',
    description: 'D-Day와 연결된 실행 항목',
    href: '/dday',
    icon: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  },
  {
    accent: 'sage',
    title: '완료 기록',
    description: '끝낸 일과 주간 흐름',
    href: '/completed',
    icon: { ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' },
  },
  {
    accent: 'blue',
    title: '설정',
    description: '테마, 알림, 개인 설정',
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
];

export function ProfileOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<ProfileItem['href'] | null>(null);

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader title="프로필" />

      <View style={styles.identity}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.highlightSage }]}>
          <AppText variant="bodyLarge" weight="bold">
            나
          </AppText>
        </View>
        <View style={styles.identityCopy}>
          <AppText variant="bodyLarge" weight="bold">
            나의 플래너
          </AppText>
          <AppText tone="secondary" variant="caption">
            목표와 기록, 개인 설정을 관리하세요.
          </AppText>
        </View>
      </View>

      <View accessibilityRole="list" style={styles.menu}>
        {profileItems.map((item) => {
          const accents = {
            amber: {
              backgroundColor: theme.colors.highlightAmber,
              color: theme.colors.warning,
            },
            sage: {
              backgroundColor: theme.colors.highlightSage,
              color: theme.colors.success,
            },
            blue: {
              backgroundColor: theme.colors.highlightBlue,
              color: theme.colors.primary,
            },
          };
          const accent = accents[item.accent];

          return (
            <Pressable
              key={item.href}
              accessibilityHint={`${item.title} 화면으로 이동합니다.`}
              accessibilityLabel={`${item.title}, ${item.description}`}
              accessibilityRole="button"
              onBlur={() => setFocusedItem(null)}
              onFocus={() => setFocusedItem(item.href)}
              onPress={() => router.push(item.href as Href)}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
                  borderColor:
                    focusedItem === item.href ? theme.colors.primary : theme.colors.border,
                  borderWidth: focusedItem === item.href ? 2 : StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: accent.backgroundColor }]}>
                <SymbolView name={item.icon} size={18} tintColor={accent.color} />
              </View>
              <View style={styles.copy}>
                <AppText weight="medium">{item.title}</AppText>
                <AppText tone="secondary" variant="caption">
                  {item.description}
                </AppText>
              </View>
              <AppText tone="muted" variant="bodyLarge">
                ›
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[4],
  },
  identity: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  avatar: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  identityCopy: {
    flex: 1,
    gap: spacing[1],
  },
  menu: {
    backgroundColor: 'transparent',
    gap: spacing[1],
    paddingHorizontal: spacing[1],
  },
  row: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 64,
    paddingHorizontal: spacing[3],
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  copy: {
    flex: 1,
    gap: spacing[1],
  },
});
