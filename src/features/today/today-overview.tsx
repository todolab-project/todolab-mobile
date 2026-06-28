import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import {
  TaskCard,
  useClearDeferReason,
  useCompleteTask,
  useDeleteTask,
  useMoveTaskToInbox,
  useMoveTaskToToday,
  useReopenTask,
  useReorderTodayTask,
  useSetDeferReason,
} from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { DeferReason, LocalDateString, TaskResponse } from '@/types';
import { deferReasonLabels } from '@/types';
import { formatTimeLabel, shiftLocalDate } from '@/utils';

import {
  getTodayLoadGuidance,
  RECOMMENDED_TODAY_TASK_COUNT,
  splitTodayTasks,
} from './today-task-sections';
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
    refetch,
  } = overview;
  const completeTask = useCompleteTask(date);
  const moveToToday = useMoveTaskToToday(date);
  const tomorrow = shiftLocalDate(date, 1) ?? date;
  const moveToTomorrow = useMoveTaskToToday(tomorrow);
  const moveToInbox = useMoveTaskToInbox();
  const reopenTask = useReopenTask(date);
  const reorderTodayTask = useReorderTodayTask(date);
  const deleteTask = useDeleteTask();
  const setDeferReason = useSetDeferReason();
  const clearDeferReason = useClearDeferReason();
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [confirmingDeleteTaskId, setConfirmingDeleteTaskId] = useState<number | null>(null);
  const { scheduleTasks, executionTasks } = splitTodayTasks(todayTasks);
  const loadGuidance = getTodayLoadGuidance(executionTasks.length, scheduleTasks.length);
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
        <SummaryItem label="오늘 계획" value={todayTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="미완료" value={staleTasks.length} tone="warning" />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="추천" value={recommendations.length} tone="primary" />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="기록함" value={inboxTasks.length} />
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <SummaryItem label="완료" value={doneTasks.length} tone="success" />
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
        <Card style={styles.staleCard}>
          <View style={styles.taskSectionHeading}>
            <View style={styles.taskSectionCopy}>
              <AppText variant="bodyLarge" weight="bold">
                지난 미완료 정리
              </AppText>
              <AppText tone="secondary" variant="label">
                자동으로 오늘에 쌓지 않고, 다시 할지 직접 판단해요.
              </AppText>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.colors.warningSoft }]}>
              <AppText tone="warning" variant="caption" weight="bold">
                {staleTasks.length}개
              </AppText>
            </View>
          </View>

          {completeTask.error ||
          clearDeferReason.error ||
          deleteTask.error ||
          moveToInbox.error ||
          moveToToday.error ||
          moveToTomorrow.error ||
          setDeferReason.error ? (
            <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
              <AppText tone="danger" variant="label">
                {completeTask.error?.message ??
                  clearDeferReason.error?.message ??
                  deleteTask.error?.message ??
                  moveToInbox.error?.message ??
                  moveToToday.error?.message ??
                  moveToTomorrow.error?.message ??
                  setDeferReason.error?.message}
              </AppText>
            </View>
          ) : null}

          <View style={styles.stalePreviewList}>
            {staleTasks.slice(0, 3).map((task) => (
              <View key={task.id} style={styles.staleItem}>
                <Pressable
                  accessibilityLabel={`${task.title} 상세 보기`}
                  accessibilityRole="button"
                  onPress={() => openTask(task.id)}
                  style={({ pressed }) => [
                    styles.stalePreview,
                    {
                      backgroundColor: pressed
                        ? theme.colors.warningSoft
                        : theme.colors.surfaceMuted,
                    },
                  ]}
                >
                  <View style={styles.stalePreviewCopy}>
                    <AppText numberOfLines={1} variant="label" weight="bold">
                      {task.title}
                    </AppText>
                    <AppText tone="secondary" variant="caption">
                      {getStaleTaskMeta(task)}
                    </AppText>
                  </View>
                  <View style={styles.stalePreviewBadges}>
                    {task.carryOverCount > 0 ? (
                      <View
                        style={[styles.countPill, { backgroundColor: theme.colors.warningSoft }]}
                      >
                        <AppText tone="warning" variant="caption" weight="bold">
                          이월 {task.carryOverCount}회
                        </AppText>
                      </View>
                    ) : null}
                    <AppText tone="warning" variant="caption" weight="bold">
                      판단 필요
                    </AppText>
                  </View>
                </Pressable>

                <View style={styles.deferBlock}>
                  <View style={styles.deferHeading}>
                    <AppText variant="caption" weight="bold">
                      미룬 이유
                    </AppText>
                    <AppText tone={task.deferReason ? 'warning' : 'muted'} variant="caption">
                      {task.deferReasonLabel ?? '아직 선택하지 않았어요'}
                    </AppText>
                  </View>
                  <View style={styles.deferReasonGrid}>
                    {deferReasonOptions.map((reason) => {
                      const selected = task.deferReason === reason;

                      return (
                        <Button
                          disabled={isDeferReasonPending({
                            taskId: task.id,
                            clearDeferReason,
                            setDeferReason,
                          })}
                          key={reason}
                          loading={
                            setDeferReason.isPending &&
                            setDeferReason.variables?.taskId === task.id &&
                            setDeferReason.variables.reason === reason
                          }
                          variant={selected ? 'secondary' : 'ghost'}
                          onPress={() =>
                            setDeferReason.mutate(
                              { taskId: task.id, reason },
                              {
                                onSuccess: () =>
                                  showFeedback(
                                    `미룬 이유를 '${deferReasonLabels[reason]}'로 저장했어요.`,
                                  ),
                              },
                            )
                          }
                          style={styles.deferReasonButton}
                        >
                          {deferReasonLabels[reason]}
                        </Button>
                      );
                    })}
                    {task.deferReason ? (
                      <Button
                        disabled={isDeferReasonPending({
                          taskId: task.id,
                          clearDeferReason,
                          setDeferReason,
                        })}
                        loading={
                          clearDeferReason.isPending && clearDeferReason.variables === task.id
                        }
                        variant="ghost"
                        onPress={() =>
                          clearDeferReason.mutate(task.id, {
                            onSuccess: () => showFeedback('미룬 이유를 지웠어요.'),
                          })
                        }
                        style={styles.deferReasonButton}
                      >
                        이유 지우기
                      </Button>
                    ) : null}
                  </View>
                </View>

                <View style={styles.staleActionGrid}>
                  <Button
                    disabled={isStaleActionPending({
                      taskId: task.id,
                      completeTask,
                      deleteTask,
                      moveToInbox,
                      moveToToday,
                      moveToTomorrow,
                    })}
                    loading={moveToToday.isPending && moveToToday.variables === task.id}
                    variant="secondary"
                    onPress={() =>
                      moveToToday.mutate(task.id, {
                        onSuccess: () => showFeedback('지난 미완료를 오늘 할 일로 옮겼어요.'),
                      })
                    }
                    style={styles.staleActionButton}
                  >
                    오늘
                  </Button>
                  <Button
                    disabled={isStaleActionPending({
                      taskId: task.id,
                      completeTask,
                      deleteTask,
                      moveToInbox,
                      moveToToday,
                      moveToTomorrow,
                    })}
                    loading={moveToTomorrow.isPending && moveToTomorrow.variables === task.id}
                    variant="secondary"
                    onPress={() =>
                      moveToTomorrow.mutate(task.id, {
                        onSuccess: () => showFeedback('지난 미완료를 내일 할 일로 옮겼어요.'),
                      })
                    }
                    style={styles.staleActionButton}
                  >
                    내일
                  </Button>
                  <Button
                    disabled={isStaleActionPending({
                      taskId: task.id,
                      completeTask,
                      deleteTask,
                      moveToInbox,
                      moveToToday,
                      moveToTomorrow,
                    })}
                    variant="ghost"
                    onPress={() => openTask(task.id)}
                    style={styles.staleActionButton}
                  >
                    날짜 변경
                  </Button>
                  <Button
                    disabled={isStaleActionPending({
                      taskId: task.id,
                      completeTask,
                      deleteTask,
                      moveToInbox,
                      moveToToday,
                      moveToTomorrow,
                    })}
                    loading={moveToInbox.isPending && moveToInbox.variables === task.id}
                    variant="ghost"
                    onPress={() =>
                      moveToInbox.mutate(task.id, {
                        onSuccess: () => showFeedback('지난 미완료를 기록함으로 옮겼어요.'),
                      })
                    }
                    style={styles.staleActionButton}
                  >
                    기록함
                  </Button>
                  <Button
                    disabled={isStaleActionPending({
                      taskId: task.id,
                      completeTask,
                      deleteTask,
                      moveToInbox,
                      moveToToday,
                      moveToTomorrow,
                    })}
                    loading={completeTask.isPending && completeTask.variables === task.id}
                    variant="ghost"
                    onPress={() =>
                      completeTask.mutate(task.id, {
                        onSuccess: () => showFeedback('지난 미완료를 완료 처리했어요.'),
                      })
                    }
                    style={styles.staleActionButton}
                  >
                    완료
                  </Button>
                  <Button
                    disabled={deleteTask.isPending}
                    loading={deleteTask.isPending && deleteTask.variables === task.id}
                    variant={confirmingDeleteTaskId === task.id ? 'danger' : 'ghost'}
                    onPress={() => {
                      if (confirmingDeleteTaskId !== task.id) {
                        setConfirmingDeleteTaskId(task.id);
                        return;
                      }

                      deleteTask.mutate(task.id, {
                        onSuccess: () => {
                          setConfirmingDeleteTaskId(null);
                          showFeedback('지난 미완료를 삭제했어요.');
                        },
                      });
                    }}
                    style={styles.staleActionButton}
                  >
                    {confirmingDeleteTaskId === task.id ? '삭제 확인' : '삭제'}
                  </Button>
                </View>

                {confirmingDeleteTaskId === task.id ? (
                  <AppText align="center" tone="danger" variant="caption">
                    한 번 더 누르면 영구 삭제돼요.
                  </AppText>
                ) : null}
              </View>
            ))}
          </View>

          {staleTasks.length > 3 ? (
            <AppText align="center" tone="secondary" variant="caption">
              외 {staleTasks.length - 3}개는 상세 화면에서 이어서 판단할 수 있어요.
            </AppText>
          ) : null}
        </Card>
      ) : null}

      {recommendations.length > 0 ? (
        <Card style={styles.recommendationCard}>
          <View style={styles.taskSectionHeading}>
            <View style={styles.taskSectionCopy}>
              <AppText variant="bodyLarge" weight="bold">
                오늘의 추천
              </AppText>
              <AppText tone="secondary" variant="label">
                오늘 해볼 만한 일을 가볍게 골라보세요.
              </AppText>
            </View>
            <View style={[styles.countPill, { backgroundColor: theme.colors.primarySoft }]}>
              <AppText tone="primary" variant="caption" weight="bold">
                {recommendations.length}개
              </AppText>
            </View>
          </View>

          {moveToToday.error ? (
            <View style={[styles.inlineError, { backgroundColor: theme.colors.dangerSoft }]}>
              <AppText tone="danger" variant="label">
                {moveToToday.error.message}
              </AppText>
            </View>
          ) : null}

          <View style={styles.recommendationList}>
            {recommendations.slice(0, 3).map((recommendation) => (
              <View key={recommendation.task.id} style={styles.recommendationItem}>
                <Pressable
                  accessibilityLabel={`${recommendation.task.title} 상세 보기`}
                  accessibilityRole="button"
                  onPress={() => openTask(recommendation.task.id)}
                  style={({ pressed }) => [
                    styles.recommendationPreview,
                    {
                      backgroundColor: pressed
                        ? theme.colors.primarySoft
                        : theme.colors.surfaceMuted,
                    },
                  ]}
                >
                  <View style={styles.stalePreviewCopy}>
                    <AppText numberOfLines={1} variant="label" weight="bold">
                      {recommendation.task.title}
                    </AppText>
                    <AppText numberOfLines={2} tone="secondary" variant="caption">
                      {recommendation.reason}
                    </AppText>
                  </View>
                </Pressable>
                <Button
                  disabled={moveToToday.isPending}
                  loading={
                    moveToToday.isPending && moveToToday.variables === recommendation.task.id
                  }
                  variant="secondary"
                  onPress={() =>
                    moveToToday.mutate(recommendation.task.id, {
                      onSuccess: () => showFeedback('추천 항목을 오늘 할 일로 추가했어요.'),
                    })
                  }
                >
                  Today 추가
                </Button>
              </View>
            ))}
          </View>

          {recommendations.length > 3 ? (
            <AppText align="center" tone="secondary" variant="caption">
              외 {recommendations.length - 3}개 추천은 새로고침 후 이어서 확인할 수 있어요.
            </AppText>
          ) : null}
        </Card>
      ) : null}

      <View style={styles.scheduleSection}>
        <View style={styles.taskSectionHeading}>
          <View style={styles.taskSectionCopy}>
            <AppText variant="bodyLarge" weight="bold">
              캘린더 일정
            </AppText>
            <AppText tone="secondary" variant="label">
              시간 약속을 먼저 훑고 실행할 일에 집중해요.
            </AppText>
          </View>
          <View style={[styles.countPill, { backgroundColor: theme.colors.surfaceMuted }]}>
            <AppText tone="secondary" variant="caption" weight="bold">
              {scheduleTasks.length}개
            </AppText>
          </View>
        </View>

        {scheduleTasks.length === 0 ? (
          <Card variant="muted" style={styles.scheduleEmptyCard}>
            <AppText tone="secondary" variant="label">
              오늘 예정된 일정이 없어요.
            </AppText>
          </Card>
        ) : (
          <Card padded={false} style={styles.scheduleCard}>
            {scheduleTasks.map((task, index) => (
              <ScheduleItem
                isLast={index === scheduleTasks.length - 1}
                key={task.id}
                task={task}
                onOpen={() => openTask(task.id)}
              />
            ))}
          </Card>
        )}
      </View>

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
          <View style={styles.taskList}>
            {executionTasks.map((task, index) => (
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
                action={
                  <View style={styles.reorderActions}>
                    <Button
                      accessibilityLabel={`${task.title}, 실행 순서 위로 이동`}
                      disabled={reorderTodayTask.isPending || index === 0}
                      variant="ghost"
                      onPress={() =>
                        reorderTodayTask.mutate(
                          { taskId: task.id, direction: 'UP' },
                          { onSuccess: () => showFeedback('실행 순서를 위로 옮겼어요.') },
                        )
                      }
                      style={styles.reorderButton}
                    >
                      ↑ 위로
                    </Button>
                    <Button
                      accessibilityLabel={`${task.title}, 실행 순서 아래로 이동`}
                      disabled={reorderTodayTask.isPending || index === executionTasks.length - 1}
                      variant="ghost"
                      onPress={() =>
                        reorderTodayTask.mutate(
                          { taskId: task.id, direction: 'DOWN' },
                          { onSuccess: () => showFeedback('실행 순서를 아래로 옮겼어요.') },
                        )
                      }
                      style={styles.reorderButton}
                    >
                      ↓ 아래로
                    </Button>
                  </View>
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

type ScheduleItemProps = {
  task: TaskResponse;
  isLast: boolean;
  onOpen: () => void;
};

function ScheduleItem({ task, isLast, onOpen }: ScheduleItemProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityLabel={`${task.title}, ${getScheduleTimeLabel(task)}, 상세 보기`}
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [
        styles.scheduleItem,
        !isLast && { borderBottomColor: theme.colors.border, borderBottomWidth: 1 },
        { backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface },
      ]}
    >
      <View style={[styles.scheduleTime, { backgroundColor: theme.colors.primarySoft }]}>
        <AppText align="center" tone="primary" variant="caption" weight="bold">
          {getScheduleTimeLabel(task)}
        </AppText>
      </View>
      <View style={styles.scheduleCopy}>
        <AppText numberOfLines={1} variant="label" weight="bold">
          {task.title}
        </AppText>
        {task.description || task.category ? (
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {task.description ?? task.category}
          </AppText>
        ) : null}
      </View>
      <AppText tone="muted" variant="bodyLarge">
        ›
      </AppText>
    </Pressable>
  );
}

function getScheduleTimeLabel(task: TaskResponse) {
  if (task.allDay || !task.startAt) {
    return '종일';
  }

  const start = formatTimeLabel(task.startAt);

  return task.endAt ? `${start}–${formatTimeLabel(task.endAt)}` : start;
}

type SummaryItemProps = {
  label: string;
  value: number;
  tone?: 'default' | 'primary' | 'success' | 'warning';
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

function getStaleTaskMeta(task: { plannedDate: LocalDateString | null; carryOverCount: number }) {
  const plannedLabel = task.plannedDate ? `계획일 ${task.plannedDate}` : '계획일 없음';

  return plannedLabel;
}

const deferReasonOptions = Object.keys(deferReasonLabels) as DeferReason[];

function isStaleActionPending({
  taskId,
  completeTask,
  deleteTask,
  moveToInbox,
  moveToToday,
  moveToTomorrow,
}: {
  taskId: number;
  completeTask: ReturnType<typeof useCompleteTask>;
  deleteTask: ReturnType<typeof useDeleteTask>;
  moveToInbox: ReturnType<typeof useMoveTaskToInbox>;
  moveToToday: ReturnType<typeof useMoveTaskToToday>;
  moveToTomorrow: ReturnType<typeof useMoveTaskToToday>;
}) {
  return (
    (completeTask.isPending && completeTask.variables === taskId) ||
    (deleteTask.isPending && deleteTask.variables === taskId) ||
    (moveToInbox.isPending && moveToInbox.variables === taskId) ||
    (moveToToday.isPending && moveToToday.variables === taskId) ||
    (moveToTomorrow.isPending && moveToTomorrow.variables === taskId)
  );
}

function isDeferReasonPending({
  taskId,
  clearDeferReason,
  setDeferReason,
}: {
  taskId: number;
  clearDeferReason: ReturnType<typeof useClearDeferReason>;
  setDeferReason: ReturnType<typeof useSetDeferReason>;
}) {
  return (
    (clearDeferReason.isPending && clearDeferReason.variables === taskId) ||
    (setDeferReason.isPending && setDeferReason.variables?.taskId === taskId)
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
  staleCard: {
    gap: spacing[3],
  },
  recommendationCard: {
    gap: spacing[3],
  },
  countPill: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
  },
  stalePreviewList: {
    gap: spacing[2],
  },
  staleItem: {
    gap: spacing[2],
  },
  stalePreview: {
    alignItems: 'center',
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  stalePreviewCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
  },
  recommendationList: {
    gap: spacing[2],
  },
  recommendationItem: {
    gap: spacing[2],
  },
  recommendationPreview: {
    borderRadius: radii.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  stalePreviewBadges: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  deferBlock: {
    gap: spacing[2],
  },
  deferHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  deferReasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  deferReasonButton: {
    flexGrow: 1,
    minWidth: 112,
  },
  staleActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  staleActionButton: {
    flexGrow: 1,
    minWidth: 88,
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
  scheduleSection: {
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  scheduleCard: {
    overflow: 'hidden',
  },
  scheduleEmptyCard: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  scheduleItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    minHeight: 64,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  scheduleTime: {
    alignItems: 'center',
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing[2],
    width: 96,
  },
  scheduleCopy: {
    flex: 1,
    gap: spacing[1],
    minWidth: 0,
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
  reorderActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  reorderButton: {
    minWidth: 88,
  },
});
