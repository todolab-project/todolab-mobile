import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState, FadeInView, ListSkeleton } from '@/components/ui';
import {
  ScheduleCard,
  TaskCard,
  useCompleteTask,
  useReopenTask,
  useReorderTodayTask,
} from '@/features/tasks';
import { motion, radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';

import { splitTodayTasks } from './today-task-sections';
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
    error,
    supplementalError,
    refetch,
  } = overview;
  const completeTask = useCompleteTask(date);
  const reopenTask = useReopenTask(date);
  const reorderTodayTask = useReorderTodayTask(date);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const { scheduleTasks, executionTasks } = splitTodayTasks(todayTasks);
  const reviewItemCount = staleTasks.length + recommendations.length + inboxTasks.length;
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
    return <ListSkeleton accessibilityLabel="Today 정보를 불러오는 중" />;
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
          <AppText tone="danger" variant="label" weight="bold">
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
      {sortedScheduleTasks.length > 0 ? (
        <View style={styles.scheduleSection}>
          <View style={styles.taskSectionHeading}>
            <View style={styles.taskSectionCopy}>
              <View style={[styles.sectionMarker, { backgroundColor: theme.colors.primary }]} />
              <AppText variant="bodyLarge" weight="bold">
                일정
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
              <ScheduleCard
                completionDisabled={completeTask.isPending}
                isCompleting={completeTask.isPending && completeTask.variables === task.id}
                key={task.id}
                task={task}
                onComplete={() =>
                  completeTask.mutate(task.id, {
                    onSuccess: () => showFeedback('일정을 완료했어요.'),
                  })
                }
                onOpen={() => openTask(task.id)}
              />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <View style={[styles.sectionMarker, { backgroundColor: theme.colors.primary }]} />
            <AppText variant="bodyLarge" weight="bold">
              오늘 할 일
            </AppText>
          </View>
          <AppText tone="primary" variant="label" weight="bold">
            {executionTasks.length}개
          </AppText>
        </View>

        {completeTask.error || reorderTodayTask.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {completeTask.error?.message ?? reorderTodayTask.error?.message}
            </AppText>
          </View>
        ) : null}

        {executionTasks.length === 0 ? (
          <EmptyState
            title="오늘 할 일이 없어요"
            description="빠르게 기록하거나 새 할 일을 추가해 보세요."
            action={
              <Button variant="secondary" onPress={() => router.push('/tasks/new')}>
                새 할 일
              </Button>
            }
          />
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
        <FadeInView
          accessibilityLiveRegion="polite"
          duration={motion.duration.normal}
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
        </FadeInView>
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

      {reviewItemCount > 0 ? (
        <View style={styles.reviewSection}>
          <Pressable
            accessibilityHint="지난 미완료, 추천, 기록함을 정리하는 화면을 엽니다."
            accessibilityLabel={`정리할 항목 ${reviewItemCount}개`}
            accessibilityRole="button"
            onPress={() => router.push('/today/review')}
            style={({ pressed }) => [
              styles.reviewRow,
              {
                backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <View style={styles.reviewCopy}>
              <AppText weight="semibold">정리할 항목</AppText>
              <AppText numberOfLines={1} tone="secondary" variant="caption">
                미완료 {staleTasks.length} · 추천 {recommendations.length} · 기록함{' '}
                {inboxTasks.length}
              </AppText>
            </View>
            <AppText tone="secondary" variant="label" weight="bold">
              {reviewItemCount}개 ›
            </AppText>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <View style={[styles.sectionMarker, { backgroundColor: theme.colors.success }]} />
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

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  feedbackBanner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  countPill: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  errorCard: {
    gap: spacing[3],
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
  taskSection: {
    gap: spacing[2],
  },
  scheduleSection: {
    gap: spacing[2],
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
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2],
  },
  sectionMarker: {
    borderRadius: radii.full,
    height: 8,
    width: 8,
  },
  reviewSection: {
    gap: spacing[2],
  },
  reviewRow: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    minHeight: 60,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  reviewCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  completedSectionActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  completedToggleButton: {
    minWidth: 56,
  },
  taskList: {
    gap: spacing[2],
  },
  inlineError: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
});
