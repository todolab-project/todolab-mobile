import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';

import { useDdayGoalTasks } from './use-dday-goal-tasks';

type DdayGoalTasksProps = {
  goalId: number;
  goalTitle: string;
};

export function DdayGoalTasks({ goalId, goalTitle }: DdayGoalTasksProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const query = useDdayGoalTasks(goalId);
  const tasks = query.data ?? [];

  if (query.isPending) {
    return (
      <Card accessibilityLabel={`${goalTitle} 연결 Task를 불러오는 중`} style={styles.stateCard}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
        <AppText tone="secondary" variant="caption">
          연결된 할 일을 불러오고 있어요.
        </AppText>
      </Card>
    );
  }

  if (query.error) {
    return (
      <Card
        style={[
          styles.errorCard,
          { backgroundColor: theme.colors.dangerSoft, borderColor: theme.colors.danger },
        ]}
      >
        <View style={styles.errorCopy}>
          <AppText tone="danger" variant="label" weight="bold">
            연결된 할 일을 불러오지 못했어요
          </AppText>
          <AppText tone="secondary" variant="caption">
            {query.error.message}
          </AppText>
        </View>
        <Button variant="secondary" onPress={() => void query.refetch()}>
          다시 시도
        </Button>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card variant="muted">
        <EmptyState
          title="연결된 할 일이 없어요"
          description="Task 상세에서 이 목표를 연결하면 이곳에 표시돼요."
        />
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <AppText variant="label" weight="bold">
          연결된 할 일
        </AppText>
        <AppText tone="secondary" variant="caption" weight="semibold">
          {tasks.length}개
        </AppText>
      </View>
      <View style={styles.taskList}>
        {tasks.map((task) => (
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[2],
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
  },
  taskList: {
    gap: spacing[2],
  },
  stateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
    minHeight: 72,
  },
  errorCard: {
    gap: spacing[3],
  },
  errorCopy: {
    gap: spacing[1],
  },
});
