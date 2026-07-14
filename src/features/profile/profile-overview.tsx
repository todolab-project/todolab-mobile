import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, PageHeader, Screen } from '@/components/ui';
import { authApi, getAccessToken, subscribeAccessToken } from '@/services/api';
import { radii, spacing, useAppTheme } from '@/theme';

type ProfileItem = {
  accent: 'amber' | 'sage' | 'blue';
  title: string;
  description: string;
  href: '/dday' | '/search' | '/completed' | '/settings';
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
    accent: 'blue',
    title: '검색',
    description: '과거 Task와 일정 찾기',
    href: '/search',
    icon: { ios: 'magnifyingglass', android: 'search', web: 'search' },
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
  const queryClient = useQueryClient();
  const theme = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<ProfileItem['href'] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAccessToken()));

  useEffect(() => subscribeAccessToken((token) => setIsLoggedIn(Boolean(token))), []);

  const me = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: ({ signal }) => authApi.me(signal),
    enabled: isLoggedIn,
    retry: false,
  });
  const userEmail = me.data?.email;
  const identityTitle = userEmail ?? (isLoggedIn ? '나의 플래너' : '로그인이 필요해요');
  const identityDescription = isLoggedIn
    ? me.isPending
      ? '계정 정보를 확인하고 있어요.'
      : '목표와 기록, 개인 설정을 관리하세요.'
    : '실제 서버 데이터와 동기화하려면 로그인하세요.';

  const logout = () => {
    authApi.logout();
    queryClient.clear();
    setIsLoggedIn(false);
  };

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
          <AppText numberOfLines={1} variant="bodyLarge" weight="bold">
            {identityTitle}
          </AppText>
          <AppText tone="secondary" variant="caption">
            {identityDescription}
          </AppText>
        </View>
      </View>

      <Button
        fullWidth
        onPress={isLoggedIn ? logout : () => router.push('/login' as Href)}
        variant={isLoggedIn ? 'secondary' : 'primary'}
      >
        {isLoggedIn ? '로그아웃' : '로그인'}
      </Button>

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
                <AppText numberOfLines={1} tone="secondary" variant="caption">
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
    gap: spacing[4],
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
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
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
