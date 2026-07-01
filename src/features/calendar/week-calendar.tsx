import { useMemo, useState } from 'react';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, IconButton, PageHeader, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme, useMobileLayout } from '@/theme';
import type { LocalDateString } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { CalendarDayTasks } from './calendar-day-tasks';
import { getMonthCalendarDates, getWeekDates, shiftMonth } from './calendar-date';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];
type CalendarMode = 'week' | 'month';

export function WeekCalendar() {
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [mode, setMode] = useState<CalendarMode>('week');
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(today);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthCalendarDates(selectedDate), [selectedDate]);

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
      <PageHeader title="캘린더" />

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
          주간
        </Button>
        <Button
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'month' }}
          size="compact"
          variant={mode === 'month' ? 'secondary' : 'ghost'}
          onPress={() => setMode('month')}
          style={styles.modeButton}
        >
          월간
        </Button>
      </View>

      <Card padded={false} style={styles.calendarCard}>
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
          />
        )}

        {selectedDate !== today ? (
          <Button size="compact" variant="ghost" onPress={moveToToday} style={styles.todayButton}>
            오늘로 이동
          </Button>
        ) : null}
      </Card>

      <CalendarDayTasks date={selectedDate} />
    </Screen>
  );
}

type DatePickerProps = {
  dates: LocalDateString[];
  selectedDate: LocalDateString;
  today: LocalDateString;
  onSelect: (date: LocalDateString) => void;
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

function MonthDateGrid({ dates, selectedDate, today, onSelect }: DatePickerProps) {
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
      <View style={styles.monthGrid}>
        {dates.map((date) => (
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
  return (
    <Pressable
      accessibilityLabel={`${formatDateLabel(date, {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })}${isToday ? ', 오늘' : ''}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.dayButton,
        style,
        {
          backgroundColor: selected
            ? theme.colors.primary
            : pressed
              ? theme.colors.primarySoft
              : 'transparent',
        },
      ]}
    >
      {weekdayLabel ? (
        <AppText
          align="center"
          tone={selected ? 'default' : 'secondary'}
          variant="caption"
          weight="semibold"
          style={selected ? { color: theme.colors.textOnPrimary } : undefined}
        >
          {weekdayLabel}
        </AppText>
      ) : null}
      <AppText
        align="center"
        tone={!selected && !isCurrentMonth ? 'muted' : 'default'}
        variant={weekdayLabel ? 'bodyLarge' : 'label'}
        weight={selected || isToday ? 'heavy' : 'semibold'}
        style={selected ? { color: theme.colors.textOnPrimary } : undefined}
      >
        {Number(date.slice(-2))}
      </AppText>
      <View
        style={[
          styles.todayDot,
          {
            backgroundColor: isToday
              ? selected
                ? theme.colors.textOnPrimary
                : theme.colors.primary
              : 'transparent',
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
    gap: spacing[5],
    paddingTop: spacing[4],
  },
  modeSwitch: {
    alignSelf: 'flex-start',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[1],
  },
  modeButton: {
    minWidth: 64,
  },
  calendarCard: {
    overflow: 'hidden',
  },
  calendarHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingTop: spacing[2],
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
    paddingTop: spacing[4],
  },
  monthWeekday: {
    width: '14.285714%',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
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
  todayButton: {
    alignSelf: 'center',
    marginBottom: spacing[1],
  },
});
