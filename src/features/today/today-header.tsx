import { StyleSheet, View } from 'react-native';

import { AppText, PageHeader } from '@/components/ui';
import { spacing } from '@/theme';
import { formatDateLabel, toApiLocalDate } from '@/utils';

type TodayHeaderProps = {
  now?: Date;
};

export function TodayHeader({ now = new Date() }: TodayHeaderProps) {
  const today = toApiLocalDate(now);
  const [, month, day] = today.split('-').map(Number);
  const weekday = formatDateLabel(today, { weekday: 'long' });

  return (
    <PageHeader
      title="오늘"
      description="가장 중요한 일부터 하나씩 끝내보세요."
      action={
        <View style={styles.date}>
          <AppText variant="label" weight="bold">
            {month}.{day}
          </AppText>
          <AppText tone="secondary" variant="caption">
            {weekday}
          </AppText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  date: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: spacing[1],
    paddingTop: spacing[1],
  },
});
