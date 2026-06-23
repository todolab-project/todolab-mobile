import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import { formatDateLabel, toApiLocalDate } from '@/utils';

import { getTodayGreeting } from './today-copy';

type TodayHeaderProps = {
  now?: Date;
};

export function TodayHeader({ now = new Date() }: TodayHeaderProps) {
  const theme = useAppTheme();
  const today = toApiLocalDate(now);
  const [year, month, day] = today.split('-').map(Number);
  const weekday = formatDateLabel(today, { weekday: 'long' });

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={[styles.todayPill, { backgroundColor: theme.colors.primarySoft }]}>
          <SymbolView
            name={{ ios: 'sparkles', android: 'today', web: 'today' }}
            size={16}
            tintColor={theme.colors.primary}
          />
          <AppText tone="primary" variant="caption" weight="bold">
            TODAY
          </AppText>
        </View>

        <AppText variant="display" weight="bold">
          {getTodayGreeting(now)}
        </AppText>
        <AppText tone="secondary">가장 중요한 일부터 하나씩 끝내보세요.</AppText>
      </View>

      <Card
        accessible
        accessibilityLabel={`${year}년 ${month}월 ${day}일 ${weekday}, 오늘의 계획`}
        style={styles.dateCard}
      >
        <View style={[styles.dateTile, { backgroundColor: theme.colors.primary }]}>
          <AppText
            variant="display"
            weight="heavy"
            style={[styles.dateNumber, { color: theme.colors.textOnPrimary }]}
          >
            {day}
          </AppText>
        </View>

        <View style={styles.dateCopy}>
          <AppText variant="bodyLarge" weight="bold">
            {month}월 {weekday}
          </AppText>
          <AppText tone="secondary" variant="label">
            {year}년 · 오늘의 계획
          </AppText>
        </View>

        <SymbolView
          name={{ ios: 'calendar', android: 'calendar_month', web: 'calendar_month' }}
          size={24}
          tintColor={theme.colors.textMuted}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[6],
  },
  heading: {
    gap: spacing[3],
  },
  todayPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  dateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[4],
  },
  dateTile: {
    alignItems: 'center',
    borderRadius: radii.md,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  dateNumber: {
    lineHeight: 40,
  },
  dateCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
});
