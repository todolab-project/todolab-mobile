import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { useDdayGoals } from '@/features/dday';
import {
  TaskDateQuickActions,
  TaskForm,
  useDeleteTask,
  useTaskDdayGoal,
  useTaskDetail,
  useUpdateTask,
} from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { TaskResponse, TaskStatus, TaskType, TaskUpsertRequest } from '@/types';
import { formatDateLabel, formatTimeLabel } from '@/utils';

export default function TaskDetailScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { taskId } = useLocalSearchParams<{ taskId?: string | string[] }>();
  const parsedTaskId = parseTaskId(taskId);
  const taskQuery = useTaskDetail(parsedTaskId);
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();
  const taskDdayGoal = useTaskDdayGoal();
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSubmit = (request: TaskUpsertRequest) => {
    if (parsedTaskId === null) {
      return;
    }

    updateTask.mutate(
      { taskId: parsedTaskId, request },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (parsedTaskId === null) {
      return;
    }

    deleteTask.mutate(parsedTaskId, {
      onSuccess: () => {
        router.replace('/');
      },
    });
  };

  return (
    <Screen scroll contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <Button
          accessibilityLabel="이전 화면으로 돌아가기"
          variant="ghost"
          onPress={() => router.back()}
        >
          ← 돌아가기
        </Button>
      </View>

      {parsedTaskId === null ? (
        <Card
          style={[
            styles.stateCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <AppText tone="danger" variant="bodyLarge" weight="bold">
            Task를 찾을 수 없어요
          </AppText>
          <AppText tone="secondary" variant="label">
            올바르지 않은 상세 주소예요. 목록에서 다시 선택해 주세요.
          </AppText>
        </Card>
      ) : taskQuery.isPending ? (
        <Card accessibilityLabel="Task 상세를 불러오는 중" style={styles.loadingCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            할 일 정보를 불러오고 있어요.
          </AppText>
        </Card>
      ) : taskQuery.error ? (
        <Card
          style={[
            styles.stateCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.stateCopy}>
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              상세 정보를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="label">
              {taskQuery.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void taskQuery.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : taskQuery.data && isEditing ? (
        <View style={styles.editing}>
          <View style={styles.titleBlock}>
            <AppText variant="title" weight="heavy">
              할 일 수정
            </AppText>
            <AppText tone="secondary" variant="label">
              지금 필요한 정보만 고쳐도 괜찮아요.
            </AppText>
          </View>
          <TaskForm
            errorMessage={updateTask.error?.message}
            initialTask={taskQuery.data}
            isSubmitting={updateTask.isPending}
            submitLabel="수정 완료"
            onCancel={() => {
              updateTask.reset();
              setIsEditing(false);
            }}
            onSubmit={handleSubmit}
          />
        </View>
      ) : taskQuery.data ? (
        <TaskDetail
          deleteErrorMessage={deleteTask.error?.message}
          isConfirmingDelete={isConfirmingDelete}
          isDeleting={deleteTask.isPending}
          taskDdayGoal={taskDdayGoal}
          task={taskQuery.data}
          onCancelDelete={() => {
            deleteTask.reset();
            setIsConfirmingDelete(false);
          }}
          onConfirmDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
          onRequestDelete={() => setIsConfirmingDelete(true)}
        />
      ) : null}
    </Screen>
  );
}

function TaskDetail({
  task,
  deleteErrorMessage,
  isConfirmingDelete,
  isDeleting,
  taskDdayGoal,
  onCancelDelete,
  onConfirmDelete,
  onEdit,
  onRequestDelete,
}: {
  task: TaskResponse;
  deleteErrorMessage?: string | null;
  isConfirmingDelete: boolean;
  isDeleting: boolean;
  taskDdayGoal: ReturnType<typeof useTaskDdayGoal>;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onEdit: () => void;
  onRequestDelete: () => void;
}) {
  const theme = useAppTheme();
  const ddayGoals = useDdayGoals();
  const status = statusLabels[task.status];
  const scheduleLabel = getScheduleLabel(task);

  return (
    <View style={styles.detail}>
      <Card style={styles.heroCard}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  task.status === 'DONE' ? theme.colors.successSoft : theme.colors.primarySoft,
              },
            ]}
          >
            <AppText
              tone={task.status === 'DONE' ? 'success' : 'primary'}
              variant="caption"
              weight="bold"
            >
              {status}
            </AppText>
          </View>
          <AppText tone="secondary" variant="caption" weight="semibold">
            {typeLabels[task.type]}
          </AppText>
        </View>

        <View style={styles.titleBlock}>
          <AppText variant="title" weight="heavy">
            {task.title}
          </AppText>
          {task.description ? (
            <AppText tone="secondary" variant="body">
              {task.description}
            </AppText>
          ) : (
            <AppText tone="muted" variant="label">
              아직 설명이 없어요.
            </AppText>
          )}
        </View>

        <View style={styles.heroActions}>
          <Button disabled={isDeleting} fullWidth variant="secondary" onPress={onEdit}>
            수정하기
          </Button>
          <Button disabled={isDeleting} fullWidth variant="danger" onPress={onRequestDelete}>
            삭제하기
          </Button>
        </View>
      </Card>

      {isConfirmingDelete ? (
        <Card
          style={[
            styles.deleteCard,
            { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
          ]}
        >
          <View style={styles.stateCopy}>
            <AppText tone="danger" variant="bodyLarge" weight="bold">
              정말 삭제할까요?
            </AppText>
            <AppText tone="secondary" variant="label">
              삭제한 할 일은 현재 앱에서 되돌릴 수 없어요. 필요한 기록인지 한 번만 더 확인해 주세요.
            </AppText>
          </View>

          {deleteErrorMessage ? (
            <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
              {deleteErrorMessage}
            </AppText>
          ) : null}

          <View style={styles.deleteActions}>
            <Button disabled={isDeleting} fullWidth variant="secondary" onPress={onCancelDelete}>
              취소
            </Button>
            <Button fullWidth loading={isDeleting} variant="danger" onPress={onConfirmDelete}>
              영구 삭제
            </Button>
          </View>
        </Card>
      ) : null}

      <TaskDateQuickActions task={task} />

      <Card style={styles.section}>
        <AppText variant="bodyLarge" weight="bold">
          일정 정보
        </AppText>
        <InfoRow label="일정" value={scheduleLabel} />
        <InfoRow
          label="계획일"
          value={task.plannedDate ? formatDateLabel(task.plannedDate) : '없음'}
        />
        <InfoRow
          label="목표일"
          value={task.targetDate ? formatDateLabel(task.targetDate) : '없음'}
        />
        <InfoRow label="종일" value={task.allDay ? '예' : '아니오'} />
      </Card>

      <Card style={styles.section}>
        <AppText variant="bodyLarge" weight="bold">
          분류와 연결
        </AppText>
        <InfoRow label="카테고리" value={task.category ?? '없음'} />
        <InfoRow label="D-Day" value={getDdayLabel(task)} />
        <InfoRow label="미룬 이유" value={task.deferReasonLabel ?? '없음'} />
        <InfoRow label="이월 횟수" value={`${task.carryOverCount}회`} />
      </Card>

      <Card style={styles.section}>
        <View style={styles.stateCopy}>
          <AppText variant="bodyLarge" weight="bold">
            D-Day 목표
          </AppText>
          <AppText tone="secondary" variant="label">
            이 할 일을 장기 목표와 연결해 진행 상황을 함께 모아보세요.
          </AppText>
        </View>

        {ddayGoals.isPending ? (
          <View accessibilityLabel="D-Day 목표를 불러오는 중" style={styles.inlineLoading}>
            <ActivityIndicator color={theme.colors.primary} />
            <AppText tone="secondary" variant="label">
              목표를 불러오고 있어요.
            </AppText>
          </View>
        ) : ddayGoals.error ? (
          <View style={styles.stateCopy}>
            <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
              {ddayGoals.error.message}
            </AppText>
            <Button
              disabled={taskDdayGoal.isPending}
              variant="secondary"
              onPress={() => void ddayGoals.refetch()}
            >
              다시 시도
            </Button>
          </View>
        ) : ddayGoals.data?.length ? (
          <View style={styles.goalActions}>
            {ddayGoals.data.map((goal) => {
              const isConnected = task.ddayGoalId === goal.id;

              return (
                <Button
                  key={goal.id}
                  accessibilityLabel={`${goal.title} D-Day 목표${isConnected ? ' 연결됨' : ' 연결하기'}`}
                  disabled={taskDdayGoal.isPending || isConnected}
                  variant={isConnected ? 'primary' : 'secondary'}
                  onPress={() =>
                    taskDdayGoal.mutate({
                      taskId: task.id,
                      ddayGoalId: goal.id,
                    })
                  }
                >
                  {isConnected ? `✓ ${goal.title}` : goal.title}
                </Button>
              );
            })}
            {task.ddayGoalId !== null ? (
              <Button
                disabled={taskDdayGoal.isPending}
                loading={taskDdayGoal.isPending}
                variant="ghost"
                onPress={() =>
                  taskDdayGoal.mutate({
                    taskId: task.id,
                    ddayGoalId: null,
                  })
                }
              >
                목표 연결 해제
              </Button>
            ) : null}
            {taskDdayGoal.isPending ? (
              <View accessibilityLiveRegion="polite" style={styles.inlineLoading}>
                <ActivityIndicator color={theme.colors.primary} />
                <AppText tone="secondary" variant="label">
                  목표 연결을 변경하고 있어요.
                </AppText>
              </View>
            ) : null}
          </View>
        ) : (
          <AppText tone="muted" variant="label">
            연결할 D-Day 목표가 없어요. D-Day 탭에서 먼저 목표를 만들어 주세요.
          </AppText>
        )}

        {taskDdayGoal.error ? (
          <AppText accessibilityLiveRegion="polite" tone="danger" variant="caption">
            {taskDdayGoal.error.message}
          </AppText>
        ) : null}
      </Card>

      <Card variant="muted" style={styles.footerCard}>
        <InfoRow label="생성" value={getDateTimeLabel(task.createdAt)} />
        <InfoRow label="수정" value={task.updatedAt ? getDateTimeLabel(task.updatedAt) : '없음'} />
        <InfoRow
          label="완료"
          value={task.completedAt ? getDateTimeLabel(task.completedAt) : '없음'}
        />
      </Card>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText tone="secondary" variant="label" weight="semibold">
        {label}
      </AppText>
      <AppText align="right" variant="label" weight="bold" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );
}

function parseTaskId(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const numericValue = Number(rawValue);

  if (!rawValue || !Number.isInteger(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
}

function getScheduleLabel(task: TaskResponse) {
  if (task.allDay) {
    return '종일';
  }

  if (task.startAt && task.endAt) {
    return `${getDateTimeLabel(task.startAt)} - ${formatTimeLabel(task.endAt)}`;
  }

  if (task.startAt) {
    return getDateTimeLabel(task.startAt);
  }

  return task.unscheduled ? '시간 미정' : '없음';
}

function getDateTimeLabel(value: TaskResponse['createdAt']) {
  const [date] = value.split('T');

  return `${formatDateLabel(date as TaskResponse['plannedDate'] & string)} ${formatTimeLabel(value)}`;
}

function getDdayLabel(task: TaskResponse) {
  if (!task.ddayGoalTitle) {
    return '없음';
  }

  if (task.ddayDaysLeft === null) {
    return task.ddayGoalTitle;
  }

  const dayLabel =
    task.ddayDaysLeft === 0
      ? 'D-Day'
      : task.ddayDaysLeft > 0
        ? `D-${task.ddayDaysLeft}`
        : `D+${Math.abs(task.ddayDaysLeft)}`;

  return `${task.ddayGoalTitle} · ${dayLabel}`;
}

const statusLabels: Record<TaskStatus, string> = {
  DONE: '완료',
  INBOX: '기록함',
  TODAY: '오늘',
};

const typeLabels: Record<TaskType, string> = {
  IDEA: '아이디어',
  SCHEDULE: '일정',
  TODO: '할 일',
};

const styles = StyleSheet.create({
  screen: {
    gap: spacing[4],
    paddingTop: spacing[3],
  },
  header: {
    alignItems: 'flex-start',
  },
  loadingCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 120,
  },
  stateCard: {
    gap: spacing[4],
  },
  stateCopy: {
    gap: spacing[1],
  },
  detail: {
    gap: spacing[3],
  },
  editing: {
    gap: spacing[4],
  },
  heroCard: {
    gap: spacing[4],
  },
  heroActions: {
    gap: spacing[2],
  },
  deleteCard: {
    gap: spacing[4],
  },
  deleteActions: {
    gap: spacing[2],
  },
  goalActions: {
    gap: spacing[2],
  },
  inlineLoading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: radii.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  titleBlock: {
    gap: spacing[2],
  },
  section: {
    gap: spacing[3],
  },
  footerCard: {
    gap: spacing[2],
  },
  infoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'space-between',
  },
  infoValue: {
    flex: 1,
  },
});
