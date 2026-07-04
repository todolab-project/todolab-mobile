import { taskQueryKeys } from '@/features/tasks';
import type { LocalDateString, TaskResponse } from '@/types';

export function getCalendarDayQueryKeys(date: LocalDateString) {
  return {
    scheduled: taskQueryKeys.today(date),
    done: taskQueryKeys.done(date),
  };
}

export function dedupeCalendarDayTasks(tasks: TaskResponse[]) {
  const taskIds = new Set<number>();

  return tasks.filter((task) => {
    if (taskIds.has(task.id)) return false;

    taskIds.add(task.id);
    return true;
  });
}
