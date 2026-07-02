import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Card,
  EmptyState,
  IconButton,
  ListSkeleton,
  PageHeader,
  Screen,
} from '@/components/ui';
import { TaskCard, useReopenTask } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';
import { formatDateLabel, shiftLocalDate, toApiLocalDate } from '@/utils';

import { getCompletedSummary } from './completed-summary';
import { useCompletedWeek } from './use-completed-week';

export function CompletedOverview() {
  const router = useRouter();
  const theme = useAppTheme();
  const today = toApiLocalDate();
  const [selectedDate, setSelectedDate] = useState<LocalDateString>(today);
  const [focusedDate, setFocusedDate] = useState<LocalDateString | null>(null);
  const [menuTaskId, setMenuTaskId] = useState<number | null>(null);
  const week = useCompletedWeek(selectedDate);
  const reopenTask = useReopenTask(selectedDate);
  const selectedDay = week.days.find((day) => day.date === selectedDate) ?? week.days[0];
  const summary = getCompletedSummary(week.days);
  const moveWeek = (days: number) => {
    const nextDate = shiftLocalDate(selectedDate, days);
    if (nextDate) setSelectedDate(nextDate);
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <PageHeader
        title="완료 기록"
        leading={
          <IconButton accessibilityLabel="More 화면으로 돌아가기" onPress={router.back}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.colors.text}
            />
          </IconButton>
        }
      />

      <Card padded={false} style={styles.weekCard}>
        <View style={styles.weekHeading}>
          <IconButton accessibilityLabel="이전 주" onPress={() => moveWeek(-7)}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
          <AppText align="center" style={styles.weekLabel} variant="label" weight="bold">
            {week.days[0] ? formatWeekRange(week.days[0].date, week.days.at(-1)?.date) : '이번 주'}
          </AppText>
          <IconButton accessibilityLabel="다음 주" onPress={() => moveWeek(7)}>
            <SymbolView
              name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
              size={20}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
          <IconButton
            accessibilityLabel="이번 주로 이동"
            disabled={selectedDate === today}
            onPress={() => setSelectedDate(today)}
          >
            <SymbolView
              name={{ ios: 'calendar', android: 'today', web: 'today' }}
              size={18}
              tintColor={theme.colors.textSecondary}
            />
          </IconButton>
        </View>

        <View style={[styles.dayList, { borderTopColor: theme.colors.border }]}>
          {week.days.map((day) => {
            const selected = day.date === selectedDate;

            return (
              <Pressable
                key={day.date}
                accessibilityLabel={`${formatDateLabel(day.date)}, 완료 ${day.tasks.length}개`}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onBlur={() => setFocusedDate(null)}
                onFocus={() => setFocusedDate(day.date)}
                onPress={() => setSelectedDate(day.date)}
                style={[
                  styles.dayButton,
                  {
                    backgroundColor:
                      selected || focusedDate === day.date
                        ? theme.colors.primarySoft
                        : theme.colors.surface,
                    borderColor: focusedDate === day.date ? theme.colors.primary : 'transparent',
                  },
                ]}
              >
                <AppText
                  align="center"
                  tone={selected ? 'primary' : 'secondary'}
                  variant="caption"
                  weight="semibold"
                >
                  {formatDateLabel(day.date, { weekday: 'short' })}
                </AppText>
                <AppText
                  align="center"
                  tone={selected ? 'primary' : 'default'}
                  variant="label"
                  weight="bold"
                >
                  {day.tasks.length}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {week.isPending ? (
        <ListSkeleton accessibilityLabel="완료 기록을 불러오는 중" />
      ) : week.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.titleBlock}>
            <AppText tone="danger" variant="label" weight="bold">
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
      ) : (
        <>
          {selectedDay?.tasks.length ? (
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
                    completionDisabled={reopenTask.isPending}
                    trailing={
                      <IconButton
                        accessibilityLabel={`${task.title}, 완료 항목 메뉴 ${
                          menuTaskId === task.id ? '닫기' : '열기'
                        }`}
                        selected={menuTaskId === task.id}
                        onPress={() =>
                          setMenuTaskId((current) => (current === task.id ? null : task.id))
                        }
                      >
                        <AppText tone="secondary" weight="bold">
                          ⋯
                        </AppText>
                      </IconButton>
                    }
                    action={
                      menuTaskId === task.id ? (
                        <Button
                          accessibilityLabel={`${task.title}, 오늘 할 일로 다시 열기`}
                          loading={reopenTask.isPending && reopenTask.variables === task.id}
                          disabled={reopenTask.isPending}
                          size="compact"
                          variant="ghost"
                          onPress={() =>
                            reopenTask.mutate(task.id, {
                              onSuccess: () => setMenuTaskId(null),
                            })
                          }
                        >
                          다시 열기
                        </Button>
                      ) : null
                    }
                    onOpen={() =>
                      router.push({
                        pathname: '/tasks/[taskId]',
                        params: { taskId: String(task.id) },
                      })
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

          {reopenTask.error ? (
            <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
              {reopenTask.error.message}
            </AppText>
          ) : null}

          <Card variant="muted" style={styles.summaryCard}>
            <AppText variant="label" weight="semibold">
              이번 주 {summary.total}개 완료 · {summary.activeDays}일 기록
            </AppText>
            <AppText numberOfLines={1} tone="secondary" variant="caption">
              {summary.message}
            </AppText>
          </Card>
        </>
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
    paddingTop: spacing[4],
  },
  titleBlock: {
    gap: spacing[2],
  },
  weekCard: {
    overflow: 'hidden',
  },
  weekHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[1],
    padding: spacing[2],
  },
  weekLabel: {
    flex: 1,
  },
  dayList: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dayButton: {
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    gap: spacing[1],
    justifyContent: 'center',
    minHeight: 52,
  },
  errorCard: {
    gap: spacing[3],
  },
  summaryCard: {
    gap: spacing[1],
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
