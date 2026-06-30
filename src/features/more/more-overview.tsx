import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';

type MoreItem = {
  title: string;
  href: '/inbox' | '/completed' | '/settings';
  icon: SymbolViewProps['name'];
};

const moreItems: MoreItem[] = [
  {
    title: '기록함',
    href: '/inbox',
    icon: { ios: 'tray.full.fill', android: 'inbox', web: 'inbox' },
  },
  {
    title: '완료 기록',
    href: '/completed',
    icon: { ios: 'checkmark.circle.fill', android: 'task_alt', web: 'task_alt' },
  },
  {
    title: '설정',
    href: '/settings',
    icon: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  },
];

export function MoreOverview() {
  const router = useRouter();
  const theme = useAppTheme();

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
        {moreItems.map((item, index) => (
          <Pressable
            key={item.href}
            accessibilityHint={`${item.title} 화면으로 이동합니다`}
            accessibilityRole="button"
            onPress={() => router.push(item.href as Href)}
            style={({ pressed }) => [
              styles.row,
              index < moreItems.length - 1 && {
                borderBottomColor: theme.colors.border,
                borderBottomWidth: StyleSheet.hairlineWidth,
              },
              pressed && { backgroundColor: theme.colors.surfaceMuted },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: theme.colors.primarySoft }]}>
              <SymbolView
                name={item.icon}
                size={18}
                tintColor={theme.colors.primary}
                type="hierarchical"
              />
            </View>
            <AppText style={styles.title} weight="medium">
              {item.title}
            </AppText>
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
  title: {
    flex: 1,
  },
});
