import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText, Button, Card, EmptyState } from '@/components/ui';
import { TaskCard } from '@/features/tasks';
import { spacing, useAppTheme } from '@/theme';
import type { LocalDateString, TaskResponse } from '@/types';
import { formatDateLabel } from '@/utils';

import { useCalendarDayTasks } from './use-calendar-day-tasks';

type CalendarDayTasksProps = {
  date: LocalDateString;
};

export function CalendarDayTasks({ date }: CalendarDayTasksProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const query = useCalendarDayTasks(date);
  const { scheduledTasks, doneTasks } = query;
  const hasTasks = scheduledTasks.length > 0 || doneTasks.length > 0;
  const dateLabel = formatDateLabel(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  const openTask = (taskId: number) => {
    router.push({ pathname: '/tasks/[taskId]', params: { taskId: String(taskId) } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText tone="primary" variant="caption" weight="bold">
            선택한 날짜
          </AppText>
          <AppText variant="bodyLarge" weight="bold">
            {dateLabel}
          </AppText>
        </View>
        {query.isFetching && !query.isPending ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : null}
      </View>

      {query.isPending ? (
        <Card accessibilityLabel={`${dateLabel} Task를 불러오는 중`} style={styles.stateCard}>
          <ActivityIndicator color={theme.colors.primary} />
          <AppText tone="secondary" variant="label">
            예정과 완료 항목을 불러오고 있어요.
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
            <AppText tone="danger" variant="label" weight="bold">
              이 날짜의 Task를 불러오지 못했어요
            </AppText>
            <AppText tone="secondary" variant="caption">
              {query.error.message}
            </AppText>
          </View>
          <Button variant="secondary" onPress={() => void query.refetch()}>
            다시 시도
          </Button>
        </Card>
      ) : !hasTasks ? (
        <Card>
          <EmptyState
            title="예정된 항목이 없어요"
            description="다른 날짜를 선택하거나 새 Task의 날짜를 정해보세요."
          />
        </Card>
      ) : (
        <>
          {scheduledTasks.length > 0 ? (
            <TaskSection
              title="예정"
              tasks={scheduledTasks}
              onOpen={(taskId) => openTask(taskId)}
            />
          ) : null}
          {doneTasks.length > 0 ? (
            <TaskSection title="완료" tasks={doneTasks} onOpen={(taskId) => openTask(taskId)} />
          ) : null}
        </>
      )}
    </View>
  );
}

type TaskSectionProps = {
  title: string;
  tasks: TaskResponse[];
  onOpen: (taskId: number) => void;
};

function TaskSection({ title, tasks, onOpen }: TaskSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <AppText variant="label" weight="bold">
          {title}
        </AppText>
        <AppText tone="secondary" variant="caption" weight="semibold">
          {tasks.length}개
        </AppText>
      </View>
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onOpen={() => onOpen(task.id)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[4],
  },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
  },
  headingCopy: {
    flex: 1,
    gap: spacing[1],
  },
  stateCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[3],
    justifyContent: 'center',
    minHeight: 96,
  },
  errorCard: {
    gap: spacing[3],
  },
  errorCopy: {
    gap: spacing[1],
  },
  section: {
    gap: spacing[3],
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskList: {
    gap: spacing[2],
  },
});
