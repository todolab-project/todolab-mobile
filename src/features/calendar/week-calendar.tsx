import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, IconButton, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme, useMobileLayout } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { CalendarDayTasks } from './calendar-day-tasks';
import { getMonthCalendarDates, getWeekDates, shiftMonth } from './calendar-date';
import { CalendarPeriodBars } from './calendar-period-bars';
import { useCalendarRangeTasks } from './use-calendar-range-tasks';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];
type CalendarMode = 'week' | 'month';

export function WeekCalendar() {
  const router = useRouter();
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [mode, setMode] = useState<CalendarMode>('week');
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(today);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthCalendarDates(selectedDate), [selectedDate]);
  const rangeTasks = useCalendarRangeTasks(mode === 'week' ? 'WEEK' : 'MONTH', selectedDate);
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };

  const moveWeek = (days: number) => {
    const nextSelectedDate = shiftLocalDate(selectedDate, days);

    if (nextSelectedDate) {
      setSelectedDate(nextSelectedDate);
    }
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
      <PageHeader
        title="캘린더"
        action={
          <View style={styles.headerActions}>
            <View
              accessibilityRole="tablist"
              style={[styles.modeSwitch, { backgroundColor: theme.colors.surfaceMuted }]}
            >
              <Button
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === 'week' }}
                size="compact"
                variant={mode === 'week' ? 'secondary' : 'ghost'}
                onPress={() => setMode('week')}
                style={styles.modeButton}
              >
                주
              </Button>
              <Button
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === 'month' }}
                size="compact"
                variant={mode === 'month' ? 'secondary' : 'ghost'}
                onPress={() => setMode('month')}
                style={styles.modeButton}
              >
                월
              </Button>
            </View>
            <IconButton
              accessibilityLabel="새 할 일 작성"
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

      <View style={[styles.calendarSurface, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.calendarHeading}>
          <IconButton
            accessibilityLabel={`이전 ${mode === 'week' ? '주' : '달'}`}
            onPress={() => (mode === 'week' ? moveWeek(-7) : moveMonth(-1))}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
          <View style={styles.calendarHeadingCopy}>
            <AppText align="center" variant="label" weight="bold">
              {mode === 'week'
                ? getWeekRangeLabel(weekDates)
                : formatDateLabel(selectedDate, { year: 'numeric', month: 'long' })}
            </AppText>
          </View>
          <IconButton
            accessibilityLabel={`다음 ${mode === 'week' ? '주' : '달'}`}
            onPress={() => (mode === 'week' ? moveWeek(7) : moveMonth(1))}
          >
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

        {mode === 'week' ? (
          <WeekDateRow
            dates={weekDates}
            selectedDate={selectedDate}
            today={today}
            onSelect={setSelectedDate}
          />
        ) : (
          <MonthDateGrid
            dates={monthDates}
            selectedDate={selectedDate}
            today={today}
            onSelect={setSelectedDate}
            tasks={rangeTasks.data ?? []}
            onOpenTask={openTask}
          />
        )}
        {mode === 'week' ? (
          <CalendarPeriodBars dates={weekDates} tasks={rangeTasks.data ?? []} onOpen={openTask} />
        ) : null}
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

function WeekDateRow({ dates, selectedDate, today, onSelect }: DatePickerProps) {
  const theme = useAppTheme();
  const { isCompact, isShortViewport } = useMobileLayout();

  return (
    <View style={styles.weekRow}>
      {dates.map((date, index) => (
        <CalendarDateButton
          date={date}
          isCurrentMonth
          isToday={date === today}
          key={date}
          selected={date === selectedDate}
          weekdayLabel={weekdayLabels[index]}
          onPress={() => onSelect(date)}
          style={isCompact || isShortViewport ? styles.compactWeekDayButton : styles.weekDayButton}
          theme={theme}
        />
      ))}
    </View>
  );
}

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
  style:
    | typeof styles.weekDayButton
    | typeof styles.compactWeekDayButton
    | typeof styles.monthDayButton;
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
          backgroundColor:
            selected || pressed || isFocused ? theme.colors.primarySoft : 'transparent',
          borderColor: isFocused || (isToday && !selected) ? theme.colors.primary : 'transparent',
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
            backgroundColor: isToday ? theme.colors.primary : 'transparent',
          },
        ]}
      />
    </Pressable>
  );
}

function getWeekRangeLabel(weekDates: LocalDateString[]) {
  const firstDate = weekDates[0];
  const lastDate = weekDates.at(-1);

  if (!firstDate || !lastDate) {
    return '날짜를 확인해 주세요';
  }

  const firstLabel = formatDateLabel(firstDate, {
    month: 'short',
    day: 'numeric',
  });
  const lastLabel = formatDateLabel(
    lastDate,
    firstDate.slice(0, 4) === lastDate.slice(0, 4)
      ? { day: 'numeric' }
      : { month: 'short', day: 'numeric' },
  );

  return `${firstLabel} – ${lastLabel}`;
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[4],
  },
  modeSwitch: {
    alignSelf: 'flex-start',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[1],
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
  },
  modeButton: {
    minWidth: 44,
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
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[2],
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing[1],
    justifyContent: 'center',
    minWidth: 0,
  },
  weekDayButton: {
    flex: 1,
    minHeight: 64,
    paddingVertical: spacing[2],
  },
  compactWeekDayButton: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing[1],
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
    height: 4,
    width: 4,
  },
});
