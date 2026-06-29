import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, Screen } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { useCompletedWeek } from './use-completed-week';

export function CompletedOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(today);
  const week = useCompletedWeek(selectedDate);
  const selectedDay = week.days.find((day) => day.date === selectedDate) ?? week.days[0];
  const weekTotal = week.days.reduce((total, day) => total + day.tasks.length, 0);
  const moveWeek = (days: number) => {
    const nextDate = shiftLocalDate(selectedDate, days);
    if (nextDate) setSelectedDate(nextDate);
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Button accessibilityLabel="More 화면으로 돌아가기" variant="ghost" onPress={router.back}>
          ← 돌아가기
        </Button>
        <View style={styles.titleBlock}>
          <AppText tone="primary" variant="caption" weight="bold">
            COMPLETED
          </AppText>
          <AppText variant="title" weight="heavy">
            완료 기록
          </AppText>
          <AppText tone="secondary">끝낸 일을 날짜별로 차분하게 돌아보세요.</AppText>
        </View>
      </View>

      <Card style={styles.weekCard}>
        <View style={styles.weekHeading}>
          <View style={styles.titleBlock}>
            <AppText variant="bodyLarge" weight="bold">
              {week.days[0]
                ? formatWeekRange(week.days[0].date, week.days.at(-1)?.date)
                : '이번 주'}
            </AppText>
            <AppText tone="secondary" variant="caption" weight="semibold">
              이번 주 완료 {weekTotal}개
            </AppText>
          </View>
          <Button
            disabled={selectedDate === today}
            variant="ghost"
            onPress={() => setSelectedDate(today)}
          >
            이번 주
          </Button>
        </View>

        <View style={styles.weekNavigation}>
          <Button variant="ghost" onPress={() => moveWeek(-7)} style={styles.weekMove}>
            ← 이전 주
          </Button>
          <Button variant="ghost" onPress={() => moveWeek(7)} style={styles.weekMove}>
            다음 주 →
          </Button>
        </View>

        <View style={styles.dayList}>
          {week.days.map((day) => {
            const selected = day.date === selectedDate;

            return (
              <Button
                key={day.date}
                accessibilityLabel={`${formatDateLabel(day.date)}, 완료 ${day.tasks.length}개`}
                accessibilityState={{ selected }}
                variant={selected ? 'primary' : 'secondary'}
                onPress={() => setSelectedDate(day.date)}
                style={styles.dayButton}
              >
                {formatDateLabel(day.date, { weekday: 'short' })} · {day.tasks.length}
              </Button>
            );
          })}
        </View>
      </Card>

      {week.isPending ? (
        <Card accessibilityLabel="완료 기록을 불러오는 중" style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            완료 기록을 불러오고 있어요.
          </AppText>
        </Card>
      ) : week.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.titleBlock}>
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              완료 기록을 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="label">
              {week.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void week.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : selectedDay?.tasks.length ? (
        <View style={styles.log}>
          <View style={styles.logHeading}>
            <AppText variant="bodyLarge" weight="bold">
              {formatDateLabel(selectedDay.date)}
            </AppText>
            <AppText tone="secondary" variant="label" weight="semibold">
              {selectedDay.tasks.length}개 완료
            </AppText>
          </View>
          <View style={styles.tasks}>
            {selectedDay.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={() =>
                  router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(task.id) } })
                }
              />
            ))}
          </View>
        </View>
      ) : (
        <Card>
          <EmptyState
            title="이날 완료한 일이 없어요"
            description="비어 있는 날도 괜찮아요. 다른 날짜를 눌러 지나온 기록을 확인해 보세요."
          />
        </Card>
      )}
    </Screen>
  );
}

function formatWeekRange(start: LocalDateString, end?: LocalDateString) {
  if (!end) return formatDateLabel(start);

  return `${formatDateLabel(start, { month: 'short', day: 'numeric' })} – ${formatDateLabel(end, {
    month: 'short',
    day: 'numeric',
  })}`;
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[5],
    paddingTop: spacing[3],
  },
  header: {
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  titleBlock: {
    gap: spacing[2],
  },
  weekCard: {
    gap: spacing[3],
  },
  weekHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  weekNavigation: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  weekMove: {
    flex: 1,
  },
  dayList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  dayButton: {
    borderRadius: radii.md,
    flexGrow: 1,
    minWidth: 82,
  },
  stateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 120,
  },
  errorCard: {
    gap: spacing[4],
  },
  log: {
    gap: spacing[3],
  },
  logHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  tasks: {
    gap: spacing[2],
  },
});
