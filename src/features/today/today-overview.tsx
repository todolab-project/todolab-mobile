import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import {
  ScheduleCard,
  TaskCard,
  useCompleteTask,
  useMoveTaskToToday,
  useReopenTask,
  useReorderTodayTask,
} from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';

import {
  getTodayLoadGuidance,
  RECOMMENDED_TODAY_TASK_COUNT,
  splitTodayTasks,
} from './today-task-sections';
import { DraggableTodayTaskList } from './draggable-today-task-list';
import { useTodayOverview } from './use-today-overview';

type TodayOverviewProps = {
  date: LocalDateString;
  overview: ReturnType<typeof useTodayOverview>;
};

type FeedbackMessage = {
  tone: 'success' | 'default';
  message: string;
};

export function TodayOverview({ date, overview }: TodayOverviewProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const {
    todayTasks,
    recommendations,
    doneTasks,
    staleTasks,
    inboxTasks,
    isPending,
    isRefreshing,
    error,
    supplementalError,
    refetch,
  } = overview;
  const completeTask = useCompleteTask(date);
  const moveToToday = useMoveTaskToToday(date);
  const reopenTask = useReopenTask(date);
  const reorderTodayTask = useReorderTodayTask(date);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const { scheduleTasks, executionTasks } = splitTodayTasks(todayTasks);
  const loadGuidance = getTodayLoadGuidance(executionTasks.length, scheduleTasks.length);
  const plannedTaskCount = todayTasks.length + doneTasks.length;
  const sortedScheduleTasks = [...scheduleTasks].sort(compareScheduleTasks);
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };
  const showFeedback = (message: string) => {
    setFeedback({ tone: 'success', message });
  };
  const moveTaskToIndex = async (taskId: number, fromIndex: number, toIndex: number) => {
    const direction = toIndex < fromIndex ? 'UP' : 'DOWN';
    const moveCount = Math.abs(toIndex - fromIndex);

    for (let moveIndex = 0; moveIndex < moveCount; moveIndex += 1) {
      await reorderTodayTask.mutateAsync({ taskId, direction });
    }

    showFeedback('실행 순서를 옮겼어요.');
  };

  if (isPending) {
    return (
      <Card accessibilityLabel="Today 정보를 불러오는 중" style={styles.loadingCard}>
        <ActivityIndicator color={theme.colors.primary} />
        <AppText tone="secondary" variant="label">
          오늘의 계획을 불러오고 있어요.
        </AppText>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        style={[
          styles.errorCard,
          {
            backgroundColor: theme.colors.dangerSoft,
            borderColor: theme.colors.danger,
          },
        ]}
      >
        <View style={styles.errorCopy}>
          <AppText tone="danger" variant="bodyLarge" weight="bold">
            정보를 불러오지 못했어요
          </AppText>
          <AppText tone="secondary" variant="label">
            {error.message}
          </AppText>
        </View>
        <Button variant="secondary" onPress={() => void refetch()}>
          다시 시도
        </Button>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              오늘 실행할 일
            </AppText>
            <AppText tone="secondary" variant="label">
              실행할 순서대로 하나씩 완료해요.
            </AppText>
          </View>
          <View style={styles.taskSectionActions}>
            <AppText tone="primary" variant="label" weight="bold">
              {executionTasks.length}개
            </AppText>
            <Button
              accessibilityLabel="Today 정보 새로고침"
              disabled={isRefreshing}
              variant="ghost"
              onPress={() => void refetch()}
              style={styles.refreshButton}
            >
              새로고침
            </Button>
          </View>
        </View>

        {completeTask.error || reorderTodayTask.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {completeTask.error?.message ?? reorderTodayTask.error?.message}
            </AppText>
          </View>
        ) : null}

        {executionTasks.length === 0 ? (
          <Card>
            <EmptyState
              title="오늘 실행할 일이 없어요"
              description="빠르게 기록하거나 아래 기록함에서 오늘 할 일을 골라보세요."
              action={
                <Button variant="secondary" onPress={() => router.push('/tasks/new')}>
                  자세히 작성하기
                </Button>
              }
            />
          </Card>
        ) : (
          <DraggableTodayTaskList
            tasks={executionTasks}
            disabled={completeTask.isPending || reorderTodayTask.isPending}
            completingTaskId={completeTask.isPending ? completeTask.variables : undefined}
            onComplete={(taskId) =>
              completeTask.mutate(taskId, {
                onSuccess: () => showFeedback('오늘 할 일을 완료했어요.'),
              })
            }
            onMove={(taskId, fromIndex, toIndex) =>
              void moveTaskToIndex(taskId, fromIndex, toIndex)
            }
            onMoveOneStep={(taskId, direction) =>
              reorderTodayTask.mutate(
                { taskId, direction },
                { onSuccess: () => showFeedback('실행 순서를 옮겼어요.') },
              )
            }
            onOpen={openTask}
          />
        )}
      </View>

      {feedback ? (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.feedbackBanner,
            {
              backgroundColor:
                feedback.tone === 'success' ? theme.colors.successSoft : theme.colors.primarySoft,
            },
          ]}
        >
          <AppText tone={feedback.tone} variant="label" weight="bold">
            {feedback.message}
          </AppText>
        </View>
      ) : null}

      {supplementalError ? (
        <Card
          style={[
            styles.supplementalErrorCard,
            {
              backgroundColor: theme.colors.warningSoft,
              borderColor: theme.colors.warning,
            },
          ]}
        >
          <View style={styles.supplementalErrorCopy}>
            <AppText tone="warning" variant="label" weight="bold">
              일부 정보를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="caption">
              오늘 계획은 계속 사용할 수 있어요. {supplementalError.message}
            </AppText>
          </View>
          <Button variant="ghost" onPress={() => void refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : null}

      <Card
        accessible
        accessibilityLabel={`오늘 진행 요약. 완료 ${doneTasks.length}개, 전체 ${plannedTaskCount}개, 지난 미완료 ${staleTasks.length}개, 추천 ${recommendations.length}개, 기록함 ${inboxTasks.length}개`}
        variant="muted"
        style={styles.progressSummaryCard}
      >
        <AppText variant="label" weight="bold">
          완료 {doneTasks.length}/{plannedTaskCount}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption" style={styles.progressMeta}>
          미완료 {staleTasks.length} · 추천 {recommendations.length} · 기록함 {inboxTasks.length}
        </AppText>
      </Card>

      {loadGuidance ? (
        <Card
          accessibilityLabel={`오늘 계획 과부하 안내. ${loadGuidance.description}`}
          style={[
            styles.capacityCard,
            {
              backgroundColor: theme.colors.warningSoft,
              borderColor: theme.colors.warning,
            },
          ]}
        >
          <View style={styles.capacityHeading}>
            <View style={styles.capacityCopy}>
              <AppText tone="warning" variant="bodyLarge" weight="bold">
                {loadGuidance.title}
              </AppText>
              <AppText tone="secondary" variant="label">
                {loadGuidance.description}
              </AppText>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.colors.surface }]}>
              <AppText tone="warning" variant="caption" weight="bold">
                +{loadGuidance.excessCount}
              </AppText>
            </View>
          </View>
          <View style={styles.capacityMeter} accessibilityElementsHidden>
            {executionTasks.slice(0, 10).map((task, index) => (
              <View
                key={task.id}
                style={[
                  styles.capacitySegment,
                  {
                    backgroundColor:
                      index < RECOMMENDED_TODAY_TASK_COUNT
                        ? theme.colors.primary
                        : theme.colors.warning,
                  },
                ]}
              />
            ))}
          </View>
          <AppText tone="secondary" variant="caption">
            파란색은 권장 범위, 주황색은 오늘 덜어내면 좋은 항목이에요.
          </AppText>
        </Card>
      ) : null}

      {staleTasks.length > 0 ? (
        <Card style={styles.compactEntryCard}>
          <View style={styles.compactEntryCopy}>
            <View style={styles.compactEntryTitleRow}>
              <AppText variant="label" weight="bold">
                지난 미완료
              </AppText>
              <View style={[styles.countPill, { backgroundColor: theme.colors.warningSoft }]}>
                <AppText tone="warning" variant="caption" weight="bold">
                  {staleTasks.length}개
                </AppText>
              </View>
            </View>
            <AppText numberOfLines={1} tone="secondary" variant="caption">
              {staleTasks[0].title} · {getStaleTaskMeta(staleTasks[0])}
            </AppText>
          </View>
          <View style={styles.compactEntryActions}>
            <Button variant="ghost" onPress={() => openTask(staleTasks[0].id)}>
              보기
            </Button>
            <Button
              loading={moveToToday.isPending && moveToToday.variables === staleTasks[0].id}
              disabled={moveToToday.isPending}
              variant="secondary"
              onPress={() =>
                moveToToday.mutate(staleTasks[0].id, {
                  onSuccess: () => showFeedback('지난 미완료를 오늘 할 일로 옮겼어요.'),
                })
              }
            >
              오늘
            </Button>
          </View>
          {moveToToday.error ? (
            <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
              <AppText tone="danger" variant="label">
                {moveToToday.error.message}
              </AppText>
            </View>
          ) : null}
        </Card>
      ) : null}

      {recommendations.length > 0 ? (
        <Card style={styles.compactEntryCard}>
          <View style={styles.compactEntryCopy}>
            <View style={styles.compactEntryTitleRow}>
              <AppText variant="label" weight="bold">
                오늘의 추천
              </AppText>
              <View style={[styles.countPill, { backgroundColor: theme.colors.primarySoft }]}>
                <AppText tone="primary" variant="caption" weight="bold">
                  {recommendations.length}개
                </AppText>
              </View>
            </View>
            <AppText numberOfLines={1} tone="secondary" variant="caption">
              {recommendations[0].task.title} · {recommendations[0].reason}
            </AppText>
          </View>
          <View style={styles.compactEntryActions}>
            <Button variant="ghost" onPress={() => openTask(recommendations[0].task.id)}>
              보기
            </Button>
            <Button
              disabled={moveToToday.isPending}
              loading={
                moveToToday.isPending && moveToToday.variables === recommendations[0].task.id
              }
              variant="secondary"
              onPress={() =>
                moveToToday.mutate(recommendations[0].task.id, {
                  onSuccess: () => showFeedback('추천 항목을 오늘 할 일로 추가했어요.'),
                })
              }
            >
              추가
            </Button>
          </View>
          {moveToToday.error ? (
            <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
              <AppText tone="danger" variant="label">
                {moveToToday.error.message}
              </AppText>
            </View>
          ) : null}
        </Card>
      ) : null}

      {sortedScheduleTasks.length > 0 ? (
        <View style={styles.scheduleSection}>
          <View style={styles.taskSectionHeading}>
            <View style={styles.taskSectionCopy}>
              <AppText variant="bodyLarge" weight="bold">
                캘린더 일정
              </AppText>
              <AppText tone="secondary" variant="label">
                시간순으로 약속만 짧게 확인해요.
              </AppText>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.colors.surfaceMuted }]}>
              <AppText tone="secondary" variant="caption" weight="bold">
                {sortedScheduleTasks.length}개
              </AppText>
            </View>
          </View>

          <View style={styles.scheduleList}>
            {sortedScheduleTasks.map((task) => (
              <ScheduleCard key={task.id} task={task} onOpen={() => openTask(task.id)} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              아직 고르지 않은 일
            </AppText>
            <AppText tone="secondary" variant="label">
              기록함에서 오늘 실행할 일을 골라요.
            </AppText>
          </View>
          <AppText tone="primary" variant="label" weight="bold">
            {inboxTasks.length}개
          </AppText>
        </View>

        {moveToToday.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {moveToToday.error.message}
            </AppText>
          </View>
        ) : null}

        {inboxTasks.length === 0 ? (
          <Card variant="muted">
            <EmptyState
              title="기록함이 비어 있어요"
              description="생각난 일을 바로 기록하거나 자세히 작성해 보세요."
              action={
                <Button variant="secondary" onPress={() => router.push('/tasks/new')}>
                  새 할 일 작성
                </Button>
              }
            />
          </Card>
        ) : (
          <View style={styles.taskList}>
            {inboxTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={() => openTask(task.id)}
                action={
                  <Button
                    accessibilityLabel={`${task.title}, 오늘 할 일로 이동`}
                    loading={moveToToday.isPending && moveToToday.variables === task.id}
                    disabled={moveToToday.isPending}
                    variant="secondary"
                    onPress={() =>
                      moveToToday.mutate(task.id, {
                        onSuccess: () => showFeedback('기록함에서 오늘 할 일로 옮겼어요.'),
                      })
                    }
                    style={styles.moveButton}
                  >
                    오늘 하기
                  </Button>
                }
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              오늘 완료한 일
            </AppText>
          </View>
          <View style={styles.completedSectionActions}>
            <AppText tone="success" variant="label" weight="bold">
              {doneTasks.length}개
            </AppText>
            {doneTasks.length > 0 ? (
              <Button
                accessibilityLabel={`완료한 일 목록 ${isCompletedExpanded ? '접기' : '펼치기'}`}
                variant="ghost"
                onPress={() => setIsCompletedExpanded((current) => !current)}
                style={styles.completedToggleButton}
              >
                {isCompletedExpanded ? '접기' : '펼치기'}
              </Button>
            ) : null}
          </View>
        </View>

        {isCompletedExpanded && reopenTask.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {reopenTask.error.message}
            </AppText>
          </View>
        ) : null}

        {isCompletedExpanded && doneTasks.length > 0 ? (
          <View style={styles.taskList}>
            {doneTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={() => openTask(task.id)}
                completionDisabled={reopenTask.isPending}
                isCompleting={reopenTask.isPending && reopenTask.variables === task.id}
                onReopen={() =>
                  reopenTask.mutate(task.id, {
                    onSuccess: () => showFeedback('완료 항목을 오늘 할 일로 다시 열었어요.'),
                  })
                }
                action={
                  <Button
                    accessibilityLabel={`${task.title}, 오늘 할 일로 다시 열기`}
                    loading={reopenTask.isPending && reopenTask.variables === task.id}
                    disabled={reopenTask.isPending}
                    variant="ghost"
                    onPress={() =>
                      reopenTask.mutate(task.id, {
                        onSuccess: () => showFeedback('완료 항목을 오늘 할 일로 다시 열었어요.'),
                      })
                    }
                    style={styles.moveButton}
                  >
                    다시 열기
                  </Button>
                }
              />
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function compareScheduleTasks(left: TaskResponse, right: TaskResponse) {
  if (!left.startAt && !right.startAt) {
    return left.id - right.id;
  }

  if (!left.startAt) {
    return 1;
  }

  if (!right.startAt) {
    return -1;
  }

  return left.startAt.localeCompare(right.startAt);
}

function getStaleTaskMeta(task: { plannedDate: LocalDateString | null; carryOverCount: number }) {
  const plannedLabel = task.plannedDate ? `계획일 ${task.plannedDate}` : '계획일 없음';

  return plannedLabel;
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  feedbackBanner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  capacityCard: {
    gap: spacing[3],
  },
  capacityHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  capacityCopy: {
    flex: 1,
    gap: spacing[1],
  },
  capacityMeter: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  capacitySegment: {
    borderRadius: radii.full,
    flex: 1,
    height: 6,
    maxWidth: 44,
  },
  countPill: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  compactEntryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  compactEntryCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  compactEntryTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  compactEntryActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  loadingCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 96,
  },
  errorCard: {
    gap: spacing[4],
  },
  errorCopy: {
    gap: spacing[1],
  },
  supplementalErrorCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
  },
  supplementalErrorCopy: {
    flex: 1,
    gap: spacing[1],
  },
  progressSummaryCard: {
    alignItems: 'center',
    borderRadius: radii.lg,
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  progressMeta: {
    flex: 1,
    minWidth: 0,
  },
  taskSection: {
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  scheduleSection: {
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  scheduleList: {
    gap: spacing[2],
  },
  taskSectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  taskSectionCopy: {
    flex: 1,
    gap: spacing[1],
  },
  taskSectionActions: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  completedSectionActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  completedToggleButton: {
    minWidth: 64,
  },
  refreshButton: {
    minWidth: 76,
  },
  taskList: {
    gap: spacing[2],
  },
  inlineError: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  moveButton: {
    minWidth: 88,
  },
});
