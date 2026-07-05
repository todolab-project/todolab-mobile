import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { getWeekDates } from '@/features/calendar/calendar-date';
import {
  CalendarPeriodBars,
  CalendarSingleDayLabels,
} from '@/features/calendar/calendar-period-bars';
import { useCalendarRangeTasks } from '@/features/calendar/use-calendar-range-tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { doesScheduleOverlapDate, formatDateLabel } from '@/utils';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];

type TodayWeekStripProps = {
  today: LocalDateString;
};

export function TodayWeekStrip({ today }: TodayWeekStripProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const dates = getWeekDates(today);
  const query = useCalendarRangeTasks('WEEK', today);
  const schedules = query.data ?? [];
  const openCalendarDate = (date: LocalDateString) => {
    router.push({ pathname: '/calendar', params: { date } });
  };

  return (
    <View
      accessibilityLabel={`${formatDateLabel(today, { month: 'long' })} 주간 일정`}
      style={styles.container}
    >
      <AppText variant="bodyLarge" weight="bold">
        {formatDateLabel(today, { month: 'long' })}
      </AppText>
      <View style={styles.days}>
        {dates.map((date, index) => {
          const isToday = date === today;
          const hasSingleDaySchedule = schedules.some(
            (task) => isSingleDaySchedule(task) && doesScheduleOverlapDate(task, date),
          );

          return (
            <Pressable
              accessibilityLabel={`${formatDateLabel(date, {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}${isToday ? ', 오늘' : ''}, 달력에서 보기`}
              accessibilityRole="button"
              key={date}
              onPress={() => openCalendarDate(date)}
              style={styles.day}
            >
              <AppText
                align="center"
                tone={isToday ? 'default' : 'secondary'}
                variant="caption"
                weight="semibold"
              >
                {weekdayLabels[index]}
              </AppText>
              <View style={[styles.date, isToday && { backgroundColor: theme.colors.text }]}>
                <AppText
                  align="center"
                  variant="bodyLarge"
                  weight="bold"
                  style={isToday ? { color: theme.colors.surface } : undefined}
                >
                  {Number(date.slice(-2))}
                </AppText>
              </View>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: hasSingleDaySchedule ? theme.colors.warning : 'transparent',
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <CalendarSingleDayLabels
        dates={dates}
        tasks={schedules}
        onOpen={(taskId) =>
          router.push({
            pathname: '/tasks/[taskId]',
            params: { taskId: String(taskId) },
          })
        }
        onSelectDate={openCalendarDate}
      />
      <CalendarPeriodBars
        dates={dates}
        tasks={schedules}
        onOpen={(taskId) =>
          router.push({
            pathname: '/tasks/[taskId]',
            params: { taskId: String(taskId) },
          })
        }
      />
    </View>
  );
}

function isSingleDaySchedule(task: TaskResponse) {
  if (!task.startAt || !task.endAt) return true;
  return task.startAt.slice(0, 10) === task.endAt.slice(0, 10);
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  days: {
    flexDirection: 'row',
  },
  day: {
    alignItems: 'center',
    flex: 1,
    gap: spacing[1],
    minHeight: 56,
  },
  date: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  dot: {
    borderRadius: radii.full,
    height: 4,
    width: 4,
  },
});
