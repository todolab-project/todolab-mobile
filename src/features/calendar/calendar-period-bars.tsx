import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { doesScheduleOverlapDate, formatTimeLabel, shiftLocalDate } from '@/utils';

type CalendarPeriodBarsProps = {
  dates: LocalDateString[];
  tasks: TaskResponse[];
  onOpen: (taskId: number) => void;
  onSelectDate?: (date: LocalDateString) => void;
};

export function CalendarSingleDayLabels({
  dates,
  tasks,
  onOpen,
  onSelectDate,
}: CalendarPeriodBarsProps) {
  const theme = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const labels = buildCalendarSingleDayLabels(tasks, dates);

  if (labels.every((items) => items.length === 0)) return null;

  return (
    <View style={styles.singleDayRow}>
      {labels.map((items, index) => {
        const task = items[0];
        const date = dates[index];

        return (
          <View key={date} style={styles.singleDayCell}>
            {task ? (
              <Pressable
                accessibilityHint="일정 상세 화면을 엽니다."
                accessibilityLabel={`${task.title}, 하루 일정 상세 보기`}
                accessibilityRole="button"
                hitSlop={14}
                onBlur={() => setFocusedItem(null)}
                onFocus={() => setFocusedItem(`${date}-${task.id}`)}
                onPress={() => onOpen(task.id)}
                style={({ pressed }) => [
                  styles.singleDayLabel,
                  {
                    backgroundColor: theme.colors.highlightAmber,
                    borderColor:
                      focusedItem === `${date}-${task.id}` ? theme.colors.primary : 'transparent',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <AppText numberOfLines={1} tone="default" variant="caption" weight="semibold">
                  {getCalendarSingleDayLabel(task)}
                </AppText>
              </Pressable>
            ) : null}
            {items.length > 1 ? (
              <Pressable
                accessibilityLabel={`${formatOverflowDate(date)} 하루 일정 ${items.length - 1}개 더 있음`}
                accessibilityHint="이 날짜의 전체 일정 목록을 엽니다."
                accessibilityRole="button"
                hitSlop={14}
                onBlur={() => setFocusedItem(null)}
                onFocus={() => setFocusedItem(`${date}-overflow`)}
                onPress={() => onSelectDate?.(date)}
                style={[
                  styles.singleDayOverflow,
                  {
                    borderColor:
                      focusedItem === `${date}-overflow` ? theme.colors.primary : 'transparent',
                  },
                ]}
              >
                <AppText tone="muted" variant="caption" weight="semibold">
                  +{items.length - 1}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function CalendarPeriodBars({
  dates,
  tasks,
  onOpen,
  onSelectDate,
}: CalendarPeriodBarsProps) {
  const theme = useAppTheme();
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const layout = layoutCalendarPeriodSegments(tasks, dates);
  const overflowDate = dates[layout.overflowSegments[0]?.startIndex ?? 0];

  if (layout.segments.length === 0) return null;

  return (
    <View style={styles.container}>
      {layout.segments.map((segment) => {
        const segmentKey = `${segment.task.id}-${segment.lane}`;

        return (
          <Pressable
            accessibilityHint="일정 상세 화면을 엽니다."
            accessibilityLabel={`${segment.task.title}, 기간 일정 상세 보기`}
            accessibilityRole="button"
            hitSlop={12}
            key={segmentKey}
            onBlur={() => setFocusedItem(null)}
            onFocus={() => setFocusedItem(segmentKey)}
            onPress={() => onOpen(segment.task.id)}
            style={({ pressed }) => [
              styles.bar,
              {
                backgroundColor: theme.colors.highlightSage,
                borderColor: focusedItem === segmentKey ? theme.colors.primary : 'transparent',
                left: `${(segment.startIndex / dates.length) * 100}%`,
                opacity: pressed ? 0.7 : 1,
                top: segment.lane * 24,
                width: `${((segment.endIndex - segment.startIndex + 1) / dates.length) * 100}%`,
              },
            ]}
          >
            <AppText numberOfLines={1} tone="default" variant="caption" weight="semibold">
              {segment.continuesBefore ? '‹ ' : ''}
              {segment.task.title}
              {segment.continuesAfter ? ' ›' : ''}
            </AppText>
          </Pressable>
        );
      })}
      {layout.overflowCount > 0 ? (
        <Pressable
          accessibilityLabel={`기간 일정 ${layout.overflowCount}개 더 있음`}
          accessibilityHint="해당 날짜의 전체 일정 목록을 엽니다."
          accessibilityRole="button"
          hitSlop={14}
          onBlur={() => setFocusedItem(null)}
          onFocus={() => setFocusedItem('period-overflow')}
          onPress={() => {
            if (overflowDate) onSelectDate?.(overflowDate);
          }}
          style={[
            styles.overflow,
            {
              borderColor: focusedItem === 'period-overflow' ? theme.colors.primary : 'transparent',
            },
          ]}
        >
          <AppText align="right" tone="secondary" variant="caption" weight="semibold">
            +{layout.overflowCount}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function buildCalendarSingleDayLabels(
  tasks: TaskResponse[],
  dates: LocalDateString[],
): TaskResponse[][] {
  return dates.map((date) =>
    tasks.filter(
      (task) =>
        task.type === 'SCHEDULE' &&
        !isMultiDaySchedule(task) &&
        doesScheduleOverlapDate(task, date),
    ),
  );
}

export function getCalendarSingleDayLabel(task: TaskResponse) {
  if (task.allDay || !task.startAt) return task.title;

  return `${formatTimeLabel(task.startAt)} ${task.title}`;
}

export function layoutCalendarPeriodSegments(
  tasks: TaskResponse[],
  dates: LocalDateString[],
  maxLanes = 2,
) {
  const laneEndIndexes = Array.from({ length: maxLanes }, () => -1);
  const segments = [];
  const overflowSegments = [];
  const periodSegments = buildCalendarPeriodSegments(tasks, dates).sort(
    (left, right) => left.startIndex - right.startIndex || right.endIndex - left.endIndex,
  );

  for (const segment of periodSegments) {
    const lane = laneEndIndexes.findIndex((endIndex) => endIndex < segment.startIndex);

    if (lane < 0) {
      overflowSegments.push(segment);
      continue;
    }

    laneEndIndexes[lane] = segment.endIndex;
    segments.push({ ...segment, lane });
  }

  return {
    segments,
    overflowCount: overflowSegments.length,
    overflowSegments,
  };
}

export function buildCalendarPeriodSegments(tasks: TaskResponse[], dates: LocalDateString[]) {
  if (dates.length === 0) return [];

  return tasks.flatMap((task) => {
    if (!isMultiDaySchedule(task)) return [];

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

export function isMultiDaySchedule(task: TaskResponse) {
  if (!task.startAt || !task.endAt) return false;

  const startDate = task.startAt.slice(0, 10) as LocalDateString;
  const rawEndDate = task.endAt.slice(0, 10) as LocalDateString;
  const endsAtMidnight = /^T00:00(?::00(?:\.0+)?)?$/.test(task.endAt.slice(10));
  const occupiedEndDate = endsAtMidnight
    ? (shiftLocalDate(rawEndDate, -1) ?? rawEndDate)
    : rawEndDate;

  return occupiedEndDate > startDate;
}

function formatOverflowDate(date: LocalDateString) {
  return `${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일`;
}

const styles = StyleSheet.create({
  singleDayRow: {
    flexDirection: 'row',
    minHeight: 24,
  },
  singleDayCell: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    minWidth: 0,
    width: '14.285714%',
  },
  singleDayLabel: {
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 3,
  },
  singleDayOverflow: {
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  container: {
    height: 48,
    position: 'relative',
  },
  bar: {
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: spacing[1],
    position: 'absolute',
  },
  overflow: {
    borderRadius: radii.sm,
    borderWidth: 1,
    bottom: 0,
    position: 'absolute',
    right: spacing[1],
  },
});
