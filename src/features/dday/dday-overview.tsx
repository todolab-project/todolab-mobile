import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { AppText, Button, Card, EmptyState, Screen } from '@/components/ui';
import { radii, spacing, useAppTheme } from '@/theme';
import type { DdayGoalResponse } from '@/types';
import { formatDateLabel } from '@/utils';

import { getDdayLabel } from './dday-label';
import { DdayCreateForm } from './dday-create-form';
import { DdayGoalTasks } from './dday-goal-tasks';
import { DdayTodayTaskForm } from './dday-today-task-form';
import { useDeleteDdayGoal } from './use-delete-dday-goal';
import { useDdayGoals } from './use-dday-goals';

export function DdayOverview() {
  const theme = useAppTheme();
  const [isCreating, setIsCreating] = useState(false);
  const [confirmingDeleteGoalId, setConfirmingDeleteGoalId] = useState<number | null>(null);
  const [creatingTaskGoalId, setCreatingTaskGoalId] = useState<number | null>(null);
  const [expandedGoalIds, setExpandedGoalIds] = useState<number[]>([]);
  const query = useDdayGoals();
  const goals = [...(query.data ?? [])].sort((left, right) =>
    left.targetDate.localeCompare(right.targetDate),
  );

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <AppText tone="primary" variant="caption" weight="bold">
          D-DAY
        </AppText>
        <AppText variant="title" weight="heavy">
          목표까지 한 걸음씩
        </AppText>
        <AppText tone="secondary">중요한 날짜와 오늘 남은 거리를 확인해 보세요.</AppText>
      </View>

      {isCreating ? (
        <DdayCreateForm
          onCancel={() => setIsCreating(false)}
          onCreated={() => setIsCreating(false)}
        />
      ) : (
        <Button fullWidth onPress={() => setIsCreating(true)}>
          새 D-Day 만들기
        </Button>
      )}

      {query.isPending ? (
        <Card accessibilityLabel="D-Day 목표를 불러오는 중" style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            목표를 불러오고 있어요.
          </AppText>
        </Card>
      ) : query.error ? (
        <Card
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.errorCopy}>
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              D-Day를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="label">
              {query.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            title="아직 D-Day가 없어요"
            description="중요한 목표 날짜를 만들면 남은 날을 이곳에서 확인할 수 있어요."
            action={
              isCreating ? undefined : (
                <Button variant="secondary" onPress={() => setIsCreating(true)}>
                  첫 목표 만들기
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <View style={styles.goalList}>
          <View style={styles.listHeading}>
            <AppText variant="bodyLarge" weight="bold">
              나의 D-Day
            </AppText>
            <AppText tone="secondary" variant="label" weight="semibold">
              {goals.length}개
            </AppText>
          </View>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <DdayGoalCard
                expanded={expandedGoalIds.includes(goal.id)}
                goal={goal}
                onCreateTodayTask={() => setCreatingTaskGoalId(goal.id)}
                onRequestDelete={() => setConfirmingDeleteGoalId(goal.id)}
                onToggleTasks={() =>
                  setExpandedGoalIds((current) =>
                    current.includes(goal.id)
                      ? current.filter((goalId) => goalId !== goal.id)
                      : [...current, goal.id],
                  )
                }
              />
              {expandedGoalIds.includes(goal.id) ? (
                <DdayGoalTasks goalId={goal.id} goalTitle={goal.title} />
              ) : null}
              {creatingTaskGoalId === goal.id ? (
                <DdayTodayTaskForm
                  goalId={goal.id}
                  goalTitle={goal.title}
                  onCancel={() => setCreatingTaskGoalId(null)}
                  onCreated={() => {
                    setCreatingTaskGoalId(null);
                    setExpandedGoalIds((current) =>
                      current.includes(goal.id) ? current : [...current, goal.id],
                    );
                  }}
                />
              ) : null}
              {confirmingDeleteGoalId === goal.id ? (
                <DdayDeleteConfirmation
                  goal={goal}
                  onCancel={() => setConfirmingDeleteGoalId(null)}
                  onDeleted={() => setConfirmingDeleteGoalId(null)}
                />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

function DdayGoalCard({
  goal,
  expanded,
  onCreateTodayTask,
  onToggleTasks,
  onRequestDelete,
}: {
  goal: DdayGoalResponse;
  expanded: boolean;
  onCreateTodayTask: () => void;
  onToggleTasks: () => void;
  onRequestDelete: () => void;
}) {
  const theme = useAppTheme();
  const dayLabel = getDdayLabel(goal.daysLeft);
  const isToday = goal.daysLeft === 0;
  const isPast = goal.daysLeft < 0;
  const tone = isToday ? 'warning' : isPast ? 'secondary' : 'primary';
  const badgeBackground = isToday
    ? theme.colors.warningSoft
    : isPast
      ? theme.colors.surfaceMuted
      : theme.colors.primarySoft;

  return (
    <Card style={styles.goalCard}>
      <View
        accessible
        accessibilityLabel={`${goal.title}, ${dayLabel}, 목표일 ${formatDateLabel(goal.targetDate)}`}
        style={styles.goalContent}
      >
        <View style={styles.goalCopy}>
          <AppText numberOfLines={2} variant="bodyLarge" weight="bold">
            {goal.title}
          </AppText>
          <AppText tone="secondary" variant="label">
            {formatDateLabel(goal.targetDate, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </AppText>
        </View>
        <View style={[styles.dayBadge, { backgroundColor: badgeBackground }]}>
          <AppText tone={tone} variant="bodyLarge" weight="heavy">
            {dayLabel}
          </AppText>
        </View>
      </View>
      <View style={styles.goalActions}>
        <Button
          accessibilityLabel={`${goal.title} 목표의 Today 할 일 만들기`}
          variant="secondary"
          onPress={onCreateTodayTask}
          style={styles.goalActionButton}
        >
          Today 할 일
        </Button>
        <Button
          accessibilityLabel={`${goal.title} 연결된 할 일 ${expanded ? '접기' : '펼치기'}`}
          accessibilityState={{ expanded }}
          variant="secondary"
          onPress={onToggleTasks}
          style={styles.goalActionButton}
        >
          {expanded ? '할 일 접기' : '연결된 할 일'}
        </Button>
        <Button
          accessibilityLabel={`${goal.title} D-Day 삭제`}
          variant="ghost"
          onPress={onRequestDelete}
          style={styles.goalActionButton}
        >
          삭제
        </Button>
      </View>
    </Card>
  );
}

function DdayDeleteConfirmation({
  goal,
  onCancel,
  onDeleted,
}: {
  goal: DdayGoalResponse;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const theme = useAppTheme();
  const deleteGoal = useDeleteDdayGoal();

  return (
    <Card
      accessibilityLiveRegion="polite"
      style={[
        styles.deleteCard,
        { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
      ]}
    >
      <View style={styles.errorCopy}>
        <AppText tone="danger" variant="label" weight="bold">
          “{goal.title}” 목표를 삭제할까요?
        </AppText>
        <AppText tone="secondary" variant="caption">
          목표 목록에서 사라지며 현재 앱에서는 되돌릴 수 없어요.
        </AppText>
      </View>

      {deleteGoal.error ? (
        <AppText tone="danger" variant="caption">
          {deleteGoal.error.message}
        </AppText>
      ) : null}

      <View style={styles.deleteActions}>
        <Button disabled={deleteGoal.isPending} fullWidth variant="secondary" onPress={onCancel}>
          취소
        </Button>
        <Button
          fullWidth
          loading={deleteGoal.isPending}
          variant="danger"
          onPress={() => deleteGoal.mutate(goal.id, { onSuccess: onDeleted })}
        >
          영구 삭제
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: spacing[6],
    paddingTop: spacing[6],
  },
  header: {
    gap: spacing[2],
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
  errorCopy: {
    gap: spacing[1],
  },
  deleteCard: {
    gap: spacing[3],
  },
  deleteActions: {
    gap: spacing[2],
  },
  goalList: {
    gap: spacing[3],
  },
  goalItem: {
    gap: spacing[2],
  },
  listHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalCard: {
    gap: spacing[3],
  },
  goalContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[4],
  },
  goalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  goalActionButton: {
    flexGrow: 1,
    minWidth: 96,
  },
  goalCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  dayBadge: {
    borderRadius: radii.full,
    minWidth: 72,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
