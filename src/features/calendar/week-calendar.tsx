import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { getWeekDates } from './calendar-date';

const weekdayLabels = ['월', '화', '수', '목', '금', '토', '일'];

export function WeekCalendar() {
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(today);
  const [weekAnchor, setWeekAnchor] = useState<LocalDateString>(today);
  const weekDates = useMemo(() => getWeekDates(weekAnchor), [weekAnchor]);

  const moveWeek = (days: number) => {
    const nextAnchor = shiftLocalDate(weekAnchor, days);
    const nextSelectedDate = shiftLocalDate(selectedDate, days);

    if (nextAnchor && nextSelectedDate) {
      setWeekAnchor(nextAnchor);
      setSelectedDate(nextSelectedDate);
    }
  };

  const moveToToday = () => {
    setWeekAnchor(today);
    setSelectedDate(today);
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppText tone="primary" variant="caption" weight="bold">
          CALENDAR
        </AppText>
        <AppText variant="title" weight="heavy">
          주간 계획
        </AppText>
        <AppText tone="secondary">한 주를 넘겨보며 실행할 날짜를 골라보세요.</AppText>
      </View>

      <Card padded={false} style={styles.calendarCard}>
        <View style={styles.calendarHeading}>
          <View style={styles.calendarHeadingCopy}>
            <AppText variant="bodyLarge" weight="bold">
              {getWeekRangeLabel(weekDates)}
            </AppText>
            <AppText tone="secondary" variant="caption">
              월요일부터 일요일까지
            </AppText>
          </View>
          {weekDates.includes(today) ? (
            <View style={[styles.todayBadge, { backgroundColor: theme.colors.primarySoft }]}>
              <AppText tone="primary" variant="caption" weight="bold">
                이번 주
              </AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.weekRow}>
          {weekDates.map((date, index) => {
            const selected = date === selectedDate;
            const isToday = date === today;

            return (
              <Pressable
                accessibilityLabel={`${formatDateLabel(date, {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}${isToday ? ', 오늘' : ''}`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                key={date}
                onPress={() => setSelectedDate(date)}
                style={({ pressed }) => [
                  styles.dayButton,
                  {
                    backgroundColor: selected
                      ? theme.colors.primary
                      : pressed
                        ? theme.colors.primarySoft
                        : 'transparent',
                  },
                ]}
              >
                <AppText
                  align="center"
                  tone={selected ? 'default' : index >= 5 ? 'muted' : 'secondary'}
                  variant="caption"
                  weight="semibold"
                  style={selected ? { color: theme.colors.textOnPrimary } : undefined}
                >
                  {weekdayLabels[index]}
                </AppText>
                <AppText
                  align="center"
                  variant="bodyLarge"
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
          })}
        </View>

        <View style={[styles.navigation, { borderTopColor: theme.colors.border }]}>
          <Button variant="ghost" onPress={() => moveWeek(-7)} style={styles.navigationButton}>
            ← 이전 주
          </Button>
          <Button
            disabled={selectedDate === today}
            variant="secondary"
            onPress={moveToToday}
            style={styles.navigationButton}
          >
            오늘
          </Button>
          <Button variant="ghost" onPress={() => moveWeek(7)} style={styles.navigationButton}>
            다음 주 →
          </Button>
        </View>
      </Card>

      <Card style={styles.selectedDateCard}>
        <View style={styles.selectedDateCopy}>
          <AppText tone="primary" variant="caption" weight="bold">
            선택한 날짜
          </AppText>
          <AppText variant="bodyLarge" weight="bold">
            {formatDateLabel(selectedDate, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </AppText>
          <AppText tone="secondary" variant="label">
            다음 단계에서 이 날짜의 예정된 일정과 완료 항목을 연결합니다.
          </AppText>
        </View>
      </Card>
    </Screen>
  );
}

function getWeekRangeLabel(weekDates: LocalDateString[]) {
  const firstDate = weekDates[0];
  const lastDate = weekDates.at(-1);

  if (!firstDate || !lastDate) {
    return '날짜를 확인해 주세요';
  }

  const firstLabel = formatDateLabel(firstDate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const lastLabel = formatDateLabel(
    lastDate,
    firstDate.slice(0, 4) === lastDate.slice(0, 4)
      ? { month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' },
  );

  return `${firstLabel} – ${lastLabel}`;
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[6],
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[2],
  },
  calendarCard: {
    overflow: 'hidden',
  },
  calendarHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  calendarHeadingCopy: {
    flex: 1,
    gap: spacing[1],
  },
  todayBadge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  weekRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[4],
  },
  dayButton: {
    alignItems: 'center',
    borderRadius: radii.md,
    flex: 1,
    gap: spacing[1],
    justifyContent: 'center',
    minHeight: 76,
    minWidth: 0,
    paddingVertical: spacing[2],
  },
  todayDot: {
    borderRadius: radii.full,
    height: 4,
    width: 4,
  },
  navigation: {
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[2],
  },
  navigationButton: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: spacing[1],
  },
  selectedDateCard: {
    gap: spacing[4],
  },
  selectedDateCopy: {
    gap: spacing[1],
  },
});
