import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText, IconButton, PageHeader } from '@/components/ui';
import { spacing, useAppTheme } from '@/theme';
import { formatDateLabel, toApiLocalDate } from '@/utils';

type TodayHeaderProps = {
  now?: Date;
};

export function TodayHeader({ now = new Date() }: TodayHeaderProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const today = toApiLocalDate(now);
  const [, month, day] = today.split('-').map(Number);
  const weekday = formatDateLabel(today, { weekday: 'long' });

  return (
    <PageHeader
      title="오늘"
      action={
        <View style={styles.actions}>
          <View style={styles.date}>
            <AppText variant="label" weight="bold">
              {month}.{day}
            </AppText>
            <AppText tone="secondary" variant="caption">
              {weekday}
            </AppText>
          </View>
          <IconButton
            accessibilityLabel="새 할 일 자세히 작성"
            onPress={() => router.push('/tasks/new')}
          >
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={20}
              tintColor={theme.colors.primary}
            />
          </IconButton>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
  },
  date: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing[1],
    paddingTop: spacing[1],
  },
});
