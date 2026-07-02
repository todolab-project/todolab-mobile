import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type MoreItem = {
  accent: 'primary' | 'success' | 'warning';
  title: string;
  description: string;
  href: '/inbox' | '/completed' | '/settings';
  icon: SymbolViewProps['name'];
};

const moreItems: MoreItem[] = [
  {
    accent: 'warning',
    title: '기록함',
    description: '날짜를 정하지 않은 기록',
    href: '/inbox',
    icon: { ios: 'tray.full.fill', android: 'inbox', web: 'inbox' },
  },
  {
    accent: 'success',
    title: '완료 기록',
    description: '끝낸 일과 주간 흐름',
    href: '/completed',
    icon: { ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' },
  },
  {
    accent: 'primary',
    title: '설정',
    description: '앱 환경과 정보',
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
];

export function MoreOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const [focusedHref, setFocusedHref] = useState<MoreItem['href'] | null>(null);

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader title="더 보기" />

      <View
        accessibilityRole="list"
        style={[
          styles.menu,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        {moreItems.map((item, index) => {
          const accents = {
            primary: {
              color: theme.colors.primary,
              backgroundColor: theme.colors.primarySoft,
            },
            success: {
              color: theme.colors.success,
              backgroundColor: theme.colors.successSoft,
            },
            warning: {
              color: theme.colors.warning,
              backgroundColor: theme.colors.warningSoft,
            },
          };
          const accent = accents[item.accent];

          return (
            <Pressable
              key={item.href}
              accessibilityHint={`${item.title} 화면으로 이동합니다`}
              accessibilityRole="button"
              onBlur={() => setFocusedHref(null)}
              onFocus={() => setFocusedHref(item.href)}
              onPress={() => router.push(item.href as Href)}
              style={({ pressed }) => [
                styles.row,
                index < moreItems.length - 1 && {
                  borderBottomColor: theme.colors.border,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
                (pressed || focusedHref === item.href) && {
                  backgroundColor: theme.colors.primarySoft,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: accent.backgroundColor }]}>
                <SymbolView
                  name={item.icon}
                  size={18}
                  tintColor={accent.color}
                  type="hierarchical"
                />
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
  menu: {
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 60,
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
