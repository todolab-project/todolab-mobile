import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import { TaskCard, useCompleteTask, useMoveTaskToToday, useReopenTask } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';

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
  const { todayTasks, doneTasks, inboxTasks, isPending, isRefreshing, error, refetch } = overview;
  const completeTask = useCompleteTask(date);
  const moveToToday = useMoveTaskToToday(date);
  const reopenTask = useReopenTask(date);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };
  const showFeedback = (message: string) => {
    setFeedback({ tone: 'success', message });
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
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText variant="bodyLarge" weight="bold">
            오늘의 흐름
          </AppText>
          <AppText tone="secondary" variant="label">
            해야 할 일과 기록을 한눈에 확인해요.
          </AppText>
        </View>
        <Button
          accessibilityLabel="Today 정보 새로고침"
          disabled={isRefreshing}
          variant="ghost"
          onPress={() => void refetch()}
        >
          새로고침
        </Button>
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

      <Card style={styles.summaryCard}>
        <SummaryItem label="오늘 할 일" value={todayTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="기록함" value={inboxTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="완료" value={doneTasks.length} tone="success" />
      </Card>

      <View style={styles.taskSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              오늘 할 일
            </AppText>
            <AppText tone="secondary" variant="label">
              실행할 순서대로 하나씩 완료해요.
            </AppText>
          </View>
          <AppText tone="primary" variant="label" weight="bold">
            {todayTasks.length}개
          </AppText>
        </View>

        {completeTask.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {completeTask.error.message}
            </AppText>
          </View>
        ) : null}

        {todayTasks.length === 0 ? (
          <Card>
            <EmptyState
              title="오늘 할 일이 없어요"
              description="빠르게 기록하거나 아래 기록함에서 오늘 할 일을 골라보세요."
              action={
                <Button variant="secondary" onPress={() => router.push('/tasks/new')}>
                  자세히 작성하기
                </Button>
              }
            />
          </Card>
        ) : (
          <View style={styles.taskList}>
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onOpen={() => openTask(task.id)}
                completionDisabled={completeTask.isPending}
                isCompleting={completeTask.isPending && completeTask.variables === task.id}
                onComplete={() =>
                  completeTask.mutate(task.id, {
                    onSuccess: () => showFeedback('오늘 할 일을 완료했어요.'),
                  })
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
            <AppText tone="secondary" variant="label">
              끝낸 일을 확인하며 하루의 흐름을 돌아봐요.
            </AppText>
          </View>
          <AppText tone="success" variant="label" weight="bold">
            {doneTasks.length}개
          </AppText>
        </View>

        {reopenTask.error ? (
          <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
            <AppText tone="danger" variant="label">
              {reopenTask.error.message}
            </AppText>
          </View>
        ) : null}

        {doneTasks.length === 0 ? (
          <Card variant="muted">
            <EmptyState
              title="아직 완료한 일이 없어요"
              description="작게 하나 끝내고 흐름을 만들어봐요."
            />
          </Card>
        ) : (
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
        )}
      </View>
    </View>
  );
}

type SummaryItemProps = {
  label: string;
  value: number;
  tone?: 'default' | 'success';
};

function SummaryItem({ label, value, tone = 'default' }: SummaryItemProps) {
  return (
    <View accessible accessibilityLabel={`${label} ${value}개`} style={styles.summaryItem}>
      <AppText tone={tone} variant="title" weight="heavy">
        {value}
      </AppText>
      <AppText tone="secondary" variant="caption" weight="semibold">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[3],
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  headingCopy: {
    flex: 1,
    gap: spacing[1],
  },
  feedbackBanner: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
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
  summaryCard: {
    alignItems: 'center',
    borderRadius: radii.lg,
    flexDirection: 'row',
    paddingHorizontal: spacing[2],
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing[1],
    paddingHorizontal: spacing[1],
    paddingVertical: spacing[2],
  },
  divider: {
    height: 40,
    width: 1,
  },
  taskSection: {
    gap: spacing[3],
    paddingTop: spacing[2],
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
  taskList: {
    gap: spacing[3],
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
