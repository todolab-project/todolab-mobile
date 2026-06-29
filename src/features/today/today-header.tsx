import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import { formatDateLabel, toApiLocalDate } from '@/utils';

type TodayHeaderProps = {
  now?: Date;
};

export function TodayHeader({ now = new Date() }: TodayHeaderProps) {
  const theme = useAppTheme();
  const today = toApiLocalDate(now);
  const [year, month, day] = today.split('-').map(Number);
  const weekday = formatDateLabel(today, { weekday: 'long' });

  return (
    <Card
      accessible
      accessibilityLabel={`${year}년 ${month}월 ${day}일 ${weekday}, Today`}
      style={styles.container}
    >
      <View style={styles.titleGroup}>
        <View style={[styles.iconTile, { backgroundColor: theme.colors.primarySoft }]}>
          <SymbolView
            name={{ ios: 'sparkles', android: 'today', web: 'today' }}
            size={18}
            tintColor={theme.colors.primary}
          />
        </View>

        <View style={styles.copy}>
          <AppText tone="primary" variant="caption" weight="bold">
            TODAY
          </AppText>
          <AppText variant="bodyLarge" weight="bold">
            오늘 할 일
          </AppText>
        </View>
      </View>

      <View style={[styles.datePill, { backgroundColor: theme.colors.surfaceMuted }]}>
        <AppText variant="label" weight="bold">
          {month}.{day}
        </AppText>
        <AppText tone="secondary" variant="caption">
          {weekday}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  titleGroup: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing[3],
    minWidth: 0,
  },
  iconTile: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  datePill: {
    alignItems: 'center',
    borderRadius: radii.full,
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
