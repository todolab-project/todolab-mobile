import type { TaskResponse, TodayOrderDirection } from '@/types';

export function splitTodayTasks(tasks: TaskResponse[]) {
  return {
    scheduleTasks: tasks.filter((task) => task.type === 'SCHEDULE'),
    executionTasks: tasks.filter((task) => task.type !== 'SCHEDULE'),
  };
}

export function reorderTodayTasks(
  tasks: TaskResponse[],
  taskId: number,
  direction: TodayOrderDirection,
) {
  const executableIndexes = tasks
    .map((task, index) => (task.type === 'SCHEDULE' ? null : index))
    .filter((index): index is number => index !== null);
  const currentExecutableIndex = executableIndexes.findIndex(
    (taskIndex) => tasks[taskIndex]?.id === taskId,
  );
  const nextExecutableIndex =
    direction === 'UP' ? currentExecutableIndex - 1 : currentExecutableIndex + 1;

  if (
    currentExecutableIndex < 0 ||
    nextExecutableIndex < 0 ||
    nextExecutableIndex >= executableIndexes.length
  ) {
    return tasks;
  }

  const currentIndex = executableIndexes[currentExecutableIndex];
  const nextIndex = executableIndexes[nextExecutableIndex];
  const reordered = [...tasks];

  [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];

  return reordered;
}
