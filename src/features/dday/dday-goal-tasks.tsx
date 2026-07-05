import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, EmptyState, InlineNotice, SectionHeader } from '@/components/ui';
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
      <View accessibilityLabel={`${goalTitle} 연결 Task를 불러오는 중`} style={styles.stateRow}>
        <ActivityIndicator color={theme.colors.primary} size="small" />
        <AppText tone="secondary" variant="caption">
          연결된 할 일을 불러오고 있어요.
        </AppText>
      </View>
    );
  }

  if (query.error) {
    return (
      <InlineNotice
        message={query.error.message}
        title="연결된 할 일을 불러오지 못했어요"
        tone="danger"
        action={
          <Button size="compact" variant="ghost" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        }
      />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="연결된 할 일이 없어요"
        description="할 일 상세에서 이 목표를 연결할 수 있어요."
      />
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader count={tasks.length} title="연결된 할 일" />
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
  taskList: {
    gap: spacing[1],
  },
  stateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
    minHeight: 72,
  },
});
