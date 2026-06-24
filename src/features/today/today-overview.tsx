import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import { TaskCard, useCompleteTask, useMoveTaskToToday } from '@/features/tasks';
import { radii, spacing, useAppTheme } from '@/theme';
import type { LocalDateString } from '@/types';

import { useTodayOverview } from './use-today-overview';

type TodayOverviewProps = {
  date: LocalDateString;
};

export function TodayOverview({ date }: TodayOverviewProps) {
  const theme = useAppTheme();
  const { todayTasks, doneTasks, inboxTasks, isPending, error, refetch } = useTodayOverview(date);
  const completeTask = useCompleteTask(date);
  const moveToToday = useMoveTaskToToday(date);

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
        <AppText variant="bodyLarge" weight="bold">
          오늘의 흐름
        </AppText>
        <AppText tone="secondary" variant="label">
          해야 할 일과 기록을 한눈에 확인해요.
        </AppText>
      </View>

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
            />
          </Card>
        ) : (
          <View style={styles.taskList}>
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                completionDisabled={completeTask.isPending}
                isCompleting={completeTask.isPending && completeTask.variables === task.id}
                onComplete={() => completeTask.mutate(task.id)}
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
          <Card variant="muted" style={styles.compactEmptyCard}>
            <AppText align="center" tone="secondary" variant="label">
              기록함이 비어 있어요.
            </AppText>
          </Card>
        ) : (
          <View style={styles.taskList}>
            {inboxTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                action={
                  <Button
                    accessibilityLabel={`${task.title}, 오늘 할 일로 이동`}
                    loading={moveToToday.isPending && moveToToday.variables === task.id}
                    disabled={moveToToday.isPending}
                    variant="secondary"
                    onPress={() => moveToToday.mutate(task.id)}
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
    gap: spacing[1],
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
  compactEmptyCard: {
    borderWidth: 0,
    paddingVertical: spacing[4],
  },
  moveButton: {
    minWidth: 88,
  },
});
