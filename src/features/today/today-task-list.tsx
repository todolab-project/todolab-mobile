import { StyleSheet, View } from 'react-native';

import { TaskCard } from '@/features/tasks';
import { spacing } from '@/theme';
import type { TaskResponse } from '@/types';

type TodayTaskListProps = {
  tasks: TaskResponse[];
  disabled: boolean;
  completingTaskId?: number;
  onComplete: (taskId: number) => void;
  onOpen: (taskId: number) => void;
};

export function TodayTaskList({
  tasks,
  disabled,
  completingTaskId,
  onComplete,
  onOpen,
}: TodayTaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          completionDisabled={disabled}
          isCompleting={completingTaskId === task.id}
          onComplete={() => onComplete(task.id)}
          onOpen={() => onOpen(task.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing[1],
  },
});
