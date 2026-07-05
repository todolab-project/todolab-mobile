import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type ProfileItem = {
  title: string;
  description: string;
  href: '/dday' | '/completed' | '/settings';
  icon: SymbolViewProps['name'];
};

const profileItems: ProfileItem[] = [
  {
    title: '목표',
    description: 'D-Day와 연결된 실행 항목',
    href: '/dday',
    icon: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  },
  {
    title: '완료 기록',
    description: '끝낸 일과 주간 흐름',
    href: '/completed',
    icon: { ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' },
  },
  {
    title: '설정',
    description: '테마, 알림, 개인 설정',
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
];

export function ProfileOverview() {
  const router = useRouter();
  const theme = useAppTheme();

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
        {profileItems.map((item, index) => (
          <Pressable
            key={item.href}
            accessibilityHint={`${item.title} 화면으로 이동합니다.`}
            accessibilityRole="button"
            onPress={() => router.push(item.href as Href)}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
                borderBottomColor: theme.colors.rule,
                borderBottomWidth: index < profileItems.length - 1 ? StyleSheet.hairlineWidth : 0,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: theme.colors.highlightBlue }]}>
              <SymbolView name={item.icon} size={18} tintColor={theme.colors.primary} />
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
        ))}
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
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 64,
    paddingHorizontal: spacing[1],
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
