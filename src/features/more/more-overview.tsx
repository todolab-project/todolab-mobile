import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type MoreItem = {
  title: string;
  description: string;
  href: '/inbox' | '/completed' | '/settings';
  icon: SymbolViewProps['name'];
  status: string;
};

const moreItems: MoreItem[] = [
  {
    title: '기록함',
    description: '날짜를 정하지 않은 생각과 할 일을 다시 살펴봐요.',
    href: '/inbox',
    icon: { ios: 'tray.full.fill', android: 'inbox', web: 'inbox' },
    status: '다음 구현',
  },
  {
    title: '완료 기록',
    description: '끝낸 일을 날짜별로 돌아보고 조용히 성취를 확인해요.',
    href: '/completed',
    icon: { ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' },
    status: '준비 중',
  },
  {
    title: '설정',
    description: '앱 정보와 앞으로 추가될 사용 환경 설정을 관리해요.',
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
    status: '기본 정보',
  },
];

export function MoreOverview() {
  const router = useRouter();
  const theme = useAppTheme();

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppText tone="primary" variant="caption" weight="bold">
          MORE
        </AppText>
        <AppText variant="title" weight="heavy">
          기록과 설정
        </AppText>
        <AppText tone="secondary">
          오늘 밖에 둔 기록을 정리하고, 지나온 흐름을 확인해 보세요.
        </AppText>
      </View>

      <View accessibilityRole="list" style={styles.menu}>
        {moreItems.map((item) => (
          <Pressable
            key={item.href}
            accessibilityHint={`${item.title} 화면으로 이동합니다`}
            accessibilityRole="button"
            onPress={() => router.push(item.href as Href)}
            style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
          >
            <Card style={styles.card}>
              <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
                <SymbolView
                  name={item.icon}
                  size={24}
                  tintColor={theme.colors.primary}
                  type="hierarchical"
                />
              </View>
              <View style={styles.copy}>
                <View style={styles.titleRow}>
                  <AppText variant="bodyLarge" weight="bold">
                    {item.title}
                  </AppText>
                  <View style={[styles.status, { backgroundColor: theme.colors.surfaceMuted }]}>
                    <AppText tone="secondary" variant="caption" weight="semibold">
                      {item.status}
                    </AppText>
                  </View>
                </View>
                <AppText tone="secondary" variant="label">
                  {item.description}
                </AppText>
              </View>
              <AppText tone="muted" variant="bodyLarge" weight="bold">
                ›
              </AppText>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[5],
  },
  header: {
    gap: spacing[2],
  },
  menu: {
    gap: spacing[3],
  },
  pressable: {
    borderRadius: radii.lg,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 104,
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  copy: {
    flex: 1,
    gap: spacing[1],
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  status: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
});
