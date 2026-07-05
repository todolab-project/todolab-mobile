import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, IconButton, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel, isLocalDateString, toApiLocalDate } from '@/utils';

import { CalendarDayTasks } from './calendar-day-tasks';
import { getMonthCalendarDates, shiftMonth } from './calendar-date';
import { CalendarPeriodBars, CalendarSingleDayLabels } from './calendar-period-bars';
import { useCalendarRangeTasks } from './use-calendar-range-tasks';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];

export function WeekCalendar() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(
    params.date && isLocalDateString(params.date) ? params.date : today,
  );
  const monthDates = useMemo(() => getMonthCalendarDates(selectedDate), [selectedDate]);
  const rangeTasks = useCalendarRangeTasks('MONTH', selectedDate);
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };

  const moveMonth = (amount: number) => {
    const nextSelectedDate = shiftMonth(selectedDate, amount);

    if (nextSelectedDate) {
      setSelectedDate(nextSelectedDate);
    }
  };

  const moveToToday = () => {
    setSelectedDate(today);
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader title="달력" />

      <View style={[styles.calendarSurface, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.calendarHeading}>
          <IconButton accessibilityLabel="이전 달" onPress={() => moveMonth(-1)}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
          <View style={styles.calendarHeadingCopy}>
            <AppText align="center" variant="label" weight="bold">
              {formatDateLabel(selectedDate, { year: 'numeric', month: 'long' })}
            </AppText>
          </View>
          <IconButton accessibilityLabel="다음 달" onPress={() => moveMonth(1)}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
          <IconButton
            accessibilityLabel="오늘로 이동"
            disabled={selectedDate === today}
            onPress={moveToToday}
          >
            <SymbolView
              name={{ ios: 'calendar', android: 'today', web: 'today' }}
              size={18}
              tintColor={selectedDate === today ? theme.colors.textMuted : theme.colors.primary}
            />
          </IconButton>
        </View>

        <MonthDateGrid
          dates={monthDates}
          selectedDate={selectedDate}
          today={today}
          onSelect={setSelectedDate}
          tasks={rangeTasks.data ?? []}
          onOpenTask={openTask}
        />
      </View>

      <CalendarDayTasks date={selectedDate} />
    </Screen>
  );
}

type DatePickerProps = {
  dates: LocalDateString[];
  selectedDate: LocalDateString;
  today: LocalDateString;
  onSelect: (date: LocalDateString) => void;
  tasks?: TaskResponse[];
  onOpenTask?: (taskId: number) => void;
};

function MonthDateGrid({
  dates,
  selectedDate,
  today,
  onSelect,
  tasks = [],
  onOpenTask = () => undefined,
}: DatePickerProps) {
  const theme = useAppTheme();
  const selectedMonth = selectedDate.slice(0, 7);

  return (
    <View>
      <View style={styles.monthWeekdays}>
        {weekdayLabels.map((label, index) => (
          <AppText
            align="center"
            key={label}
            tone={index >= 5 ? 'muted' : 'secondary'}
            variant="caption"
            weight="semibold"
            style={styles.monthWeekday}
          >
            {label}
          </AppText>
        ))}
      </View>
      {Array.from({ length: 6 }, (_, weekIndex) =>
        dates.slice(weekIndex * 7, weekIndex * 7 + 7),
      ).map((weekDates) => (
        <View key={weekDates[0]}>
          <View style={styles.monthGrid}>
            {weekDates.map((date) => (
              <CalendarDateButton
                date={date}
                isCurrentMonth={date.startsWith(selectedMonth)}
                isToday={date === today}
                key={date}
                selected={date === selectedDate}
                onPress={() => onSelect(date)}
                style={styles.monthDayButton}
                theme={theme}
              />
            ))}
          </View>
          <CalendarSingleDayLabels dates={weekDates} tasks={tasks} onOpen={onOpenTask} />
          <CalendarPeriodBars dates={weekDates} tasks={tasks} onOpen={onOpenTask} />
        </View>
      ))}
    </View>
  );
}

type CalendarDateButtonProps = {
  date: LocalDateString;
  selected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  weekdayLabel?: string;
  onPress: () => void;
  style: typeof styles.monthDayButton;
  theme: ReturnType<typeof useAppTheme>;
};

function CalendarDateButton({
  date,
  selected,
  isToday,
  isCurrentMonth,
  weekdayLabel,
  onPress,
  style,
  theme,
}: CalendarDateButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      accessibilityLabel={`${formatDateLabel(date, {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })}${isToday ? ', 오늘' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayButton,
        style,
        {
          backgroundColor: pressed || isFocused ? theme.colors.highlightBlue : 'transparent',
          borderColor: isFocused
            ? theme.colors.primary
            : selected
              ? theme.colors.text
              : 'transparent',
        },
      ]}
    >
      {weekdayLabel ? (
        <AppText
          align="center"
          tone={selected ? 'primary' : 'secondary'}
          variant="caption"
          weight="semibold"
        >
          {weekdayLabel}
        </AppText>
      ) : null}
      <AppText
        align="center"
        tone={selected ? 'primary' : !isCurrentMonth ? 'muted' : 'default'}
        variant={weekdayLabel ? 'bodyLarge' : 'label'}
        weight={selected || isToday ? 'heavy' : 'semibold'}
      >
        {Number(date.slice(-2))}
      </AppText>
      <View
        style={[
          styles.todayDot,
          {
            backgroundColor: isToday ? theme.colors.highlightAmber : 'transparent',
            borderColor: isToday ? theme.colors.warning : 'transparent',
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  calendarSurface: {
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  calendarHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    justifyContent: 'space-between',
    padding: spacing[2],
  },
  calendarHeadingCopy: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing[1],
    justifyContent: 'center',
    minWidth: 0,
  },
  monthWeekdays: {
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
    paddingTop: spacing[2],
  },
  monthWeekday: {
    width: '14.285714%',
  },
  monthGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
    paddingTop: spacing[1],
  },
  monthDayButton: {
    minHeight: 48,
    paddingVertical: spacing[1],
    width: '14.285714%',
  },
  todayDot: {
    borderRadius: radii.full,
    borderWidth: 1,
    height: 6,
    width: 6,
  },
});
