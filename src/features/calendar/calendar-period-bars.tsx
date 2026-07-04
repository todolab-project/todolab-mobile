import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { doesScheduleOverlapDate } from '@/utils';

type CalendarPeriodBarsProps = {
  dates: LocalDateString[];
  tasks: TaskResponse[];
  onOpen: (taskId: number) => void;
};

export function CalendarPeriodBars({ dates, tasks, onOpen }: CalendarPeriodBarsProps) {
  const theme = useAppTheme();
  const segments = buildCalendarPeriodSegments(tasks, dates).slice(0, 2);

  if (segments.length === 0) return null;

  return (
    <View style={styles.container}>
      {segments.map((segment, lane) => (
        <Pressable
          accessibilityLabel={`${segment.task.title}, 기간 일정 상세 보기`}
          accessibilityRole="button"
          hitSlop={6}
          key={segment.task.id}
          onPress={() => onOpen(segment.task.id)}
          style={({ pressed }) => [
            styles.bar,
            {
              backgroundColor: theme.colors.primarySoft,
              left: `${(segment.startIndex / dates.length) * 100}%`,
              opacity: pressed ? 0.7 : 1,
              top: lane * 24,
              width: `${((segment.endIndex - segment.startIndex + 1) / dates.length) * 100}%`,
            },
          ]}
        >
          <AppText numberOfLines={1} tone="primary" variant="caption" weight="semibold">
            {segment.continuesBefore ? '‹ ' : ''}
            {segment.task.title}
            {segment.continuesAfter ? ' ›' : ''}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

export function buildCalendarPeriodSegments(tasks: TaskResponse[], dates: LocalDateString[]) {
  if (dates.length === 0) return [];

  return tasks.flatMap((task) => {
    const occupiedIndexes = dates
      .map((date, index) => (doesScheduleOverlapDate(task, date) ? index : -1))
      .filter((index) => index >= 0);

    if (occupiedIndexes.length === 0) return [];

    const startIndex = occupiedIndexes[0];
    const endIndex = occupiedIndexes.at(-1) ?? startIndex;
    const startDate = task.startAt?.slice(0, 10);
    const endDate = task.endAt?.slice(0, 10);

    return [
      {
        task,
        startIndex,
        endIndex,
        continuesBefore: Boolean(startDate && startDate < dates[0]),
        continuesAfter: Boolean(endDate && endDate > dates.at(-1)!),
      },
    ];
  });
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    marginHorizontal: spacing[1],
    position: 'relative',
  },
  bar: {
    borderRadius: radii.sm,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: spacing[1],
    position: 'absolute',
  },
});
